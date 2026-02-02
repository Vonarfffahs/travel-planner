import {
  AlgorithmParameters,
  HistoricPlace,
  TravelCost,
} from 'generated/prisma/client';
import { SolverResult, TravelSolver } from '../interfaces';

export class AntColonySolver implements TravelSolver {
  private places: HistoricPlace[];
  private costMatrix: Map<string, number>;

  // Параметри алгоритму (з дефолтними значеннями)
  private alpha: number; // Важливість феромону (досвіду)
  private beta: number; // Важливість евристики (жадібності)
  private rho: number; // Швидкість випаровування (0..1)
  private q: number; // Кількість феромону, яку залишає мураха
  private antCount: number;
  private iterations: number;

  // Матриця феромонів: "id1_id2" -> рівень феромону
  private pheromones: Map<string, number>;

  constructor(
    places: HistoricPlace[],
    costs: TravelCost[],
    params?: Partial<AlgorithmParameters> | null, // Параметри можуть прийти з БД або бути null
  ) {
    this.places = places;
    this.costMatrix = new Map();
    this.pheromones = new Map();

    // 1. Ініціалізація матриці витрат
    costs.forEach((c) => {
      this.costMatrix.set(`${c.sourceId}_${c.destinationId}`, c.travelCost);
      this.costMatrix.set(`${c.destinationId}_${c.sourceId}`, c.travelCost);

      // Початковий рівень феромону (мале число, щоб дати шанс евристиці)
      this.initPheromone(c.sourceId, c.destinationId, 0.1);
    });

    // 2. Ініціалізація параметрів (або беремо з БД, або дефолтні)
    this.alpha = params?.alpha ?? 1; // Баланс (зазвичай 1)
    this.beta = params?.beta ?? 3; // Евристика важливіша (2-5)
    this.rho = params?.evaporationRate ?? 0.1; // 10% випаровується
    this.iterations = params?.iterations ?? 50;
    this.antCount = params?.antCount ?? 10;
    this.q = 100.0; // Константа для нормування феромону
  }

  private initPheromone(from: string, to: string, value: number) {
    this.pheromones.set(`${from}_${to}`, value);
    this.pheromones.set(`${to}_${from}`, value);
  }

  public solve(maxCost: number, maxTime: number): SolverResult {
    const startTime = performance.now();

    // Глобально найкращий результат за всі ітерації
    let globalBestPath: string[] = [];
    let globalBestValue = -Infinity;
    let globalBestCost = 0;
    let globalBestTime = 0;

    // --- ГОЛОВНИЙ ЦИКЛ (ІТЕРАЦІЇ) ---
    for (let iter = 0; iter < this.iterations; iter++) {
      // Зберігаємо найкращу мураху поточної ітерації
      let iterationBestPath: string[] = [];
      let iterationBestValue = -Infinity;

      // --- ЦИКЛ МУРАХ ---
      for (let k = 0; k < this.antCount; k++) {
        const { path, value, cost, time } = this.buildAntSolution(
          maxCost,
          maxTime,
        );

        // Перевіряємо, чи ця мураха знайшла кращий шлях у цій ітерації
        if (value > iterationBestValue) {
          iterationBestValue = value;
          iterationBestPath = path;
        }

        // Перевіряємо, чи це глобально найкращий шлях
        if (value > globalBestValue) {
          globalBestValue = value;
          globalBestPath = path;
          globalBestCost = cost;
          globalBestTime = time;
        }
      }

      // --- ОНОВЛЕННЯ ФЕРОМОНІВ ---
      this.updatePheromones(iterationBestPath, iterationBestValue);
    }

    return {
      path: globalBestPath,
      totalValue: globalBestValue > 0 ? globalBestValue : 0,
      totalCost: globalBestCost,
      totalTime: globalBestTime,
      calculationTime: performance.now() - startTime,
    };
  }

