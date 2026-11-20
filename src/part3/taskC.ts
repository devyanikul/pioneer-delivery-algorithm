export interface EventLogCleanupResult {
  maxRemovals: number;
  removedIndices: number[];
}

// Helper to verify that pattern is a subsequence of text
export function isSubsequence(pattern: string, text: string): boolean {
  let p = 0;
  for (let i = 0; i < text.length && p < pattern.length; i++) {
    if (text[i] === pattern[p]) {
      p++;
    }
  }
  return p === pattern.length;
}

// Dynamic programming solution for Event Log Cleanup (LeetCode #3316) — O(nm)
export function maxRemovalsFromSource(
  source: string,
  pattern: string,
  targetIndices: number[]
): EventLogCleanupResult {
  const n = source.length;
  const m = pattern.length;

  if (m === 0) {
    // If pattern is empty, all target indices can be removed
    return {
      maxRemovals: targetIndices.length,
      removedIndices: [...targetIndices].sort((a, b) => a - b),
    };
  }

  if (n < m) {
    return { maxRemovals: 0, removedIndices: [] };
  }

  // Fast O(1) lookup for whether an index is eligible for deletion
  const isTarget: boolean[] = new Array(n).fill(false);
  for (const idx of targetIndices) {
    if (idx >= 0 && idx < n) {
      isTarget[idx] = true;
    }
  }

  // Sentinel for impossible states
  const NEG_INF = -1e9;

  // dp[i][j] = max deletions in source[0..i-1] while matching pattern[0..j-1]
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(NEG_INF));

  // Base cases:
  // Empty pattern can be matched from empty source with 0 deletions
  dp[0][0] = 0;

  // Fill DP table row by row
  for (let i = 1; i <= n; i++) {
    const sChar = source[i - 1];
    const delGain = isTarget[i - 1] ? 1 : 0;

    for (let j = 0; j <= m; j++) {
      // Option 1: Do not use source[i-1] to match pattern[j-1].
      // If it is a target, we delete it (+1 deletion). Otherwise we skip it (+0).
      if (dp[i - 1][j] !== NEG_INF) {
        dp[i][j] = Math.max(dp[i][j], dp[i - 1][j] + delGain);
      }

      // Option 2: Use source[i-1] to match pattern[j-1].
      // If used for matching, it cannot be deleted.
      if (j > 0 && sChar === pattern[j - 1] && dp[i - 1][j - 1] !== NEG_INF) {
        dp[i][j] = Math.max(dp[i][j], dp[i - 1][j - 1]);
      }
    }
  }

  // If pattern cannot be formed as a subsequence
  if (dp[n][m] < 0) {
    return { maxRemovals: 0, removedIndices: [] };
  }

  // Backtrack from (n, m) to recover deleted indices
  const removed: number[] = [];
  let currI = n;
  let currJ = m;

  while (currI > 0) {
    const sChar = source[currI - 1];
    const delGain = isTarget[currI - 1] ? 1 : 0;

    // Check if Option 2 (matching) was a valid optimal choice
    const matchedValid =
      currJ > 0 &&
      sChar === pattern[currJ - 1] &&
      dp[currI - 1][currJ - 1] !== NEG_INF &&
      dp[currI][currJ] === dp[currI - 1][currJ - 1];

    // Check if Option 1 (skip / delete) was a valid optimal choice
    const skipValid =
      dp[currI - 1][currJ] !== NEG_INF &&
      dp[currI][currJ] === dp[currI - 1][currJ] + delGain;

    // We prefer Option 1 if it gives a deletion; otherwise match if valid
    if (delGain === 1 && skipValid) {
      removed.push(currI - 1);
      currI--;
    } else if (matchedValid) {
      currI--;
      currJ--;
    } else if (skipValid) {
      currI--;
    } else {
      // Fallback
      currI--;
    }
  }

  // Put removed indices in ascending order
  removed.reverse();

  return {
    maxRemovals: dp[n][m],
    removedIndices: removed,
  };
}

// Naive brute-force solver for independent verification on small instances
export function maxRemovalsFromSourceBruteForce(
  source: string,
  pattern: string,
  targetIndices: number[]
): EventLogCleanupResult {
  const k = targetIndices.length;
  let bestCount = 0;
  let bestIndices: number[] = [];

  const totalSubsets = 1 << k;
  for (let mask = 0; mask < totalSubsets; mask++) {
    const candidateIndices: number[] = [];
    for (let bit = 0; bit < k; bit++) {
      if ((mask & (1 << bit)) !== 0) {
        candidateIndices.push(targetIndices[bit]);
      }
    }

    // Build the string after removing candidateIndices
    const removeSet = new Set(candidateIndices);
    let remaining = '';
    for (let i = 0; i < source.length; i++) {
      if (!removeSet.has(i)) {
        remaining += source[i];
      }
    }

    if (isSubsequence(pattern, remaining)) {
      if (candidateIndices.length > bestCount) {
        bestCount = candidateIndices.length;
        bestIndices = candidateIndices.sort((a, b) => a - b);
      }
    }
  }

  return {
    maxRemovals: bestCount,
    removedIndices: bestIndices,
  };
}
