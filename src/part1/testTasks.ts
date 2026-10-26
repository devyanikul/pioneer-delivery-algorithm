/**
 * testTasks.ts
 *
 * Comprehensive test suite for all three tasks in the Pioneer Delivery
 * scheduling system, covering all required test cases from the assignment.
 *
 * Usage:
 *   npx tsc && node dist/testTasks.js
 */

import { Delivery } from "./delivery";
import { maxDeliveries } from "./taskA";
import { minDrivers } from "./taskB";
import { minRejections } from "./taskC";

/** Helper: create Delivery objects from a list of [start, finish] tuples. */
function makeDeliveries(intervals: [number, number][]): Delivery[] {
  return intervals.map(
    ([start, finish], i) =>
      new Delivery(`D${String(i + 1).padStart(2, "0")}`, start, finish)
  );
}

/** Run a single test and print PASS/FAIL. */
function runTest(
  testName: string,
  actual: number | boolean,
  expected: number | boolean
): boolean {
  const passed = actual === expected;
  const symbol = passed ? "✓" : "✗";
  const status = passed ? "PASS" : "FAIL";
  console.log(
    `  ${symbol} ${testName}: expected=${expected}, got=${actual} [${status}]`
  );
  return passed;
}

// ───────────────────────────────────────────────────────────────
// Task A Tests: Maximum Deliveries for One Driver
// ───────────────────────────────────────────────────────────────
function testTaskA(): boolean {
  console.log("=".repeat(60));
  console.log("TASK A TESTS: Maximum Deliveries for One Driver");
  console.log("=".repeat(60));
  let allPassed = true;

  // Test 1: No deliveries
  let result = maxDeliveries([]);
  allPassed = runTest("Test 1 (no deliveries)", result.length, 0) && allPassed;

  // Test 2: Single delivery (1,3)
  let deliveries = makeDeliveries([[1, 3]]);
  result = maxDeliveries(deliveries);
  allPassed =
    runTest("Test 2 (single delivery)", result.length, 1) && allPassed;

  // Test 3: Three non-overlapping (1,3), (3,5), (5,7)
  deliveries = makeDeliveries([
    [1, 3],
    [3, 5],
    [5, 7],
  ]);
  result = maxDeliveries(deliveries);
  allPassed = runTest("Test 3 (chain of 3)", result.length, 3) && allPassed;

  // Test 4: Three all-overlapping (1,5), (2,6), (3,7)
  deliveries = makeDeliveries([
    [1, 5],
    [2, 6],
    [3, 7],
  ]);
  result = maxDeliveries(deliveries);
  allPassed = runTest("Test 4 (all overlap)", result.length, 1) && allPassed;

  // Test 5: (5,7), (1,3), (3,5), (2,4)
  deliveries = makeDeliveries([
    [5, 7],
    [1, 3],
    [3, 5],
    [2, 4],
  ]);
  result = maxDeliveries(deliveries);
  allPassed =
    runTest("Test 5 (unsorted input)", result.length, 3) && allPassed;

  // Test 6: (1,4), (2,4), (4,6)
  deliveries = makeDeliveries([
    [1, 4],
    [2, 4],
    [4, 6],
  ]);
  result = maxDeliveries(deliveries);
  allPassed =
    runTest("Test 6 (shared endpoint)", result.length, 2) && allPassed;

  console.log();
  return allPassed;
}

