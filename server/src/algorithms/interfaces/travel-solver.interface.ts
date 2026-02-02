import { SolverResult } from './solver-result.interface';

export interface TravelSolver {
  solve(maxCost: number, maxTime: number): SolverResult;
}
