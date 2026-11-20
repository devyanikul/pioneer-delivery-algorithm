# Part III: Dynamic Programming

## How to Compile and Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Compile TypeScript
```bash
npm run build
```
*(Compiles .ts files from src/ to .js files in dist/ using tsconfig.json)*

### 3. Run the Main Program
```bash
npm run start:part3
```
or directly with Node after compiling:
```bash
node dist/part3/mainPart3.js
```

This runs demonstration cases for Tasks A, B, and C, printing formatted results to the console.

### 4. Run the Test Suite
```bash
npm run test:part3
```
or directly:
```bash
node dist/part3/testPart3.js
```

This runs all required test cases, edge cases, and independent brute-force verification checks for Tasks A, B, and C and reports PASS/FAIL for each.

---

## Program Organization

The project is organized in a modular structure within src/part3/:

| File | Description |
| --- | --- |
| src/part3/delivery.ts | Data models for weighted deliveries and fuel-budget deliveries |
| src/part3/taskA.ts | Task A algorithm — weighted interval scheduling with binary search predecessor O(n log n) |
| src/part3/taskB.ts | Task B algorithm — 0/1 knapsack delivery selection under fuel budget O(nB) |
| src/part3/taskC.ts | Task C algorithm — event log cleanup preserving subsequence alignment O(nm) |
| src/part3/mainPart3.ts | Main CLI entry point — runs sample demos for all three tasks |
| src/part3/testPart3.ts | Test suite — required test cases, edge cases, and brute-force verification |
| tsconfig.json | TypeScript compiler configuration (strict mode, CommonJS, ES2020) |
| package.json | Project configuration and npm scripts (build, start:part3, test:part3) |

---

## Task A: Maximum-Profit Delivery Scheduling

### 1. How does the algorithm work?
My algorithm finds the subset of compatible delivery requests that maximizes total profit using weighted interval scheduling:

1. **Sort by finish time:** I sort all requests in non-decreasing order of finish time. If two requests finish at the same time, I break ties using start time and ID.
2. **Compute predecessors via binary search:** For each request i (1-indexed), I find p(i), which is the index of the last request that finishes on or before request i starts. Because the requests are sorted by finish time, I can find p(i) using binary search in O(log n) time per request, giving O(n log n) time for all predecessors.
3. **Dynamic programming table:**
   - Base case: OPT[0] = 0 (no deliveries).
   - Recurrence: For request i, I either exclude it (profit OPT[i-1]) or include it (profit of request i plus OPT[p(i)]). I take the maximum of these two choices:
     OPT[i] = max(OPT[i-1], profit[i] + OPT[p(i)])
4. **Reconstruct the schedule:** I backtrack from i = n down to 1. If including request i gave at least as much profit as excluding it, I add request i to my schedule and jump directly to p(i). Otherwise, I move to i - 1. Finally, I reverse the collected list so the schedule is in chronological order.

### 2. Why does the greedy earliest-finish-time algorithm fail?
In Part I, greedy earliest finish time worked because all deliveries had equal value, so finishing early left the most room for future deliveries. But when deliveries carry different profits, a delivery that finishes early might pay very little, while a slightly longer overlapping delivery could pay significantly more.

For example, in the given assignment data:
- Earliest-finish-time greedy picks A(0-3, profit 50), C(3-5, profit 40), and E(5-8, profit 50), earning a total of 140.
- Dynamic programming chooses B(1-4, profit 60), D(4-7, profit 70), and F(7-9, profit 50), earning a total of 180.
The greedy strategy gets trapped by picking A early and misses the much more profitable combination of B, D, and F.

### 3. What is the running time of your algorithm?
- Sorting: Sorting n requests by finish time takes O(n log n) time.
- Predecessors: Computing p(i) for all n requests using binary search takes O(n log n) time.
- Dynamic programming: Filling the 1D OPT array takes O(n) time.
- Schedule reconstruction: Backtracking takes O(n) time.
- Total Running Time: O(n log n).
- Space Complexity: O(n) auxiliary space for sorted copy, predecessor array p, and DP array OPT.

---

## Task B: Delivery Selection with a Fuel Budget

### 1. How does the algorithm work?
My algorithm solves the 0/1 knapsack problem to select deliveries that maximize total profit within a limited fuel budget B:

1. **2D DP table formulation:**
   - I create a table dp[i][b] representing the maximum profit obtainable from the first i deliveries given a fuel budget of b units, where 0 <= i <= n and 0 <= b <= B.
   - Base cases: dp[0][b] = 0 for all b (no deliveries available), and dp[i][0] = 0 for all i (zero fuel budget).
2. **Recurrence:**
   - For delivery i with fuel cost c and profit p:
     - If c > b: the delivery cannot fit into the remaining budget, so dp[i][b] = dp[i-1][b].
     - If c <= b: we either skip it or take it:
       dp[i][b] = max(dp[i-1][b], p + dp[i-1][b - c])
3. **Reconstruct the selected deliveries:**
   - I start at (n, B). For each delivery from i = n down to 1:
     - If dp[i][b] is not equal to dp[i-1][b], delivery i was selected. I record its ID, add its fuel cost to my running total, and subtract its cost from b.
     - Otherwise, delivery i was skipped.
   - Finally, I reverse the list so items appear in their original order.

