# Part II: Divide and Conquer

## How to Compile and Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Compile TypeScript
```bash
npm run build
```

### 3. Run the Main Program
```bash
npm run start:part2
```

### 4. Run the Test Suite
```bash
npm run test:part2
```

This runs all required test cases for Tasks A, B, and C and reports PASS/FAIL for each.

---

## Program Organization

The project is organized in a modular structure within src/part2/:

| File | Description |
| --- | --- |
| src/part2/location.ts | Location class — data model for delivery coordinates, with squared distance calculation |
| src/part2/taskA.ts | Task A algorithm — closest pair of delivery locations (divide and conquer) |
| src/part2/taskB.ts | Task B algorithm — counting dispatch-order inversions using merge sort |
| src/part2/taskC.ts | Task C algorithm — delivery-time threshold selection using median-of-medians |
| src/part2/mainPart2.ts | Main CLI entry point — runs sample demos for all three tasks |
| src/part2/testPart2.ts | Test suite — all required test cases and verification tests for Tasks A, B, and C |
| tsconfig.json | TypeScript compiler configuration (strict mode, CommonJS, ES2020) |
| package.json | Project configuration and npm scripts (build, start:part2, test:part2) |

---

## Task A: Closest Delivery Locations

### 1. How does the algorithm divide the problem and combine results?
My algorithm finds the two closest delivery locations using 2D divide and conquer:

- Divide: First, I pre-sort all points once by x-coordinate and once by y-coordinate upfront. Then I split the x-sorted array into equal left and right halves at the median index. To avoid re-sorting by y during recursive calls, I put all the IDs from the left half into a Set and split the y-sorted array in a single O(n) pass. Using point IDs also handles points that share the exact same x-coordinate without any ambiguity.
- Conquer: I recursively find the closest pair in the left half and the closest pair in the right half, taking whichever distance is smaller as my current best distance delta.
- Combine: The closest pair might cross the dividing line with one point on the left and one on the right. I build a vertical strip of points whose horizontal distance to the dividing line is less than delta. Because these strip points are already sorted by y, I only compare each point to the next 7 points in the strip.

### 2. Why does the combine step not examine all pairs in the strip?
1. For two points to be closer than delta, their horizontal gap must be less than delta, and their vertical gap must also be less than delta.
2. Because the strip is already sorted by y from bottom to top, we check points in increasing vertical order. The moment the vertical gap between point i and point j reaches delta or more, that pair—and every pair after it—is already too far apart. We can immediately break and skip all remaining pairs for that point.

### 3. What is the running time of your algorithm?
- Sorting: Pre-sorting the points once by x and once by y takes O(n log n) time.
- Recursion: At each level, splitting the y-array, creating the strip, and checking the 7 neighbors takes O(n) time. The recurrence is T(n) = 2T(n/2) + O(n).
- Total Running Time: O(n log n).

---

## Task B: Counting Dispatch-Order Inversions

### 1. How does the algorithm count inversions?
1. Map to ranks: I create a map from each delivery ID to its index in the planned order, and convert the actual dispatch order into an array of these integer ranks in O(n) time.
2. Divide and conquer merge sort:
   - I split the rank array into two halves.
   - I recursively count the inversions in the left half and the right half.
   - During the merge step, whenever an element from the right half is smaller than the current element in the left half, it means that right element is also smaller than every remaining element in the left half. I add the count of remaining left elements to my inversion total.

### 2. How are large inversion counts handled?
For n = 100,000 in completely reversed order, the total number of inversions is:
n * (n - 1) / 2 = 100,000 * 99,999 / 2 = 4,999,950,000

This is larger than a standard 32-bit signed integer limit (about 2.14 billion). In JavaScript/TypeScript, numbers use IEEE-754 double precision floats, which safely represent exact integers up to 2^53 - 1 (about 9 quadrillion). Because of this, standard numbers handle this count accurately without any overflow issues.

### 3. What is the running time of your algorithm?
- Rank conversion: Building the map and converting the array takes O(n) time.
- Merge sort: The recurrence is T(n) = 2T(n/2) + O(n), which takes O(n log n) time.
- Total Running Time: O(n log n).

---

## Task C: Selecting a Delivery-Time Threshold

