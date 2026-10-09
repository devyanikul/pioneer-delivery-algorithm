import { Delivery } from "./delivery";
import { MinHeap } from "./minHeap";

// Tracks when a driver becomes free and their identifier
interface DriverEntry {
  availableTime: number; // finish time of their last assigned delivery
  driverNumber: number;  // 1-based driver ID
}

export interface MinDriversResult {
  numDrivers: number;
  assignments: Map<number, Delivery[]>;
}

/**
 * Task B: Minimum Number of Drivers
 *
 * Greedy algorithm using a min-heap to find the minimum number of drivers
 * required to complete all deliveries without any overlaps.
 *
 * Time Complexity: O(n log n)
 */
export function minDrivers(deliveries: Delivery[]): MinDriversResult {
  if (deliveries.length === 0) {
    return { numDrivers: 0, assignments: new Map() };
  }

  // Sort by start time, breaking ties by finish time — O(n log n)
  const sorted = [...deliveries].sort((a, b) => {
    if (a.startTime !== b.startTime) return a.startTime - b.startTime;
    return a.finishTime - b.finishTime;
  });

  // Min-heap ordered by available time
  const heap = new MinHeap<DriverEntry>(
    (a, b) => a.availableTime - b.availableTime
  );

  const assignments = new Map<number, Delivery[]>();
  let driverCount = 0;

  for (const delivery of sorted) {
    if (!heap.isEmpty() && heap.peek()!.availableTime <= delivery.startTime) {
      // Reuse the driver that becomes available earliest
      const driver = heap.pop()!;
      assignments.get(driver.driverNumber)!.push(delivery);
      heap.push({ availableTime: delivery.finishTime, driverNumber: driver.driverNumber });
    } else {
      // Need a new driver
      driverCount++;
      assignments.set(driverCount, [delivery]);
      heap.push({ availableTime: delivery.finishTime, driverNumber: driverCount });
    }
  }

  return { numDrivers: driverCount, assignments };
}