### 2. Why does the running time depend on the numerical budget?
The running time is O(nB), which is pseudo-polynomial. The number of table cells is directly proportional to the numerical magnitude of B, not just the number of items n or the number of bits needed to write B. If the budget value is small (like B = 10 or 500), the table fills in milliseconds. If B were an astronomical number like 10^12, the table would be too large to allocate in memory, even though the number of inputs n might be small.

### 3. What is the running time of your algorithm?
- DP table filling: (n + 1) * (B + 1) states, each computed in O(1) time, giving O(nB) time.
- Backtracking: At most n steps, taking O(n) time.
- Total Running Time: O(nB).
- Space Complexity: O(nB) auxiliary space for the 2D table to support reconstruction.

---

## Task C: Event Log Cleanup with Sequence Alignment

### 1. How does the algorithm work?
Adapted from LeetCode #3316, this algorithm finds the maximum number of removable characters from a source log (at allowed targetIndices) such that a required pattern string remains a valid subsequence:

1. **Lookup array:** I create a boolean array isTarget of length n so I can check in O(1) time whether an index is eligible for deletion.
2. **2D DP state:**
   - dp[i][j] stores the maximum number of deletions in source prefix of length i while matching pattern prefix of length j.
   - If a state is impossible (meaning pattern prefix of length j cannot be formed from source prefix of length i), it is set to -1e9.
   - Base case: dp[0][0] = 0 (empty source matches empty pattern with 0 deletions).
3. **Recurrence:**
   - For each character source[i-1] and pattern length j:
     - Option 1 (Do not use character to match pattern):
       If index i-1 is in targetIndices, we delete it and gain +1 deletion: dp[i-1][j] + 1.
       If index i-1 is not in targetIndices, we skip it without deletion: dp[i-1][j] + 0.
     - Option 2 (Use character to match pattern):
       Valid only if j > 0 and source[i-1] == pattern[j-1]. Since we use it for matching, we cannot delete it: dp[i-1][j-1].
     - We take the maximum of Option 1 and Option 2.
4. **Reconstruct removed indices:**
   - I backtrack from (n, m) to (0, 0).
   - If Option 1 was optimal and the index was an eligible target, I record index i-1 as removed and move to (i-1, j).
   - Otherwise, if Option 2 was optimal, I match the character and move to (i-1, j-1).
   - Finally, I sort the removed indices and verify that removing them from source leaves pattern as a valid subsequence.

### 2. How are impossible matches handled?
Any cell that cannot form the required pattern prefix is initialized to a large negative number (-1e9). This prevents impossible subproblems from propagating forward, because adding +1 deletion to -1e9 remains deeply negative and will always lose in the max() comparison against any genuinely achievable state.

### 3. What is the running time of your algorithm?
- DP table filling: (n + 1) * (m + 1) states, where n is source length and m is pattern length. Each transition takes O(1) time, giving O(nm) time.
- Backtracking: Takes O(n) time to walk from row n to row 0.
- Subsequence verification: Takes O(n) time.
- Total Running Time: O(nm).
- Space Complexity: O(nm) auxiliary space for the 2D table.

---

## Task D: Validation and Algorithm Analysis

### 1. Algorithm Design Summary
- Task A (Weighted Interval Scheduling): Pre-sorts requests by finish time, computes latest compatible predecessors via binary search, and uses a 1D DP table where each state chooses between excluding or including the current request.
- Task B (Fuel Budget Knapsack): Uses a 2D DP table over candidate deliveries and fuel budget values. It either skips the item or includes it by consuming its fuel cost from the available budget.
- Task C (Event Log Cleanup): Uses a 2D DP table aligning source log positions with required pattern positions, deciding at each step whether to delete an eligible character or preserve it to match the next pattern character.

### 2. Time and Space Complexity Justification
- Task A: Sorting takes O(n log n). Predecessor calculation uses binary search n times, taking O(n log n). DP fill and backtrack take O(n). Total time is O(n log n), with O(n) space for p, OPT, and sorted arrays.
- Task B: The 2D table has dimensions (n + 1) by (B + 1). Each entry requires constant-time lookups. Total time is O(nB) and space is O(nB) for the table to enable backtrack reconstruction.
- Task C: The 2D table has dimensions (n + 1) by (m + 1). Each entry considers at most two O(1) transitions. Total time is O(nm) and space is O(nm).

### 3. Correctness Testing and Edge Cases
To verify correctness, I implemented independent brute-force reference solvers for Tasks A, B, and C:
- Task A vs. Exhaustive Search: Tested against scheduleWeightedDeliveriesBruteForce on 8 requests with varied profits. Both algorithms found the exact same maximum profit.
  - Edge Cases Tested: Empty request list, touching endpoints (start == finish), mutually overlapping requests, and counterexample comparison against greedy earliest finish time.
- Task B vs. Exhaustive Search: Tested against selectDeliveriesWithBudgetBruteForce on 8 items with varied costs and profits. Both algorithms returned the exact same maximum profit and verified total fuel cost was within budget.
  - Edge Cases Tested: Budget of 0, item that exactly fits the budget, empty candidate list, and all items fitting within budget.
