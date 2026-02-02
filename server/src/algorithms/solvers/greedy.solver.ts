import { HistoricPlace, TravelCost } from 'generated/prisma/client';
import { SolverResult, TravelSolver } from '../interfaces';

export class GreedySolver implements TravelSolver {
  private places: HistoricPlace[];
  // Матриця вартостей: ключ "sourceId_destId", значення cost
  private costMatrix: Map<string, number>;

  constructor(places: HistoricPlace[], costs: TravelCost[]) {
    this.places = places;
    this.costMatrix = new Map();

    // Індексуємо витрати для миттєвого доступу
    costs.forEach((c) => {
      // Прямий шлях
      this.costMatrix.set(`${c.sourceId}_${c.destinationId}`, c.travelCost);
      // Зворотний шлях (припускаємо, що граф неорієнтований)
      this.costMatrix.set(`${c.destinationId}_${c.sourceId}`, c.travelCost);
    });
  }

  /**
   * Головний метод розв'язку
   * @param maxCost Обмеження по бюджету (C)
   * @param maxTime Обмеження по часу (D)
   */
  public solve(maxCost: number, maxTime: number): SolverResult {
    const startTime = performance.now();

    // Змінні стану
    let currentCost = 0;
    let currentTime = 0;
    let totalValue = 0;

    const path: string[] = [];
    const visited = new Set<string>();

    // --- ЕТАП 1: Вибір початкової точки ---
    // Сортуємо місця: спочатку найцінніші, якщо рівні — то найшвидші для огляду
    const sortedPlaces = [...this.places].sort((a, b) => {
      return b.historicValue - a.historicValue || a.daysToVisit - b.daysToVisit;
    });

    let currentPlace: HistoricPlace | null = null;

    // Шукаємо перше місце, на яке вистачає часу (бюджет не витрачається на старті)
    for (const place of sortedPlaces) {
      if (place.daysToVisit <= maxTime) {
        currentPlace = place;
        break;
      }
    }

    // Якщо навіть на перше місце немає часу — повертаємо порожній результат
    if (!currentPlace) {
      return this.buildResult([], 0, 0, 0, startTime);
    }

    // Ініціалізація маршруту
    this.visitPlace(currentPlace, visited, path);
    totalValue += currentPlace.historicValue;
    currentTime += currentPlace.daysToVisit;
    // currentCost залишається 0, бо ми ще нікуди не їхали

    // --- ЕТАП 2: Жадібний цикл ---
    while (true) {
      let bestCandidate: HistoricPlace | null = null;
      let maxHeuristic = -Infinity; // Найкращий знайдений коефіцієнт
      let costToCandidate = 0;

      // Перебираємо всіх можливих сусідів
      for (const candidate of this.places) {
        // 1. Фільтр: вже відвідані
        if (visited.has(candidate.id)) continue;

        // 2. Фільтр: чи існує дорога?
        const moveCost = this.costMatrix.get(
          `${currentPlace.id}_${candidate.id}`,
        );
        if (moveCost === undefined) continue; // Шляху немає

        // 3. Фільтр: Обмеження (Constraints)
        // Чи вписуємося в бюджет?
        if (currentCost + moveCost > maxCost) continue;

        // Чи вписуємося в час? (Поточний + Огляд нового).
        // Примітка: якщо у TravelCost з'явиться час переїзду, додайте його сюди.
        if (currentTime + candidate.daysToVisit > maxTime) continue;

        // 4. Евристика (Heuristic Function)
        // f = W / (Cost + Time)
        // Додаємо 0.1 до знаменника, щоб уникнути ділення на нуль, якщо витрати нульові
        const denominator = moveCost + candidate.daysToVisit + 0.1;
        const heuristic = candidate.historicValue / denominator;

        // Якщо знайшли кращий варіант
        if (heuristic > maxHeuristic) {
          maxHeuristic = heuristic;
          bestCandidate = candidate;
          costToCandidate = moveCost;
        }
      }

      // Якщо кандидатів немає (глухий кут або вичерпано ресурси) — виходимо
      if (!bestCandidate) {
        break;
      }

      // Перехід до наступної точки
      this.visitPlace(bestCandidate, visited, path);

      // Оновлення акумуляторів
      totalValue += bestCandidate.historicValue;
      currentCost += costToCandidate;
      currentTime += bestCandidate.daysToVisit;

      // Зсуваємо поточну позицію
      currentPlace = bestCandidate;
    }

    return this.buildResult(
      path,
      totalValue,
      currentCost,
      currentTime,
      startTime,
    );
  }

  // --- Допоміжні методи ---

  private visitPlace(
    place: HistoricPlace,
    visited: Set<string>,
    path: string[],
  ) {
    visited.add(place.id);
    path.push(place.id);
  }

  private buildResult(
    path: string[],
    val: number,
    cost: number,
    time: number,
    startT: number,
  ): SolverResult {
    return {
      path,
      totalValue: val,
      totalCost: cost,
      totalTime: time,
      calculationTime: performance.now() - startT, // Час виконання в мс
    };
  }
}
