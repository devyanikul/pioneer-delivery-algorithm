# Pioneer Delivery Company's Algorithm Portfolio

**Course:** CS Algorithms  
**Author:** Devyani Kulshrestha  
**Language:** TypeScript (Node.js)  
**Repository:** [GitHub Repository](https://github.com/devyanikul/pioneer-delivery-algorithm/) 
**AI Tool:** Antigravity/Gemini 3.8 Flash 

---

## Project Overview

This repository contains the semester-long algorithm portfolio for **Pioneer Delivery Company**, implementing core dispatching, routing, and scheduling algorithms. The project is split into three major parts:

1. **[Part I: Greedy Algorithms](src/part1/README.md)** — Solving interval scheduling and fleet-size optimization using greedy choices and priority queues.
2. **[Part II: Divide and Conquer](src/part2/README.md)** — Solving spatial proximity, dispatch quality measurement, and threshold selection using divide-and-conquer recurrences.
3. **[Part III: Dynamic Programming](src/part3/README.md)** — Solving weighted interval scheduling, fuel-constrained knapsack selection, and event-log cleanup alignment using dynamic programming.

---

## Part Summary

### Part I: Greedy Algorithms
- **Task A: Maximum Deliveries for One Driver** — Finds the maximum number of mutually compatible delivery requests a single driver can complete (O(n log n) earliest finish time).
- **Task B: Minimum Number of Drivers** — Uses a custom binary min-heap to assign every delivery request using the minimum possible number of drivers (O(n log n)).
- **Task C: Minimizing Rejections** — Determines the minimum number of delivery cancellations needed to eliminate all overlapping intervals (O(n log n) dual formulation).
- **Task D: When a Greedy Choice Fails** — Formulates a concrete counterexample where a greedy strategy on delay-penalized value (Pj / (1 + Dj)) fails (V(G)=18.5 < V(S)=21.0).
- Detailed Documentation & Explanations: See [`src/part1/README.md`](src/part1/README.md).

### Part II: Divide and Conquer
- **Task A: Closest Delivery Locations** — Computes the two closest delivery locations and their squared Euclidean distance in O(n log n) time using a 2D divide-and-conquer approach with constant-neighbor strip optimization.
- **Task B: Counting Dispatch-Order Inversions** — Measures dispatch re-ordering relative to planned schedule using a merge-sort inversion counting algorithm in O(n log n) time (handles counts up to about 5 billion for n = 100,000).
- **Task C: Selecting a Delivery-Time Threshold** — Finds the k-th smallest delivery duration in worst-case O(n) time using deterministic Median-of-Medians (BFPRT) with 3-way partitioning.
- **Task D: Validation and Algorithm Analysis** — Complete analysis covering divide/combine design, asymptotic justifications, brute-force verification, and empirical timing benchmarks.
- Detailed Documentation & Explanations: See [`src/part2/README.md`](src/part2/README.md).

### Part III: Dynamic Programming
- **Task A: Maximum-Profit Delivery Scheduling** — Computes optimal non-overlapping delivery schedules with variable profits using weighted interval scheduling with binary search in O(n log n) time.
- **Task B: Delivery Selection with a Fuel Budget** — Solves 0/1 knapsack delivery selection under a fuel capacity constraint using a 2D DP table in O(nB) time.
- **Task C: Event Log Cleanup with Sequence Alignment** — Maximizes removable target log entries while strictly preserving an essential event pattern as a subsequence in O(nm) time (adapted from LeetCode #3316).
- **Task D: README, Documentation, and Testing** — Full plain-English documentation, empirical benchmarks, and validation against independent brute-force oracles.
- Detailed Documentation & Explanations: See [`src/part3/README.md`](src/part3/README.md).

---

## Project Structure

```text
pioneerDeliveryCompanyAlgorithm/
├── package.json               # NPM build & test scripts
├── tsconfig.json              # TypeScript configuration (strict, CommonJS, ES2020)
├── deliveries.txt             # Sample delivery data file for Part I
├── README.md                  # Root documentation (this file)
└── src/
    ├── part1/                 # Part I: Greedy Algorithms
    │   ├── delivery.ts        # Delivery interval class
    │   ├── minHeap.ts         # Generic binary min-heap
    │   ├── taskA.ts           # Earliest-finish-time greedy
    │   ├── taskB.ts           # Interval partitioning min drivers
    │   ├── taskC.ts           # Minimum rejections
    │   ├── fileIO.ts          # File I/O & output formatting
    │   ├── main.ts            # CLI runner for Part I
    │   ├── testTasks.ts       # Part I test suite (18 tests)
    │   └── README.md          # Full Part I documentation
    │
    ├── part2/                 # Part II: Divide and Conquer
    │   ├── location.ts        # Location class & squared distance
    │   ├── taskA.ts           # Closest pair 2D algorithm
    │   ├── taskB.ts           # Merge-sort inversion counter
    │   ├── taskC.ts           # Median-of-medians selection
    │   ├── mainPart2.ts       # CLI demo for Part II
    │   ├── testPart2.ts       # Part II test suite (21 tests)
    │   └── README.md          # Full Part II documentation
    │
    └── part3/                 # Part III: Dynamic Programming
        ├── delivery.ts        # Weighted & fuel delivery models
        ├── taskA.ts           # Weighted interval scheduling (binary search)
        ├── taskB.ts           # 0/1 knapsack fuel budget
        ├── taskC.ts           # Event log cleanup (sequence alignment DP)
        ├── mainPart3.ts       # CLI demo for Part III
        ├── testPart3.ts       # Part III test suite (46 tests)
        ├── TaskD-Report.md    # Task D report (PDF-ready)
        └── README.md          # Full Part III documentation
```

---

## Quickstart: How to Compile and Run

### 1. Install Dependencies & Build
```bash
npm install
npm run build
```

### 2. Run Main Programs / Demos
- **Part I Main:**
  ```bash
  npm start -- deliveries.txt
  ```
- **Part II Demos:**
  ```bash
  npm run start:part2
  ```
- **Part III Demos:**
  ```bash
  npm run start:part3
  ```

### 3. Run Test Suites
- **Run Part I Tests (18 tests):**
  ```bash
  npm test
  ```
- **Run Part II Tests (21 tests):**
  ```bash
  npm run test:part2
  ```
- **Run Part III Tests (46 tests):**
  ```bash
  npm run test:part3
  ```