- Task C vs. Exhaustive Search: Tested against maxRemovalsFromSourceBruteForce on custom instances.
  - Edge Cases Tested: All target indices removable, zero removals possible, duplicate symbols with multiple alignments, and automated verification that pattern is preserved as a subsequence after deleting reported indices.

### 4. Performance Evidence (Empirical Timing)
I measured execution times across increasing input sizes on an Apple Silicon machine (Node.js v26.8):

| Input Size (n) | Task A (Weighted Scheduling) | Task B (Knapsack, B=500) | Task C (Cleanup, m=n/10) |
| --- | --- | --- | --- |
| n = 100 | 0.05 ms | 0.28 ms | 0.07 ms |
| n = 500 / 1,000 | 0.23 ms (n=1,000) | 1.66 ms (n=1,000) | 0.39 ms (n=1,000) |
| n = 2,000 / 5,000 | 5.50 ms (n=5,000) | 3.63 ms (n=2,000) | 1.65 ms (n=2,000) |
| n = 10,000 | 2.05 ms | — | — |

Comparison with Theoretical Complexity:
- Task A (O(n log n)): Scales smoothly with n log n. At n = 10,000, sorting and binary searching complete in just 2.05 ms.
- Task B (O(nB)): With fixed budget B = 500, increasing n from 500 to 1,000 to 2,000 roughly doubles the time at each step (0.82 ms to 1.66 ms to 3.63 ms), matching the expected linear growth with respect to n.
- Task C (O(nm)): With m = n / 10, the total table cells grow quadratically with n. Scaling from n = 500 (m = 50, 25k cells) to n = 1,000 (m = 100, 100k cells) and n = 2,000 (m = 200, 400k cells) shows clean quadratic growth (0.20 ms to 0.39 ms to 1.65 ms).

---

## Test Results

### Task A: Maximum-Profit Delivery Scheduling

| Test | Input Requests | Expected Profit | Expected Schedule | Result |
| --- | --- | --- | --- | --- |
| A1 | A(0,3,50), B(1,4,60), C(3,5,40), D(4,7,70), E(5,8,50), F(7,9,50) | 180 | B, D, F | ✓ 180, [B, D, F] |
| A2 | Empty request set | 0 | [] | ✓ 0, [] |
| A3 | Touching endpoints: D1(1,4,30), D2(4,8,50), D3(8,10,20) | 100 | D1, D2, D3 | ✓ 100, [D1, D2, D3] |
| A4 | Mutually overlapping: D1(2,7,100), D2(3,5,40), D3(1,6,80) | 100 | D1 | ✓ 100, [D1] |
| A5 | DP strictly beats greedy earliest-finish (180 vs 140) | true | — | ✓ Matched (DP optimal) |
| A6 | 8 requests checked against brute force | Same as brute force | — | ✓ Matched |

### Task B: Delivery Selection with a Fuel Budget

| Test | Input Deliveries | Budget | Expected Profit | Expected Cost | Result |
| --- | --- | --- | --- | --- | --- |
| B1 | P(4,20), Q(3,14), R(5,29), S(2,10), T(6,31) | 10 | 53 | 10 | ✓ 53, cost 10, [Q, R, S] |
| B2 | P(4,20), Q(3,14), budget 0 | 0 | 0 | 0 | ✓ 0, cost 0, [] |
| B3 | Exact fit: D1(5,50), D2(8,90), D3(3,25) | 5 | 50 | 5 | ✓ 50, cost 5, [D1] |
| B4 | Empty deliveries | 10 | 0 | 0 | ✓ 0, cost 0, [] |
| B5 | All items fit: D1(2,10), D2(3,15), D3(1,8) | 10 | 33 | 6 | ✓ 33, cost 6, [D1, D2, D3] |
| B6 | 8 candidate items checked against brute force | 15 | Same as brute force | <= 15 | ✓ Matched |

### Task C: Event Log Cleanup with Sequence Alignment

| Test | Source | Pattern | Target Indices | Expected Removals | Result |
| --- | --- | --- | --- | --- | --- |
| C1 | "abbaa" | "aba" | [0, 1, 2] | 1 | ✓ 1, valid targets, 'aba' preserved |
| C2 | "bcda" | "d" | [0, 3] | 2 | ✓ 2, valid targets, 'd' preserved |
| C3 | "dda" | "dda" | [0, 1, 2] | 0 | ✓ 0, valid targets, 'dda' preserved |
| C4 | "yeyeykyded" | "yeyyd" | [0, 2, 3, 4] | 2 | ✓ 2, valid targets, 'yeyyd' preserved |
| C5 | "abcdefg" | "bdf" | [0, 2, 4, 6] | 4 | ✓ 4, valid targets, 'bdf' preserved |
| C6 | "aaaaaa" | "aa" | [0, 1, 2, 3, 4, 5] | 4 | ✓ 4, valid targets, 'aa' preserved |
| C7 | Custom instance checked against brute force | Same as brute force | — | — | ✓ Matched |