### 1. How does the algorithm work?
Algorithm finds the k-th smallest delivery duration in O(n) worst-case time using the deterministic median-of-medians algorithm:

1. Pick a pivot:
   - I break the array into small groups of at most 5 elements.
   - I sort each 5-element group directly and take its median.
   - I recursively find the median of all those group medians. This value is my pivot.
2. 3-way partition:
   - I split the array into three groups: elements strictly less than the pivot, elements equal to the pivot, and elements strictly greater than the pivot.
   - This 3-way split cleanly handles duplicate delivery times.
3. Recurse:
   - If k is within the size of the "less" group, I recurse on that group with the same k.
   - If k falls within the "equal" group, the answer is the pivot itself.
   - If k is in the "greater" group, I recurse on that group with an adjusted k.

### 2. How do you adjust k after partitioning?
When the k-th element is in the "greater" group, we have already skipped all the elements in the "less" and "equal" groups. So I adjust k by subtracting the counts of those two groups:
new k = k - less.length - equal.length

### 3. Why is this O(n) in the worst case?
By picking the median of medians as our pivot, we guarantee that at least half of the group medians are <= pivot, and each of those groups has at least 3 elements <= pivot. This guarantees that at least 30% of all elements are <= pivot, and symmetrically at least 30% are >= pivot.

Because of this, the subarray we recurse on can never contain more than 70% of the elements. The recurrence is:
T(n) <= T(n/5) + T(7n/10) + O(n)

Since 1/5 + 7/10 = 9/10 < 1, the work shrinks geometrically at each level, which solves to O(n) worst-case time.

---

## Task D: Validation and Algorithm Analysis

### 1. Algorithm Design Summary
- Task A (Closest Pair): Divides the point set along the median x-coordinate, solves left and right subproblems recursively, and combines results by examining points within a vertical strip of width 2*delta centered at the divider. The strip points are kept sorted by y without re-sorting.
- Task B (Inversions): Converts actual delivery IDs into their planned ranks, then runs a divide-and-conquer merge sort. It divides the array in half, recursively counts left and right inversions, and combines by counting split inversions during merging (each time an item is taken from the right half, it is inverted with all remaining items in the left half).
- Task C (Selection): Partitions into groups of 5, recursively finds the median of medians as a pivot, partitions the array into three groups (less, equal, greater), and discards the two unneeded partitions to recurse only on the single group containing rank k.

### 2. Time and Space Complexity Justification
- Task A:
  - Time: Pre-sorting by x and y takes O(n log n). In the combine step, the algorithm only checks at most the next 7 points in y-order for each point in the strip. Because at most 8 points can fit inside a delta by 2*delta rectangle straddling the divider (at most 4 in each delta by delta half since all pairs in each half are at least delta apart), the combine step is strictly O(n). This yields T(n) = 2T(n/2) + O(n), which gives O(n log n).
  - Auxiliary Space: O(n) for sorted point copies, strip array, and recursion stack.
- Task B:
  - Time: Generating the rank map takes O(n). Inversion counting follows standard merge sort recurrence T(n) = 2T(n/2) + O(n), achieving O(n log n).
  - Auxiliary Space: O(n) to store the rank map and merge buffers.
- Task C:
  - Time: Finding group medians takes O(n) time. Finding the median of medians takes T(n/5). Partitioning takes O(n). Because the median of medians is guaranteed to be larger than at least 30% of elements and smaller than at least 30% of elements, the remaining partition has size at most 7n/10. The recurrence T(n) <= T(n/5) + T(7n/10) + O(n) sums to a geometric series bounded by O(n) worst-case.
  - Auxiliary Space: O(n) for partition slices and recursion stack.

### 3. Correctness Testing and Edge Cases
To verify correctness, I implemented naive reference solutions for small and moderate inputs:
- Task A vs. Brute Force: Compared the divide-and-conquer output against an O(n^2) exhaustive pairwise distance calculation (closestPairBruteForce) on 40 random points. Both produced the exact same squared distance.
  - Edge Case Tested: Points lying on the exact same vertical line (x = 2) with varying y coordinates (P1(2,1), P2(2,9), P3(2,4), P4(2,15)). The algorithm properly partitioned tied x coordinates using point IDs and returned P1, P3 with d^2 = 9.
