import { Delivery } from "./delivery";
import { maxDeliveries } from "./taskA";

/**
 * Task C: Interview-Style Variant (LeetCode 435 Non-overlapping Intervals)
 *
 * Finds the minimum number of deliveries that must be rejected.
 * This is the dual of Task A: rejected = n - (max compatible deliveries).
 *
 * Time Complexity: O(n log n)
 */
export function minRejections(deliveries: Delivery[]): number {
  const total = deliveries.length;
  const compatible = maxDeliveries(deliveries);
  return total - compatible.length;
}

