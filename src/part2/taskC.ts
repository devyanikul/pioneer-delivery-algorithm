// Deterministic selection using Median-of-Medians pivot
// Guarantees O(n) worst-case time by splitting into groups of 5 and doing 3-way partition

function quickSelectMoM(nums: number[], k: number): number {
  // Base case: small array, just sort and grab the kth element
  if (nums.length <= 5) {
    nums.sort((a, b) => a - b);
    return nums[k - 1];
  }

  // Divide into groups of 5, sort each group, and pull out the median
  const medians: number[] = [];
  for (let i = 0; i < nums.length; i += 5) {
    const chunk = nums.slice(i, Math.min(i + 5, nums.length));
    chunk.sort((a, b) => a - b);
    medians.push(chunk[Math.floor(chunk.length / 2)]);
  }

  // Recursively find the median of the medians
  const pivot = quickSelectMoM(medians, Math.ceil(medians.length / 2));

  // 3-way partition: less, equal, greater (needed for handling duplicates properly)
  const smaller: number[] = [];
  const equal: number[] = [];
  const larger: number[] = [];

  for (const val of nums) {
    if (val < pivot) {
      smaller.push(val);
    } else if (val === pivot) {
      equal.push(val);
    } else {
      larger.push(val);
    }
  }

  // Check which bucket contains the kth item
  if (k <= smaller.length) {
    return quickSelectMoM(smaller, k);
  } else if (k <= smaller.length + equal.length) {
    // Falls right in the equal partition, so it's the pivot
    return pivot;
  } else {
    // Falls in larger, adjust k by removing smaller and equal counts
    const newK = k - smaller.length - equal.length;
    return quickSelectMoM(larger, newK);
  }
}

export function medianOfMediansSelect(arr: number[], k: number): number {
  if (k < 1 || k > arr.length) {
    throw new Error(`k=${k} is out of bounds for array of size ${arr.length}`);
  }
  // Work on a copy so we don't mutate input array
  return quickSelectMoM([...arr], k);
}
