# Pioneer Delivery Company's Algorithm Portfolio
## Part I: Greedy Algorithms

**Course:** CS Algorithms  
**Project:** Pioneer Delivery Company Portfolio — Part I  
**Author:** Devyani Kulshrestha  
**Language:** TypeScript (Node.js)            
**Github Link:** https://github.com/devyanikul/pioneer-delivery-algorithm/

---

---

## How to Compile and Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Compile TypeScript
```bash
npm run build
```
*(Compiles `.ts` files from `src/` to `.js` files in `dist/` using `tsconfig.json`)*

### 3. Run the Main Program
```bash
npm start -- deliveries.txt
```
or directly with Node after compiling:
```bash
node dist/main.js deliveries.txt
```

This reads the delivery data from `deliveries.txt` and runs all three tasks (A, B, and C), printing formatted results to the console.

### 4. Run the Test Suite
```bash
npm test
```
or directly:
```bash
node dist/testTasks.js
```

This runs all required test cases for Tasks A, B, and C and reports PASS/FAIL for each.

---

## Input File Format

Delivery requests are stored in a plain text file with one delivery per line:

```
<delivery_id> <start_time> <finish_time>
```

- `delivery_id`: a string identifier (e.g., `D01`)
- `start_time`: an integer representing the start of the delivery interval
- `finish_time`: an integer representing the end of the delivery interval
- Lines starting with `#` are treated as comments and ignored
- Blank lines are ignored

**Example file (`deliveries.txt`):**

```
# Sample delivery data
D01 10 13
D02 2 5
D03 4 7
D04 1 8
D05 8 11
D06 11 14
D07 13 16
```

**Assumptions:**

- `start_time < finish_time` for every delivery.
- Times are non-negative integers.
- If one delivery finishes at time t and another starts at time t, the same driver may perform both (they are compatible).

---

## Program Organization

The project is organized in a modular structure within `src/`:

| File | Description |
| --- | --- |
| `src/delivery.ts` | `Delivery` class — data model for a delivery request, with compatibility checking |
| `src/minHeap.ts` | `MinHeap<T>` generic class — binary min-heap implementation for priority queue operations |
| `src/taskA.ts` | Task A algorithm — maximum deliveries for one driver (earliest finish time greedy) |
| `src/taskB.ts` | Task B algorithm — minimum number of drivers using `MinHeap` |
| `src/taskC.ts` | Task C algorithm — minimum rejections (reduces to Task A) |
| `src/fileIO.ts` | File reading and output formatting utilities |
| `src/main.ts` | Main CLI entry point — reads a data file and runs all tasks |
| `src/testTasks.ts` | Test suite — all required test cases for Tasks A, B, and C |
| `deliveries.txt` | Sample data file |
| `tsconfig.json` | TypeScript compiler configuration (strict mode, CommonJS, ES2020) |
| `package.json` | Project configuration and npm scripts (`build`, `start`, `test`) |

---

## Task A: Maximum Deliveries for One Driver

### 1. What is the greedy choice made by your algorithm?
My algorithm picks the delivery that finishes earliest.
To do this, I first sort all the deliveries by finish time from earliest to latest. I pick the very first one, and then scan through the rest. Whenever a delivery starts at or after the previous one finishes, I add it to the driver's schedule.

### 2. Why does this greedy strategy produce an optimal solution?
By choosing the delivery that ends as early as possible, we free up the driver as quickly as possible. This leaves the largest possible chunk of time remaining in the day to fit in more deliveries later on. Picking any other delivery would only tie up the driver until the same time or even later, which could never help us fit more deliveries.

### 3. What is the running time of your algorithm?
- Sorting: Sorting the n deliveries by finish time takes O(n log n) time.
- Scanning: Walking through the sorted list once takes O(n) time.
- Total Running Time: O(n log n).

---

## Task B: Minimum Number of Drivers

### 1. What information is stored in the priority queue?
The priority queue (min-heap) tracks all active drivers by when they will finish their current assignment:
- `availableTime`: The time this driver becomes free to pick up another delivery.
- `driverNumber`: The ID number for this driver (Driver 1, Driver 2, etc.).

By using a min-heap, the driver who finishes earliest is always sitting at the top, so we can check their availability immediately(O(1)).

