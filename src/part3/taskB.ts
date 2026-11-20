import { FuelDelivery } from './delivery';

export interface KnapsackResult {
  maxProfit: number;
  totalFuelCost: number;
  selectedIds: string[];
}

// 0/1 Knapsack selection with fuel budget using a 2D DP table — O(nB)
export function selectDeliveriesWithBudget(
  deliveries: FuelDelivery[],
  budget: number
): KnapsackResult {
  const n = deliveries.length;

  // Handle edge cases: no deliveries or zero/negative budget
  if (n === 0 || budget <= 0) {
    return {
      maxProfit: 0,
      totalFuelCost: 0,
      selectedIds: [],
    };
  }

  // dp[i][b] = maximum profit using a subset of first i items with fuel budget at most b
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(budget + 1).fill(0));

  // Fill table bottom-up
  for (let i = 1; i <= n; i++) {
    const item = deliveries[i - 1];
    for (let b = 0; b <= budget; b++) {
      if (item.fuelCost > b) {
        dp[i][b] = dp[i - 1][b];
      } else {
        const include = item.profit + dp[i - 1][b - item.fuelCost];
        const exclude = dp[i - 1][b];
        dp[i][b] = Math.max(exclude, include);
      }
    }
  }

  // Backtrack from (n, budget) to recover selected deliveries
  const selected: string[] = [];
  let currentBudget = budget;
  let accumulatedCost = 0;

  for (let i = n; i > 0; i--) {
    const item = deliveries[i - 1];
    // If the value changed from the row above, item i-1 was included
    if (dp[i][currentBudget] !== dp[i - 1][currentBudget]) {
      selected.push(item.id);
      accumulatedCost += item.fuelCost;
      currentBudget -= item.fuelCost;
    }
  }

  // Reverse so items appear in their original list order
  selected.reverse();

  return {
    maxProfit: dp[n][budget],
    totalFuelCost: accumulatedCost,
    selectedIds: selected,
  };
}

// Brute-force solver over all 2^n subsets for independent test verification
export function selectDeliveriesWithBudgetBruteForce(
  deliveries: FuelDelivery[],
  budget: number
): KnapsackResult {
  const n = deliveries.length;
  if (n === 0 || budget <= 0) {
    return { maxProfit: 0, totalFuelCost: 0, selectedIds: [] };
  }

  let bestProfit = 0;
  let bestCost = 0;
  let bestIds: string[] = [];

  const totalSubsets = 1 << n;
  for (let mask = 0; mask < totalSubsets; mask++) {
    let cost = 0;
    let profit = 0;
    const ids: string[] = [];

    for (let i = 0; i < n; i++) {
      if ((mask & (1 << i)) !== 0) {
        cost += deliveries[i].fuelCost;
        profit += deliveries[i].profit;
        ids.push(deliveries[i].id);
      }
    }

    if (cost <= budget) {
      if (profit > bestProfit) {
        bestProfit = profit;
        bestCost = cost;
        bestIds = ids;
      }
    }
  }

  return {
    maxProfit: bestProfit,
    totalFuelCost: bestCost,
    selectedIds: bestIds,
  };
}