// ───────────────────────────────────────────────────────────────
// Task B Tests: Minimum Number of Drivers
// ───────────────────────────────────────────────────────────────
function testTaskB(): boolean {
  console.log("=".repeat(60));
  console.log("TASK B TESTS: Minimum Number of Drivers");
  console.log("=".repeat(60));
  let allPassed = true;

  // Test 1: No deliveries
  let { numDrivers } = minDrivers([]);
  allPassed = runTest("Test 1 (no deliveries)", numDrivers, 0) && allPassed;

  // Test 2: Single delivery (1,3)
  let deliveries = makeDeliveries([[1, 3]]);
  ({ numDrivers } = minDrivers(deliveries));
  allPassed = runTest("Test 2 (single delivery)", numDrivers, 1) && allPassed;

  // Test 3: Three non-overlapping (1,3), (3,5), (5,7)
  deliveries = makeDeliveries([
    [1, 3],
    [3, 5],
    [5, 7],
  ]);
  ({ numDrivers } = minDrivers(deliveries));
  allPassed = runTest("Test 3 (chain of 3)", numDrivers, 1) && allPassed;

  // Test 4: Three all-overlapping (1,5), (2,6), (3,7)
  deliveries = makeDeliveries([
    [1, 5],
    [2, 6],
    [3, 7],
  ]);
  ({ numDrivers } = minDrivers(deliveries));
  allPassed = runTest("Test 4 (all overlap)", numDrivers, 3) && allPassed;

  // Test 5: (1,4), (2,5), (4,7), (5,8)
  deliveries = makeDeliveries([
    [1, 4],
    [2, 5],
    [4, 7],
    [5, 8],
  ]);
  ({ numDrivers } = minDrivers(deliveries));
  allPassed = runTest("Test 5 (two drivers)", numDrivers, 2) && allPassed;

  // Test 6: (5,8), (1,4), (2,5), (4,6), (6,9)
  deliveries = makeDeliveries([
    [5, 8],
    [1, 4],
    [2, 5],
    [4, 6],
    [6, 9],
  ]);
  let result = minDrivers(deliveries);
  allPassed = runTest("Test 6 (mixed)", result.numDrivers, 2) && allPassed;

  // Validate assignments: no driver has overlapping deliveries
  let valid = true;
  for (const [, driverDeliveries] of result.assignments) {
    const sortedD = [...driverDeliveries].sort(
      (a, b) => a.startTime - b.startTime
    );
    for (let i = 0; i < sortedD.length - 1; i++) {
      if (sortedD[i].finishTime > sortedD[i + 1].startTime) {
        valid = false;
        break;
      }
    }
  }
  allPassed =
    runTest("Test 6 (no overlaps in assignments)", valid, true) && allPassed;

  // Validate all deliveries are assigned
  const allAssigned = new Set<string>();
  for (const [, driverDeliveries] of result.assignments) {
    for (const d of driverDeliveries) {
      allAssigned.add(d.deliveryId);
    }
  }
  allPassed =
    runTest("Test 6 (all deliveries assigned)", allAssigned.size, 5) &&
    allPassed;

  console.log();
  return allPassed;
}

// ───────────────────────────────────────────────────────────────
// Task C Tests: Minimum Rejections
// ───────────────────────────────────────────────────────────────
function testTaskC(): boolean {
  console.log("=".repeat(60));
  console.log("TASK C TESTS: Minimum Deliveries to Reject");
  console.log("=".repeat(60));
  let allPassed = true;

  // Test 1: No deliveries
  let result = minRejections([]);
  allPassed = runTest("Test 1 (no deliveries)", result, 0) && allPassed;

  // Test 2: Single delivery (1,3)
  let deliveries = makeDeliveries([[1, 3]]);
  result = minRejections(deliveries);
  allPassed = runTest("Test 2 (single delivery)", result, 0) && allPassed;

  // Test 3: Three non-overlapping (1,3), (3,5), (5,7)
  deliveries = makeDeliveries([
    [1, 3],
    [3, 5],
    [5, 7],
  ]);
  result = minRejections(deliveries);
  allPassed =
    runTest("Test 3 (no rejections needed)", result, 0) && allPassed;

  // Test 4: Three all-overlapping (1,5), (2,6), (3,7)
  deliveries = makeDeliveries([
    [1, 5],
    [2, 6],
    [3, 7],
  ]);
  result = minRejections(deliveries);
  allPassed = runTest("Test 4 (reject 2)", result, 2) && allPassed;

  // Test 5: (5,7), (1,3), (3,5), (2,4)
  deliveries = makeDeliveries([
    [5, 7],
    [1, 3],
    [3, 5],
    [2, 4],
  ]);
  result = minRejections(deliveries);
  allPassed = runTest("Test 5 (reject 1)", result, 1) && allPassed;

  // Test 6: (1,2), (2,3), (3,4), (1,3)
  deliveries = makeDeliveries([
    [1, 2],
    [2, 3],
    [3, 4],
    [1, 3],
  ]);
  result = minRejections(deliveries);
  allPassed = runTest("Test 6 (reject 1)", result, 1) && allPassed;

  console.log();
  return allPassed;
}

// ───────────────────────────────────────────────────────────────
// Run all tests
// ───────────────────────────────────────────────────────────────
function main(): void {
  console.log();
  console.log("Pioneer Delivery Company — Test Suite");
  console.log("=".repeat(60));
  console.log();

  const aPassed = testTaskA();
  const bPassed = testTaskB();
  const cPassed = testTaskC();

  console.log("=".repeat(60));
  if (aPassed && bPassed && cPassed) {
    console.log("ALL TESTS PASSED ✓");
  } else {
    if (!aPassed) console.log("TASK A: Some tests FAILED");
    if (!bPassed) console.log("TASK B: Some tests FAILED");
    if (!cPassed) console.log("TASK C: Some tests FAILED");
  }
  console.log("=".repeat(60));
}

main();

