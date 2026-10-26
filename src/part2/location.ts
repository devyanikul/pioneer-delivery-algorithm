export class Location {
  constructor(
    public id: string,
    public x: number,
    public y: number
  ) {}
}

// Keep it as squared distance so we don't deal with square root / float precision
export function squaredDist(p1: Location, p2: Location): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return dx * dx + dy * dy;
}
