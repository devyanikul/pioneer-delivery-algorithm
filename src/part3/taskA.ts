import { WeightedDelivery } from './delivery';

export interface ScheduleResult {
  maxProfit: number;
  selectedIds: string[];
}

// Binary search to find the latest request that finishes on or before targetStart
// Returns 1-based index, or 0 if no compatible predecessor exists
function findPredecessor(sorted: WeightedDelivery[], targetStart: number, maxIdx: number): number {
  let low = 0;
  let high = maxIdx;
  let result = 0; // 0 means no compatible predecessor

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (sorted[mid].finish <= targetStart) {
      result = mid + 1; // 1-based index
      low = mid + 1;    // keep looking right for a later compatible one
    } else {
      high = mid - 1;
    }
  }

  return result;
}

// Weighted interval scheduling via dynamic programming — O(n log n)
export function scheduleWeightedDeliveries(deliveries: WeightedDelivery[]): ScheduleResult {
  const n = deliveries.length;
  if (n === 0) {
    return { maxProfit: 0, selectedIds: [] };
  }

  // Step 1: Sort by non-decreasing finish time (break ties by start time, then ID)
  const sorted = [...deliveries].sort((a, b) => {
    if (a.finish !== b.finish) return a.finish - b.finish;
    if (a.start !== b.start) return a.start - b.start;
    return a.id.localeCompare(b.id);
  });

  // Step 2: Compute predecessor p(i) for each request i (1-based index)
  // p[i] is the index of the last request that finishes <= sorted[i-1].start
  const p: number[] = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    p[i] = findPredecessor(sorted, sorted[i - 1].start, i - 2);
  }

  // Step 3: Compute DP table OPT
  // OPT[i] = max profit obtainable using a compatible subset of the first i requests
  const opt: number[] = new Array(n + 1).fill(0);
  opt[0] = 0;

  for (let i = 1; i <= n; i++) {
    const includeProfit = sorted[i - 1].profit + opt[p[i]];
    const excludeProfit = opt[i - 1];
    opt[i] = Math.max(includeProfit, excludeProfit);
  }

  // Step 4: Backtrack to recover selected delivery IDs
  const chosen: string[] = [];
  let curr = n;
  while (curr > 0) {
    const includeProfit = sorted[curr - 1].profit + opt[p[curr]];
    const excludeProfit = opt[curr - 1];

    if (includeProfit >= excludeProfit) {
      chosen.push(sorted[curr - 1].id);
      curr = p[curr]; // jump to the latest compatible predecessor
    } else {
      curr = curr - 1; // skip current request
    }
  }

  // Deliveries were collected in reverse order, reverse to chronological
  chosen.reverse();

  return {
    maxProfit: opt[n],
    selectedIds: chosen,
  };
}

// Naive brute-force search over all 2^n subsets for independent test verification
export function scheduleWeightedDeliveriesBruteForce(deliveries: WeightedDelivery[]): ScheduleResult {
  const n = deliveries.length;
  if (n === 0) return { maxProfit: 0, selectedIds: [] };

  let bestProfit = 0;
  let bestIds: string[] = [];

  const totalSubsets = 1 << n;
  for (let mask = 0; mask < totalSubsets; mask++) {
    const subset: WeightedDelivery[] = [];
    for (let i = 0; i < n; i++) {
      if ((mask & (1 << i)) !== 0) {
        subset.push(deliveries[i]);
      }
    }

    // Sort subset by start time to check compatibility
    subset.sort((a, b) => a.start - b.start);

    let compatible = true;
    for (let i = 0; i < subset.length - 1; i++) {
      if (subset[i].finish > subset[i + 1].start) {
        compatible = false;
        break;
      }
    }

    if (compatible) {
      const profit = subset.reduce((sum, d) => sum + d.profit, 0);
      if (profit > bestProfit) {
        bestProfit = profit;
        bestIds = subset.map((d) => d.id);
      }
    }
  }

  return { maxProfit: bestProfit, selectedIds: bestIds };
}
