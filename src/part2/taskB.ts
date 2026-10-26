// Merge-sort based inversion counter
function countSplitInversions(arr: number[]): { sorted: number[]; count: number } {
  if (arr.length <= 1) {
    return { sorted: [...arr], count: 0 };
  }

  const mid = Math.floor(arr.length / 2);
  const left = countSplitInversions(arr.slice(0, mid));
  const right = countSplitInversions(arr.slice(mid));

  let totalInversions = left.count + right.count;
  const merged: number[] = [];

  let i = 0;
  let j = 0;

  while (i < left.sorted.length && j < right.sorted.length) {
    if (left.sorted[i] <= right.sorted[j]) {
      merged.push(left.sorted[i]);
      i++;
    } else {
      // right element is smaller than left[i], which means it is also smaller than
      // all remaining elements left[i...end]
      merged.push(right.sorted[j]);
      totalInversions += left.sorted.length - i;
      j++;
    }
  }

  // Push remaining elements
  while (i < left.sorted.length) {
    merged.push(left.sorted[i]);
    i++;
  }
  while (j < right.sorted.length) {
    merged.push(right.sorted[j]);
    j++;
  }

  return { sorted: merged, count: totalInversions };
}

export function countInversions(planned: string[], actual: string[]): number {
  if (planned.length <= 1) return 0;

  // Map each delivery ID to its index/rank in the planned order
  const plannedRank = new Map<string, number>();
  for (let i = 0; i < planned.length; i++) {
    plannedRank.set(planned[i], i);
  }

  // Translate actual delivery sequence into an array of target ranks
  const ranks = actual.map((id) => {
    const rank = plannedRank.get(id);
    if (rank === undefined) {
      throw new Error(`Delivery ID ${id} was not found in planned list`);
    }
    return rank;
  });

  const { count } = countSplitInversions(ranks);
  return count;
}

// Simple O(n^2) nested loop for test verification
export function countInversionsNaive(planned: string[], actual: string[]): number {
  const plannedRank = new Map<string, number>();
  for (let i = 0; i < planned.length; i++) {
    plannedRank.set(planned[i], i);
  }

  const ranks = actual.map((id) => plannedRank.get(id)!);
  let inversions = 0;
  for (let i = 0; i < ranks.length; i++) {
    for (let j = i + 1; j < ranks.length; j++) {
      if (ranks[i] > ranks[j]) {
        inversions++;
      }
    }
  }
  return inversions;
}
