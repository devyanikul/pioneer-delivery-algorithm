import { Location } from './location';
import { closestPair } from './taskA';
import { countInversions } from './taskB';
import { medianOfMediansSelect } from './taskC';

console.log('==============================================');
console.log('Pioneer Delivery Portfolio - Part II Demos');
console.log('==============================================\n');

// --- Task A: Closest Delivery Locations ---
console.log('--- Task A: Closest Pair ---');
const sampleLocations = [
  new Location('A', 0, 0),
  new Location('B', 7, 2),
  new Location('C', 4, 5),
  new Location('D', 5, 5),
  new Location('E', 12, 2),
  new Location('F', 2, 9),
];
const pairResult = closestPair(sampleLocations);
console.log(`Closest locations: ${pairResult.id1} and ${pairResult.id2}`);
console.log(`Squared distance (d^2): ${pairResult.distSquared}`);
console.log(`Euclidean distance: ${Math.sqrt(pairResult.distSquared).toFixed(2)}\n`);

// --- Task B: Inversion Count ---
console.log('--- Task B: Dispatch Inversions ---');
const plannedDispatch = ['D1', 'D2', 'D3', 'D4', 'D5'];
const actualDispatch = ['D1', 'D3', 'D4', 'D2', 'D5'];
const invCount = countInversions(plannedDispatch, actualDispatch);
console.log(`Planned dispatch: [${plannedDispatch.join(', ')}]`);
console.log(`Actual dispatch:  [${actualDispatch.join(', ')}]`);
console.log(`Total inversions: ${invCount}\n`);

// --- Task C: Median of Medians Threshold Selection ---
console.log('--- Task C: Deterministic Selection ---');
const deliveryTimes = [18, 4, 29, 11, 4, 16, 35, 9, 22];
console.log(`Delivery time array: [${deliveryTimes.join(', ')}]`);
for (const k of [1, 2, 5, 9]) {
  const val = medianOfMediansSelect(deliveryTimes, k);
  console.log(`k = ${k} (smallest): ${val}`);
}
