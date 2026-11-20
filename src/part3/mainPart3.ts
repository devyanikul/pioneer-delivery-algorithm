import { WeightedDelivery, FuelDelivery } from './delivery';
import { scheduleWeightedDeliveries } from './taskA';
import { selectDeliveriesWithBudget } from './taskB';
import { maxRemovalsFromSource } from './taskC';

console.log('==============================================');
console.log('Pioneer Delivery Portfolio - Part III Demos');
console.log('==============================================\n');

// --- Task A: Maximum-Profit Delivery Scheduling ---
console.log('--- Task A: Weighted Interval Scheduling ---');
const sampleDeliveries = [
  new WeightedDelivery('A', 0, 3, 50),
  new WeightedDelivery('B', 1, 4, 60),
  new WeightedDelivery('C', 3, 5, 40),
  new WeightedDelivery('D', 4, 7, 70),
  new WeightedDelivery('E', 5, 8, 50),
  new WeightedDelivery('F', 7, 9, 50),
];
const scheduleRes = scheduleWeightedDeliveries(sampleDeliveries);
console.log(`Available requests: ${sampleDeliveries.map((d) => `${d.id}(${d.start}-${d.finish}, $${d.profit})`).join(', ')}`);
console.log(`Maximum obtainable profit: $${scheduleRes.maxProfit}`);
console.log(`Optimal schedule (chronological): [${scheduleRes.selectedIds.join(', ')}]\n`);

// --- Task B: Delivery Selection with a Fuel Budget ---
console.log('--- Task B: Fuel Budget Knapsack ---');
const fuelCandidates = [
  new FuelDelivery('P', 4, 20),
  new FuelDelivery('Q', 3, 14),
  new FuelDelivery('R', 5, 29),
  new FuelDelivery('S', 2, 10),
  new FuelDelivery('T', 6, 31),
];
const budget = 10;
const knapsackRes = selectDeliveriesWithBudget(fuelCandidates, budget);
console.log(`Candidate deliveries: ${fuelCandidates.map((d) => `${d.id}(cost:${d.fuelCost}, profit:$${d.profit})`).join(', ')}`);
console.log(`Fuel budget: ${budget} units`);
console.log(`Maximum profit: $${knapsackRes.maxProfit}`);
console.log(`Total fuel cost used: ${knapsackRes.totalFuelCost} units`);
console.log(`Selected deliveries: [${knapsackRes.selectedIds.join(', ')}]\n`);

// --- Task C: Event Log Cleanup with Sequence Alignment ---
console.log('--- Task C: Event Log Cleanup ---');
const sourceLog = 'yeyeykyded';
const patternEvents = 'yeyyd';
const targets = [0, 2, 3, 4];
const cleanupRes = maxRemovalsFromSource(sourceLog, patternEvents, targets);
console.log(`Source event log: "${sourceLog}"`);
console.log(`Required pattern: "${patternEvents}"`);
console.log(`Eligible target indices for removal: [${targets.join(', ')}]`);
console.log(`Maximum removals possible: ${cleanupRes.maxRemovals}`);
console.log(`Removed indices: [${cleanupRes.removedIndices.join(', ')}]`);

// Display cleaned string with underscores for deleted positions
const removedSet = new Set(cleanupRes.removedIndices);
const masked = sourceLog.split('').map((ch, idx) => (removedSet.has(idx) ? '_' : ch)).join('');
console.log(`Resulting cleaned log: "${masked}"`);
