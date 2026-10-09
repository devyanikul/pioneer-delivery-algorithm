/**
 * main.ts
 *
 * Main entry point for the Pioneer Delivery Company scheduling system.
 *
 * Reads delivery requests from a data file and runs all three tasks:
 *   Task A: Maximum deliveries for one driver
 *   Task B: Minimum number of drivers to accept all deliveries
 *   Task C: Minimum number of deliveries to reject
 *
 * Usage:
 *   npx tsc && node dist/main.js <data_file>
 *
 * Example:
 *   npx tsc && node dist/main.js deliveries.txt
 */

import {
  readDeliveries,
  printSelectedDeliveries,
  printDriverAssignments,
  printRejectedDeliveries,
} from "./fileIO";
import { maxDeliveries } from "./taskA";
import { minDrivers } from "./taskB";
import { minRejections } from "./taskC";
import { Delivery } from "./delivery";

function runTaskA(deliveries: Delivery[]): void {
  console.log("=".repeat(60));
  console.log("TASK A: Maximum Deliveries for One Driver");
  console.log("=".repeat(60));
  const selected = maxDeliveries(deliveries);
  printSelectedDeliveries(selected);
  console.log();
}

function runTaskB(deliveries: Delivery[]): void {
  console.log("=".repeat(60));
  console.log("TASK B: Minimum Number of Drivers");
  console.log("=".repeat(60));
  const result = minDrivers(deliveries);
  printDriverAssignments(result.assignments, result.numDrivers);
  console.log();
}

function runTaskC(deliveries: Delivery[]): void {
  console.log("=".repeat(60));
  console.log("TASK C: Minimum Deliveries to Reject");
  console.log("=".repeat(60));
  const rejected = minRejections(deliveries);
  printRejectedDeliveries(rejected, deliveries.length);
  console.log();
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log("Usage: node dist/main.js <data_file>");
    console.log("Example: node dist/main.js deliveries.txt");
    process.exit(1);
  }

  const filepath = args[0];
  let deliveries: Delivery[];

  try {
    deliveries = readDeliveries(filepath);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error reading file: ${error.message}`);
    }
    process.exit(1);
  }

  console.log(`Read ${deliveries.length} delivery requests from '${filepath}'`);
  console.log();

  //runTaskA(deliveries);
  runTaskB(deliveries);
  runTaskC(deliveries);
}

main();