  // Логіка однієї мурахи
  private buildAntSolution(maxCost: number, maxTime: number) {
    const visited = new Set<string>();
    const path: string[] = [];
    let currentCost = 0;
    let currentTime = 0;
    let totalValue = 0;

    // 1. Випадковий старт (важливо для різноманітності мурах!)
    // Можна зробити "розумний" старт, але чистий рандом краще досліджує
    const startNode =
      this.places[Math.floor(Math.random() * this.places.length)];

    // Перевіряємо, чи старт влізає в ліміт часу
    if (startNode.daysToVisit > maxTime) {
      return { path: [], value: 0, cost: 0, time: 0 };
    }

    visited.add(startNode.id);
    path.push(startNode.id);
    totalValue += startNode.historicValue;
    currentTime += startNode.daysToVisit;

    let currentPlace = startNode;

    // 2. Рух мурахи
    while (true) {
      const candidates: { node: HistoricPlace; prob: number; cost: number }[] =
        [];
      let sumProb = 0;

      // Шукаємо, куди можна піти
      for (const nextPlace of this.places) {
        if (visited.has(nextPlace.id)) continue;

        const moveCost = this.costMatrix.get(
          `${currentPlace.id}_${nextPlace.id}`,
        );
        if (moveCost === undefined) continue;

        // Перевірка обмежень
        if (currentCost + moveCost > maxCost) continue;
        if (currentTime + nextPlace.daysToVisit > maxTime) continue;

        // РОЗРАХУНОК ІМОВІРНОСТІ
        // Тау (Феромон)
        const tau =
          this.pheromones.get(`${currentPlace.id}_${nextPlace.id}`) || 0.1;

        // Ета (Евристика: Цінність / Витрати)
        // Додаємо 0.1, щоб не ділити на 0
        const eta =
          nextPlace.historicValue / (moveCost + nextPlace.daysToVisit + 0.1);

        // Формула: (tau^alpha) * (eta^beta)
        const numerator = Math.pow(tau, this.alpha) * Math.pow(eta, this.beta);

        candidates.push({ node: nextPlace, prob: numerator, cost: moveCost });
        sumProb += numerator;
      }

      if (candidates.length === 0) break; // Глухий кут

      // 3. Рулетка (Roulette Wheel Selection)
      // Ми обираємо наступну точку випадково, але з урахуванням ваги (ймовірності)
      const randomPoint = Math.random() * sumProb;
      let accumulatedProb = 0;
      let selectedCandidate = candidates[0]; // про всяк випадок

      for (const candidate of candidates) {
        accumulatedProb += candidate.prob;
        if (randomPoint <= accumulatedProb) {
          selectedCandidate = candidate;
          break;
        }
      }

      // 4. Перехід
      visited.add(selectedCandidate.node.id);
      path.push(selectedCandidate.node.id);
      totalValue += selectedCandidate.node.historicValue;
      currentCost += selectedCandidate.cost;
      currentTime += selectedCandidate.node.daysToVisit;

      currentPlace = selectedCandidate.node;
    }

    return { path, value: totalValue, cost: currentCost, time: currentTime };
  }

  private updatePheromones(bestPath: string[], bestValue: number) {
    // 1. Випаровування на ВСІХ ребрах
    // tau_new = (1 - rho) * tau_old
    for (const [key, value] of this.pheromones) {
      this.pheromones.set(key, value * (1 - this.rho));
    }

    // 2. Додавання феромону на НАЙКРАЩОМУ шляху
    // Чим кращий шлях (більше value), тим більше феромону
    // Delta Tau = Q * Value (або просто Value, якщо Q=1)
    if (bestPath.length > 1) {
      const deposit = this.q * (bestValue / 100); // Нормування, щоб феромони не росли до нескінченності

      for (let i = 0; i < bestPath.length - 1; i++) {
        const from = bestPath[i];
        const to = bestPath[i + 1];

        const key1 = `${from}_${to}`;
        const key2 = `${to}_${from}`;

        const currentTau = this.pheromones.get(key1) || 0.1;
        const newTau = currentTau + deposit;

        this.pheromones.set(key1, newTau);
        this.pheromones.set(key2, newTau);
      }
    }
  }
}
