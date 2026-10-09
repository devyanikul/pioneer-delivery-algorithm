/**
 * minHeap.ts
 *
 * Generic min-heap (priority queue) implementation.
 * Used by Task B to efficiently track the driver with the earliest available time.
 *
 * JavaScript/TypeScript does not have a built-in priority queue, so we
 * implement one from scratch using an array-backed binary heap.
 */

export class MinHeap<T> {
  private heap: T[];
  private comparator: (a: T, b: T) => number;

  /**
   * @param comparator  A function that returns a negative number if a < b,
   *                    zero if a === b, or a positive number if a > b.
   */
  constructor(comparator: (a: T, b: T) => number) {
    this.heap = [];
    this.comparator = comparator;
  }

  /** Returns the number of elements in the heap. */
  get size(): number {
    return this.heap.length;
  }

  /** Returns true if the heap is empty. */
  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  /** Returns the minimum element without removing it. */
  peek(): T | undefined {
    return this.heap[0];
  }

  /** Inserts a new element into the heap. O(log n). */
  push(value: T): void {
    this.heap.push(value);
    this.bubbleUp(this.heap.length - 1);
  }

  /** Removes and returns the minimum element. O(log n). */
  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;

    const min = this.heap[0];
    const last = this.heap.pop()!;

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }

    return min;
  }

  /** Restores the heap property by moving an element up. */
  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.comparator(this.heap[index], this.heap[parentIndex]) < 0) {
        [this.heap[index], this.heap[parentIndex]] = [
          this.heap[parentIndex],
          this.heap[index],
        ];
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  /** Restores the heap property by moving an element down. */
  private bubbleDown(index: number): void {
    const length = this.heap.length;

    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (
        left < length &&
        this.comparator(this.heap[left], this.heap[smallest]) < 0
      ) {
        smallest = left;
      }

      if (
        right < length &&
        this.comparator(this.heap[right], this.heap[smallest]) < 0
      ) {
        smallest = right;
      }

      if (smallest !== index) {
        [this.heap[index], this.heap[smallest]] = [
          this.heap[smallest],
          this.heap[index],
        ];
        index = smallest;
      } else {
        break;
      }
    }
  }
}

