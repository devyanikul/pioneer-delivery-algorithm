import { Delivery } from "./delivery";

/**
 * Task A: Maximum Deliveries for One Driver
 *
 * Greedy algorithm that selects the maximum number of mutually compatible deliveries
 * for a single driver using the earliest finish time first strategy.
 *
 * Time Complexity: O(n log n) due to sorting, followed by an O(n) scan.
 */
export function maxDeliveries(deliveries: Delivery[]): Delivery[] {
  if (deliveries.length === 0) {
    return [];
  }
  

  // Sort by finish time — O(n log n)
  const sorted = [...deliveries].sort((a, b) => a.finishTime - b.finishTime);

  const selected: Delivery[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    // A delivery is compatible if its start time >= the last selected delivery's finish time
    if (sorted[i].startTime >= selected[selected.length - 1].finishTime) {
      selected.push(sorted[i]);
    }
  }

  return selected;
}

