import { WeightedDelivery, FuelDelivery } from './delivery';
import { scheduleWeightedDeliveries, scheduleWeightedDeliveriesBruteForce } from './taskA';
import { selectDeliveriesWithBudget, selectDeliveriesWithBudgetBruteForce } from './taskB';
import { maxRemovalsFromSource, maxRemovalsFromSourceBruteForce, isSubsequence } from './taskC';

let passed = 0;
let failed = 0;

function assertEqual(testName: string, actual: unknown, expected: unknown): void {
  const isMatch = JSON.stringify(actual) === JSON.stringify(expected);
  if (isMatch) {
    console.log(`  [PASS] ${testName}`);
    passed++;
  } else {
    console.log(`  [FAIL] ${testName}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    failed++;
  }
}

// ----------------------------------------------------
// TASK A TESTS: Weighted Interval Scheduling
// ----------------------------------------------------
function runTaskATests(): void {
  console.log('\n--- Task A: Maximum-Profit Delivery Scheduling ---');

  // A1: PDF Example
  const a1Deliveries = [
    new WeightedDelivery('A', 0, 3, 50),
    new WeightedDelivery('B', 1, 4, 60),
    new WeightedDelivery('C', 3, 5, 40),
    new WeightedDelivery('D', 4, 7, 70),
    new WeightedDelivery('E', 5, 8, 50),
    new WeightedDelivery('F', 7, 9, 50),
  ];
  const a1Result = scheduleWeightedDeliveries(a1Deliveries);
  assertEqual('A1 (PDF example max profit)', a1Result.maxProfit, 180);
  assertEqual('A1 (PDF example selected IDs)', a1Result.selectedIds, ['B', 'D', 'F']);

  // A2: Empty delivery set
  const a2Result = scheduleWeightedDeliveries([]);
  assertEqual('A2 (empty input profit)', a2Result.maxProfit, 0);
  assertEqual('A2 (empty input schedule)', a2Result.selectedIds, []);

  // A3: Requests that touch at an endpoint (start == finish of previous)
  const a3Deliveries = [
    new WeightedDelivery('D1', 1, 4, 30),
    new WeightedDelivery('D2', 4, 8, 50),
    new WeightedDelivery('D3', 8, 10, 20),
  ];
  const a3Result = scheduleWeightedDeliveries(a3Deliveries);
  assertEqual('A3 (touching endpoints profit)', a3Result.maxProfit, 100);
  assertEqual('A3 (touching endpoints schedule)', a3Result.selectedIds, ['D1', 'D2', 'D3']);

  // A4: Mutually overlapping requests (must select single highest profit)
  const a4Deliveries = [
    new WeightedDelivery('D1', 2, 7, 100),
    new WeightedDelivery('D2', 3, 5, 40),
    new WeightedDelivery('D3', 1, 6, 80),
  ];
  const a4Result = scheduleWeightedDeliveries(a4Deliveries);
  assertEqual('A4 (mutually overlapping profit)', a4Result.maxProfit, 100);
  assertEqual('A4 (mutually overlapping schedule)', a4Result.selectedIds, ['D1']);

  // A5: Verify greedy earliest-finish-time fails compared to weighted DP
  // In the PDF example, earliest finish time selects A, C, E with total 140, while DP yields 180
  const greedyEarns = 50 + 40 + 50; // A, C, E
  assertEqual('A5 (DP strictly beats greedy 180 vs 140)', a1Result.maxProfit > greedyEarns, true);

  // A6: Independent check against brute force on 8 requests
  const a6Deliveries = [
    new WeightedDelivery('R1', 0, 4, 25),
    new WeightedDelivery('R2', 2, 5, 45),
    new WeightedDelivery('R3', 4, 7, 30),
    new WeightedDelivery('R4', 1, 8, 90),
    new WeightedDelivery('R5', 5, 9, 40),
    new WeightedDelivery('R6', 7, 11, 35),
    new WeightedDelivery('R7', 8, 12, 50),
    new WeightedDelivery('R8', 10, 14, 20),
  ];
  const a6Dp = scheduleWeightedDeliveries(a6Deliveries);
  const a6Bf = scheduleWeightedDeliveriesBruteForce(a6Deliveries);
  assertEqual('A6 (DP matches brute force profit on 8 requests)', a6Dp.maxProfit, a6Bf.maxProfit);
}

// ----------------------------------------------------
// TASK B TESTS: Fuel Budget Knapsack
// ----------------------------------------------------
function runTaskBTests(): void {
  console.log('\n--- Task B: Delivery Selection with a Fuel Budget ---');

  // B1: PDF Example (budget = 10, items P, Q, R, S, T)
  const b1Deliveries = [
    new FuelDelivery('P', 4, 20),
    new FuelDelivery('Q', 3, 14),
    new FuelDelivery('R', 5, 29),
    new FuelDelivery('S', 2, 10),
    new FuelDelivery('T', 6, 31),
  ];
  const b1Result = selectDeliveriesWithBudget(b1Deliveries, 10);
  assertEqual('B1 (PDF example max profit)', b1Result.maxProfit, 53);
  assertEqual('B1 (PDF example total fuel cost)', b1Result.totalFuelCost, 10);
  assertEqual('B1 (PDF example selected items)', b1Result.selectedIds, ['Q', 'R', 'S']);

  // B2: Zero budget
  const b2Result = selectDeliveriesWithBudget(b1Deliveries, 0);
  assertEqual('B2 (zero budget profit)', b2Result.maxProfit, 0);
  assertEqual('B2 (zero budget cost)', b2Result.totalFuelCost, 0);
  assertEqual('B2 (zero budget items)', b2Result.selectedIds, []);

  // B3: Item that exactly fits the budget
  const b3Deliveries = [
    new FuelDelivery('D1', 5, 50),
    new FuelDelivery('D2', 8, 90),
    new FuelDelivery('D3', 3, 25),
  ];
  const b3Result = selectDeliveriesWithBudget(b3Deliveries, 5);
  assertEqual('B3 (exact fit profit)', b3Result.maxProfit, 50);
  assertEqual('B3 (exact fit cost)', b3Result.totalFuelCost, 5);
  assertEqual('B3 (exact fit items)', b3Result.selectedIds, ['D1']);

  // B4: Empty delivery set
  const b4Result = selectDeliveriesWithBudget([], 10);
  assertEqual('B4 (empty input profit)', b4Result.maxProfit, 0);
  assertEqual('B4 (empty input cost)', b4Result.totalFuelCost, 0);
  assertEqual('B4 (empty input items)', b4Result.selectedIds, []);

  // B5: All items fit within budget
  const b5Deliveries = [
    new FuelDelivery('D1', 2, 10),
    new FuelDelivery('D2', 3, 15),
    new FuelDelivery('D3', 1, 8),
  ];
  const b5Result = selectDeliveriesWithBudget(b5Deliveries, 10);
  assertEqual('B5 (all fit profit)', b5Result.maxProfit, 33);
  assertEqual('B5 (all fit cost)', b5Result.totalFuelCost, 6);
  assertEqual('B5 (all fit items)', b5Result.selectedIds, ['D1', 'D2', 'D3']);

  // B6: Independent check against brute force on 8 items
  const b6Deliveries = [
    new FuelDelivery('I1', 3, 12),
    new FuelDelivery('I2', 4, 17),
    new FuelDelivery('I3', 6, 24),
    new FuelDelivery('I4', 2, 9),
    new FuelDelivery('I5', 5, 21),
    new FuelDelivery('I6', 7, 30),
    new FuelDelivery('I7', 1, 5),
    new FuelDelivery('I8', 4, 18),
  ];
  const b6Dp = selectDeliveriesWithBudget(b6Deliveries, 15);
  const b6Bf = selectDeliveriesWithBudgetBruteForce(b6Deliveries, 15);
  assertEqual('B6 (DP matches brute force profit on 8 items)', b6Dp.maxProfit, b6Bf.maxProfit);
  assertEqual('B6 (DP respected fuel budget <= 15)', b6Dp.totalFuelCost <= 15, true);
}

// ----------------------------------------------------
// TASK C TESTS: Event Log Cleanup with Sequence Alignment
// ----------------------------------------------------
function runTaskCTests(): void {
  console.log('\n--- Task C: Event Log Cleanup with Sequence Alignment ---');

  // Helper to test Task C and verify that removing indices preserves subsequence
  function testAndValidateTaskC(
    label: string,
    source: string,
    pattern: string,
    targetIndices: number[],
    expectedRemovals: number
  ): void {
    const res = maxRemovalsFromSource(source, pattern, targetIndices);
    assertEqual(`${label} (removal count)`, res.maxRemovals, expectedRemovals);

    // Verify all removed indices were in targetIndices
    const targetSet = new Set(targetIndices);
    const allValidTargets = res.removedIndices.every((idx) => targetSet.has(idx));
    assertEqual(`${label} (all removed were valid targetIndices)`, allValidTargets, true);

    // Verify pattern remains a subsequence after removal
    const removedSet = new Set(res.removedIndices);
    let remaining = '';
    for (let i = 0; i < source.length; i++) {
      if (!removedSet.has(i)) {
        remaining += source[i];
      }
    }
    const subPreserved = isSubsequence(pattern, remaining);
    assertEqual(`${label} (subsequence '${pattern}' preserved)`, subPreserved, true);
  }

  // C1: PDF Example 1
  testAndValidateTaskC('C1 (PDF example 1)', 'abbaa', 'aba', [0, 1, 2], 1);

  // C2: PDF Example 2
  testAndValidateTaskC('C2 (PDF example 2)', 'bcda', 'd', [0, 3], 2);

  // C3: PDF Example 3 (Zero removals possible)
  testAndValidateTaskC('C3 (PDF example 3, zero removals)', 'dda', 'dda', [0, 1, 2], 0);

  // C4: PDF Example 4 (Duplicates with alignment)
  testAndValidateTaskC('C4 (PDF example 4)', 'yeyeykyded', 'yeyyd', [0, 2, 3, 4], 2);

  // C5: All eligible characters can be removed
  testAndValidateTaskC('C5 (all targets removable)', 'abcdefg', 'bdf', [0, 2, 4, 6], 4);

  // C6: Repeated symbols with multiple possible alignments
  testAndValidateTaskC('C6 (repeated symbols)', 'aaaaaa', 'aa', [0, 1, 2, 3, 4, 5], 4);

  // C7: Independent check against brute force on a custom instance
  const c7Source = 'abracadabra';
  const c7Pattern = 'rdr';
  const c7Targets = [0, 2, 4, 6, 8, 10];
  const c7Dp = maxRemovalsFromSource(c7Source, c7Pattern, c7Targets);
  const c7Bf = maxRemovalsFromSourceBruteForce(c7Source, c7Pattern, c7Targets);
  assertEqual('C7 (DP matches brute force on custom instance)', c7Dp.maxRemovals, c7Bf.maxRemovals);
}

// ----------------------------------------------------
// Run all tests
// ----------------------------------------------------
console.log('Pioneer Delivery Portfolio - Running Part III Tests...');
runTaskATests();
runTaskBTests();
runTaskCTests();

console.log(`\nTest Summary: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
