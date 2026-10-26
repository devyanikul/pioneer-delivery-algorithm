import { Location } from './location';
import { closestPair, closestPairBruteForce } from './taskA';
import { countInversions, countInversionsNaive } from './taskB';
import { medianOfMediansSelect } from './taskC';

let passed = 0;
let failed = 0;

function assertEqual(testName: string, actual: unknown, expected: unknown): void {
  const isMatch = JSON.stringify(actual) === JSON.stringify(expected);
  if (isMatch) {
    console.log(`  [PASS] ${testName}`);
    passed++;
  } else {
    console.log(`  [FAIL] ${testName}: expected ${expected}, got ${actual}`);
    failed++;
  }
}

function assertClosestPair(
  testName: string,
  result: { id1: string; id2: string; distSquared: number },
  expectedPair: [string, string],
  expectedDist: number
): void {
  const pairMatches =
    (result.id1 === expectedPair[0] && result.id2 === expectedPair[1]) ||
    (result.id1 === expectedPair[1] && result.id2 === expectedPair[0]);
  const distMatches = result.distSquared === expectedDist;

  if (pairMatches && distMatches) {
    console.log(`  [PASS] ${testName}`);
    passed++;
  } else {
    console.log(
      `  [FAIL] ${testName}: expected (${expectedPair[0]}, ${expectedPair[1]}, d^2=${expectedDist}), ` +
        `got (${result.id1}, ${result.id2}, d^2=${result.distSquared})`
    );
    failed++;
  }
}

// Simple deterministic random generator for test benchmarks
function makeRng(seed = 12345) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

// ----------------------------------------------------
// TASK A TESTS: Closest Pair of Points
// ----------------------------------------------------
function runTaskATests(): void {
  console.log('\n--- Task A Tests ---');

  // A1: Two points
  const a1 = [new Location('A', 0, 0), new Location('B', 3, 4)];
  assertClosestPair('A1 (2 points)', closestPair(a1), ['A', 'B'], 25);

  // A2: Six points from assignment
  const a2 = [
    new Location('A', 0, 0),
    new Location('B', 7, 2),
    new Location('C', 4, 5),
    new Location('D', 5, 5),
    new Location('E', 12, 2),
    new Location('F', 2, 9),
  ];
  assertClosestPair('A2 (6 points)', closestPair(a2), ['C', 'D'], 1);

  // A3: Crucial test where closest pair crosses the cut line
  const a3 = [
    new Location('A', -3, 1),
    new Location('B', -3, 11),
    new Location('C', 1, 1),
    new Location('D', 2, 15),
  ];
  assertClosestPair('A3 (cross-half pair)', closestPair(a3), ['A', 'C'], 16);

  // A4: Negative coordinates
  const a4 = [
    new Location('A', -5, -5),
    new Location('B', -5, -2),
    new Location('C', 6, 8),
  ];
  assertClosestPair('A4 (negative coordinates)', closestPair(a4), ['A', 'B'], 9);

  // Edge case: points sharing identical x-coordinates
  const vertical = [
    new Location('P1', 2, 1),
    new Location('P2', 2, 9),
    new Location('P3', 2, 4),
    new Location('P4', 2, 15),
  ];
  assertClosestPair('A5 (all on vertical line)', closestPair(vertical), ['P1', 'P3'], 9);

  // Correctness test against brute force on 40 random points
  const rng = makeRng(42);
  const randomPts: Location[] = [];
  for (let i = 0; i < 40; i++) {
    randomPts.push(
      new Location(`L${i}`, Math.floor(rng() * 1000), Math.floor(rng() * 1000))
    );
  }
  const fastRes = closestPair(randomPts);
  const slowRes = closestPairBruteForce(randomPts);
  assertEqual('A6 (divide & conquer matches brute-force)', fastRes.distSquared, slowRes.distSquared);
}

// ----------------------------------------------------
// TASK B TESTS: Inversion Counting
// ----------------------------------------------------
function runTaskBTests(): void {
  console.log('\n--- Task B Tests ---');

  // B1: 2 inversions
  assertEqual(
    'B1 (2 inversions)',
    countInversions(['A', 'B', 'C', 'D', 'E'], ['A', 'C', 'D', 'B', 'E']),
    2
  );

  // B2: Already in order (0 inversions)
  assertEqual(
    'B2 (identical order)',
    countInversions(['A', 'B', 'C', 'D'], ['A', 'B', 'C', 'D']),
    0
  );

  // B3: Completely reversed (6 inversions)
  assertEqual(
    'B3 (completely reversed)',
    countInversions(['A', 'B', 'C', 'D'], ['D', 'C', 'B', 'A']),
    6
  );

  // B4: Single element
  assertEqual('B4 (single item)', countInversions(['A'], ['A']), 0);

  // Compare against naive n^2 implementation
  const pList = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];
  const aList = ['D3', 'D1', 'D7', 'D2', 'D6', 'D4', 'D5'];
  assertEqual(
    'B5 (matches naive check on small list)',
    countInversions(pList, aList),
    countInversionsNaive(pList, aList)
  );

  // Large input test: n = 100,000 reversed -> n*(n-1)/2 = 4,999,950,000
  const n = 100000;
  const plannedBig: string[] = [];
  const actualBig: string[] = [];
  for (let i = 1; i <= n; i++) {
    plannedBig.push(String(i));
    actualBig.push(String(n - i + 1));
  }
  const bigCount = countInversions(plannedBig, actualBig);
  assertEqual('B6 (large input n=100,000 reversed)', bigCount, 4999950000);
}

// ----------------------------------------------------
// TASK C TESTS: Deterministic Median-of-Medians
// ----------------------------------------------------
function runTaskCTests(): void {
  console.log('\n--- Task C Tests ---');

  const times = [18, 4, 29, 11, 4, 16, 35, 9, 22];

  // Required assignment tests C1 - C5
  assertEqual('C1 (k=5)', medianOfMediansSelect(times, 5), 16);
  assertEqual('C2 (k=2)', medianOfMediansSelect(times, 2), 4);
  assertEqual('C3 (k=9, max)', medianOfMediansSelect(times, 9), 35);
  assertEqual('C4 (duplicates of 7)', medianOfMediansSelect([7, 7, 7, 7, 7, 7], 4), 7);
  assertEqual('C5 (two elements [8, 3], k=1)', medianOfMediansSelect([8, 3], 1), 3);

  // Additional edge cases
  const sortedArr = [2, 5, 8, 12, 19, 23, 31];
  assertEqual('C6 (already sorted array, k=4)', medianOfMediansSelect(sortedArr, 4), 12);

  const reverseArr = [50, 40, 30, 20, 10];
  assertEqual('C7 (reverse sorted array, k=2)', medianOfMediansSelect(reverseArr, 2), 20);

  const heavyDupes = [3, 3, 3, 1, 1, 9, 9, 9, 9, 2];
  assertEqual('C8 (heavy duplicates, k=6)', medianOfMediansSelect(heavyDupes, 6), 3);

  // Verification against JS native array sort on 150 random integers
  const rng = makeRng(77);
  const randNums: number[] = [];
  for (let i = 0; i < 150; i++) {
    randNums.push(Math.floor(rng() * 400));
  }
  const copySorted = [...randNums].sort((a, b) => a - b);
  const targetK = 75;
  assertEqual(
    'C9 (matches native sort on random array)',
    medianOfMediansSelect(randNums, targetK),
    copySorted[targetK - 1]
  );
}

// Run all
console.log('Pioneer Delivery Portfolio - Running Part II Tests...');
runTaskATests();
runTaskBTests();
runTaskCTests();

console.log(`\nTest Summary: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
