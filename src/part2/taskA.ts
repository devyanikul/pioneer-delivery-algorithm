import { Location, squaredDist } from './location';

export interface ClosestPairResult {
  id1: string;
  id2: string;
  distSquared: number;
}

// Brute force base case for 3 or fewer points
function bruteForce(pts: Location[]): ClosestPairResult {
  let best: ClosestPairResult = {
    id1: pts[0].id,
    id2: pts[1].id,
    distSquared: squaredDist(pts[0], pts[1]),
  };

  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = squaredDist(pts[i], pts[j]);
      if (d < best.distSquared) {
        best = { id1: pts[i].id, id2: pts[j].id, distSquared: d };
      }
    }
  }
  return best;
}

function findClosest(
  ptsX: Location[],
  ptsY: Location[]
): ClosestPairResult {
  // If we have 3 or less, brute force is faster and avoids edge cases
  if (ptsX.length <= 3) {
    return bruteForce(ptsX);
  }

  const mid = Math.floor(ptsX.length / 2);
  const midPoint = ptsX[mid];

  // Using a set of IDs for the left half so we don't mess up when multiple
  // points share the exact same x coordinate
  const leftIdSet = new Set<string>();
  for (let i = 0; i < mid; i++) {
    leftIdSet.add(ptsX[i].id);
  }

  // Filter ptsY into left and right while preserving y-order in O(n)
  // (Assignment says we shouldn't re-sort y inside recursion)
  const leftY: Location[] = [];
  const rightY: Location[] = [];
  for (const p of ptsY) {
    if (leftIdSet.has(p.id)) {
      leftY.push(p);
    } else {
      rightY.push(p);
    }
  }

  const leftX = ptsX.slice(0, mid);
  const rightX = ptsX.slice(mid);

  const leftBest = findClosest(leftX, leftY);
  const rightBest = findClosest(rightX, rightY);

  let best = leftBest.distSquared <= rightBest.distSquared ? leftBest : rightBest;

  // Build the strip: points whose horizontal distance to dividing line is < sqrt(minDist)
  const strip: Location[] = [];
  for (const p of ptsY) {
    const dx = p.x - midPoint.x;
    if (dx * dx < best.distSquared) {
      strip.push(p);
    }
  }

  // Only need to check up to 7 subsequent points in y-order due to geometric packing
  for (let i = 0; i < strip.length; i++) {
    for (let j = i + 1; j < strip.length && j <= i + 7; j++) {
      const dy = strip[j].y - strip[i].y;
      if (dy * dy >= best.distSquared) {
        break; // y-gap is already too big, no subsequent point will be closer
      }

      const d = squaredDist(strip[i], strip[j]);
      if (d < best.distSquared) {
        best = { id1: strip[i].id, id2: strip[j].id, distSquared: d };
      }
    }
  }

  return best;
}

export function closestPair(locations: Location[]): ClosestPairResult {
  if (locations.length < 2) {
    throw new Error('At least 2 points are needed to find closest pair');
  }

  // Pre-sort once by x and once by y upfront — O(n log n)
  // Break ties consistently using y and id
  const sortedX = [...locations].sort((a, b) => {
    if (a.x !== b.x) return a.x - b.x;
    if (a.y !== b.y) return a.y - b.y;
    return a.id.localeCompare(b.id);
  });

  const sortedY = [...locations].sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    if (a.x !== b.x) return a.x - b.x;
    return a.id.localeCompare(b.id);
  });

  return findClosest(sortedX, sortedY);
}

// Naive O(n^2) check to compare results in tests
export function closestPairBruteForce(locations: Location[]): ClosestPairResult {
  if (locations.length < 2) {
    throw new Error('At least 2 points are needed');
  }
  return bruteForce(locations);
}