- Task B vs. Naive Nested Loops: Compared the merge-sort inversion count against a naive O(n^2) double loop (countInversionsNaive). Both produced identical inversion counts.
  - Edge Case Tested: Completely reversed order with n = 100,000, producing 4,999,950,000 inversions. Verified that JavaScript's 64-bit float representation preserves integer precision without overflow.
- Task C vs. Native Sorting: Compared medianOfMediansSelect against JavaScript's built-in array sort on an array of 150 random integers across multiple k values, matching in all runs.
  - Edge Cases Tested: Array with all duplicate elements ([7, 7, 7, 7, 7, 7]), already-sorted array, reverse-sorted array, and heavily duplicated arrays ([3, 3, 3, 1, 1, 9, 9, 9, 9, 2]). Handled cleanly by 3-way partitioning.

### 4. Performance Evidence 
| Input Size (n) | Task A (Closest Pair) | Task B (Inversions) | Task C (Median-of-Medians) |
| --- | --- | --- | --- |
| n = 100 | 0.38 ms | 0.15 ms | 0.09 ms |
| n = 1,000 | 0.79 ms | 0.39 ms | 0.27 ms |
| n = 5,000 | 6.26 ms | 1.10 ms | 1.41 ms |
| n = 10,000 | 13.57 ms | 2.33 ms | 1.56 ms |

---

## Test Results

### Task A: Closest Delivery Locations

| Test | Input Locations | Expected Pair | Expected d^2 | Result |
| --- | --- | --- | --- | --- |
| A1 | A(0,0), B(3,4) | A, B | 25 | ✓ A, B (d^2=25) |
| A2 | A(0,0), B(7,2), C(4,5), D(5,5), E(12,2), F(2,9) | C, D | 1 | ✓ C, D (d^2=1) |
| A3 | A(-3,1), B(-3,11), C(1,1), D(2,15) | A, C | 16 | ✓ A, C (d^2=16) |
| A4 | A(-5,-5), B(-5,-2), C(6,8) | A, B | 9 | ✓ A, B (d^2=9) |
| A5 | Vertical line: P1(2,1), P2(2,9), P3(2,4), P4(2,15) | P1, P3 | 9 | ✓ P1, P3 (d^2=9) |
| A6 | 40 random points — D&C matches brute force | — | — | ✓ Matched |

### Task B: Counting Dispatch-Order Inversions

| Test | Planned Order | Actual Order | Expected | Result |
| --- | --- | --- | --- | --- |
| B1 | [A, B, C, D, E] | [A, C, D, B, E] | 2 | ✓ 2 |
| B2 | [A, B, C, D] | [A, B, C, D] | 0 | ✓ 0 |
| B3 | [A, B, C, D] | [D, C, B, A] | 6 | ✓ 6 |
| B4 | [A] | [A] | 0 | ✓ 0 |
| B5 | 7-element random — merge sort matches naive | — | — | ✓ Matched |
| B6 | n=100,000 reversed | 4,999,950,000 | 4,999,950,000 | ✓ 4,999,950,000 |

### Task C: Selecting a Delivery-Time Threshold

| Test | Delivery Times T | k | Expected | Result |
| --- | --- | --- | --- | --- |
| C1 | [18, 4, 29, 11, 4, 16, 35, 9, 22] | 5 | 16 | ✓ 16 |
| C2 | [18, 4, 29, 11, 4, 16, 35, 9, 22] | 2 | 4 | ✓ 4 |
| C3 | [18, 4, 29, 11, 4, 16, 35, 9, 22] | 9 | 35 | ✓ 35 |
| C4 | [7, 7, 7, 7, 7, 7] | 4 | 7 | ✓ 7 |
| C5 | [8, 3] | 1 | 3 | ✓ 3 |
| C6 | Sorted: [2, 5, 8, 12, 19, 23, 31] | 4 | 12 | ✓ 12 |
| C7 | Reverse sorted: [50, 40, 30, 20, 10] | 2 | 20 | ✓ 20 |
| C8 | Heavy duplicates: [3, 3, 3, 1, 1, 9, 9, 9, 9, 2] | 6 | 3 | ✓ 3 |
| C9 | 150 random elements — matches sort | — | — | ✓ Matched |
