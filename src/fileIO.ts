/**
 * fileIO.ts
 *
 * Input/output utilities for reading delivery data files and formatting
 * output for the Pioneer Delivery scheduling system.
 */

import * as fs from "fs";
import { Delivery } from "./delivery";

/**
 * Read delivery requests from a text file.
 *
 * Expected file format (one delivery per line):
 *     <delivery_id> <start_time> <finish_time>
 *
 * Blank lines and lines starting with '#' are ignored.
 *
 * @param filepath  Path to the data file.
 * @returns         Array of Delivery objects.
 */
export function readDeliveries(filepath: string): Delivery[] {
  const content = fs.readFileSync(filepath, "utf-8");
  const deliveries: Delivery[] = [];

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const parts = line.split(/\s+/);
    if (parts.length < 3) continue;

    const deliveryId = parts[0];
    const startTime = parseInt(parts[1], 10);
    const finishTime = parseInt(parts[2], 10);

    deliveries.push(new Delivery(deliveryId, startTime, finishTime));
  }

  return deliveries;
}

/**
 * Print the results of Task A: maximum deliveries for one driver.
 */
export function printSelectedDeliveries(selected: Delivery[]): void {
  console.log("Selected Deliveries:");
  if (selected.length === 0) {
    console.log("  (none)");
  } else {
    for (const d of selected) {
      console.log(`  ${d.deliveryId}  [${d.startTime}, ${d.finishTime})`);
    }
  }
  console.log(`Total deliveries completed: ${selected.length}`);
}

/**
 * Print the results of Task B: minimum number of drivers.
 */
export function printDriverAssignments(
  assignments: Map<number, Delivery[]>,
  numDrivers: number
): void {
  console.log("Driver Assignments:");
  if (numDrivers === 0) {
    console.log("  (no deliveries)");
  } else {
    const sortedKeys = [...assignments.keys()].sort((a, b) => a - b);
    for (const driverNum of sortedKeys) {
      const deliveries = assignments.get(driverNum)!;
      const ids = deliveries.map((d) => d.deliveryId).join(" ");
      console.log(`  Driver ${driverNum}: ${ids}`);
    }
  }
  console.log(`Minimum drivers required: ${numDrivers}`);
}

/**
 * Print the results of Task C: minimum rejections.
 */
export function printRejectedDeliveries(
  rejectedCount: number,
  total: number
): void {
  console.log(`Total deliveries: ${total}`);
  console.log(`Minimum deliveries to reject: ${rejectedCount}`);
}

