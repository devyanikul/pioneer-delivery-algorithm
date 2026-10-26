# Pioneer Delivery Company's Algorithm Portfolio

**Course:** CS Algorithms  
**Author:** Devyani Kulshrestha  
**Language:** TypeScript (Node.js)  
**Repository:** [GitHub Repository](https://github.com/devyanikul/pioneer-delivery-algorithm/)  

---

## Project Overview

This repository contains the semester-long algorithm portfolio for **Pioneer Delivery Company**, implementing core dispatching, routing, and scheduling algorithms. The project is split into two major parts:

1. **[Part I: Greedy Algorithms](src/part1/README.md)** — Solving interval scheduling and fleet-size optimization using greedy choices and priority queues.
2. **[Part II: Divide and Conquer](src/part2/README.md)** — Solving spatial proximity, dispatch quality measurement, and threshold selection using divide-and-conquer recurrences.

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
    └── part2/                 # Part II: Divide and Conquer
        ├── location.ts        # Location class & squared distance
        ├── taskA.ts           # Closest pair 2D algorithm
        ├── taskB.ts           # Merge-sort inversion counter
        ├── taskC.ts           # Median-of-medians selection
        ├── mainPart2.ts       # CLI demo for Part II
        ├── testPart2.ts       # Part II test suite (21 tests)
        └── README.md          # Full Part II documentation
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

### 3. Run Test Suites
- **Run Part I Tests (18 tests):**
  ```bash
  npm test
  ```
- **Run Part II Tests (21 tests):**
  ```bash
  npm run test:part2
  ```