### 2. How is a driver selected for each new delivery?
1. I sort all deliveries by start time so we process them in chronological order.
2. For each delivery, I look at the driver at the top of the heap (the one who gets free earliest):
   - If that driver is already free (their finish time is less than delivery's start time): I assign the delivery to them and update their new finish time in the heap.
   - If even that driver is still busy: Then all existing drivers are occupied right now. I assign a new driver, give them the delivery, and add them to the heap.

### 3. Why does this algorithm use the minimum possible number of drivers?
The algorithm only brings in a new driver when it has no free driver.

Whenever we are forced to add driver number d, it means all d - 1 drivers are currently busy with a delivery that overlaps with the new one. Since one driver cannot do two overlapping deliveries, you physically need at least d distinct drivers to cover those d simultaneous deliveries. Because the algorithm never hires more drivers than the peak number of overlapping deliveries, the total number of drivers used is provably minimal.

### 4. What is the running time?
- Sorting: Sorting the n deliveries by start time takes O(n log n).
- Heap operations: For each of the n deliveries, we perform at most one `pop` and one `push`. With at most n drivers in the heap, each heap operation takes  O(log n). Over all n deliveries takes O(n log n).
- Total Running Time: O(n log n).

---

## Task C: Minimum Deliveries to Reject

### 1. How is this problem related to Task A?
Task C is just the flip side of Task A:
- Task A: "What is the largest number of deliveries one driver can complete?" (let's say this is k).
- Task C: "What is the fewest deliveries we have to cancel so the driver has no conflicts?"

To cancel the fewest deliveries, we just want to keep the largest possible number of compatible deliveries. So, we solve Task A to find the best k deliveries to keep, and we reject all the others.

### 2. If the maximum number of compatible deliveries is k, how many deliveries must be rejected?
If there are n total requests and the driver can do at most k of them, we must reject exactly n - k deliveries. 

### 3. What is the running time of your algorithm?
- Task A algorithm takes O(n log n) time.
- Then it subtracts the count from the total (n - k), which takes an instant O(1) calculation.
- Total Running Time:** O(n log n).

---

## Task D: When a Greedy Choice Fails

Proposed Greedy Strategy G:
Sort deliveries by profit from highest to lowest. For each delivery, schedule it in the earliest empty time slot at or after its ready time.

### 1. Counterexample Data
Here is a counterexample with 3 deliveries where this greedy strategy fails to find the best schedule:

| Delivery | Ready Time (Rj) | Profit (Pj) |
| D1       | 0               | 10          |
| D2       | 0               | 9           |
| D3       | 1               | 8           |


### 2. Schedule Produced by Greedy Strategy G and Computation of V(G)
The greedy strategy looks at highest profit first: D1 (P=10) to D2 (P=9) to D3 (P=8)

1. D1 (Profit 10, ready at 0):
   - Earliest empty slot > 0 is slot 0.
   - Delay: 0 - 0 = 0.
   - Value: 10/(1 + 0) = 10

2. D2 (Profit 9, ready at 0):
   - Slot 0 is taken, so it takes slot 1.
   - Delay: 1 - 0 = 1.
   - Value: 9/(1 + 1) = 4.5

3. D3 (Profit 8, ready at 1):
   - Slot 1 is taken by D2, so D3 is pushed to slot 2.
   - Delay: 2 - 1 = 1.
   - Value: 8/(1 + 1) = 4

Total Greedy Value:
V(G) = 10.0 + 4.5 + 4.0 = 18.5

### 3. A Better Schedule S and Computation of V(S)
Now, let's see what happens if we don't follow the greedy heuristic and give slot 1 to D3 instead:

- D1 takes slot 0: Delay = 0 - 0 = 0 
  10/(1 + 0) = 10
- D3 takes slot 1: Delay = 1 - 1 = 0 
  8/(1 + 0) = 8
- D2 takes slot 2: Delay = 2 - 0 = 2 
  9/(1 + 2) = 3

Total Value of Schedule S:
V(S) = 10.0 + 8.0 + 3.0 = 21.0

### 4. Why this proves G is not always optimal
The greedy strategy was too short-sighted. It rushed to give slot 1 to D2 simply because D2's profit (9) was slightly higher than D3's (8). But by hogging slot 1, it forced D3 into slot 2, delaying D3 and cutting its value in half (from 8 down to 4).

If we instead let D3 take slot 1 right when it's ready, we get D3's full 8 points. Delaying D2 to slot 2 only drops D2 from 4.5 down to 3.0 (a small loss of 1.5). Overall, giving slot 1 to D3 leads to a much better outcome. 

Because the value formula divides profit by delay, looking purely at profit ignores how heavily future jobs get penalized when earlier slots are taken.

---

## Test Results

### Task A: Maximum Deliveries for One Driver

| Test | Delivery Intervals | Expected | Result |
| --- | --- | --- | --- |
| 1 | No deliveries | 0 | ✓ 0 |
| 2 | (1,3) | 1 | ✓ 1 |
| 3 | (1,3), (3,5), (5,7) | 3 | ✓ 3 |
| 4 | (1,5), (2,6), (3,7) | 1 | ✓ 1 |
| 5 | (5,7), (1,3), (3,5), (2,4) | 3 | ✓ 3 |
| 6 | (1,4), (2,4), (4,6) | 2 | ✓ 2 |

### Task B: Minimum Number of Drivers

| Test | Delivery Intervals | Expected | Result |
| --- | --- | --- | --- |
| 1 | No deliveries | 0 | ✓ 0 |
| 2 | (1,3) | 1 | ✓ 1 |
| 3 | (1,3), (3,5), (5,7) | 1 | ✓ 1 |
| 4 | (1,5), (2,6), (3,7) | 3 | ✓ 3 |
| 5 | (1,4), (2,5), (4,7), (5,8) | 2 | ✓ 2 |
| 6 | (5,8), (1,4), (2,5), (4,6), (6,9) | 2 | ✓ 2 |

### Task C: Minimum Deliveries to Reject

| Test | Delivery Intervals | Expected | Result |
| --- | --- | --- | --- |
| 1 | No deliveries | 0 | ✓ 0 |
| 2 | (1,3) | 0 | ✓ 0 |
| 3 | (1,3), (3,5), (5,7) | 0 | ✓ 0 |
| 4 | (1,5), (2,6), (3,7) | 2 | ✓ 2 |
| 5 | (5,7), (1,3), (3,5), (2,4) | 1 | ✓ 1 |
| 6 | (1,2), (2,3), (3,4), (1,3) | 1 | ✓ 1 |
