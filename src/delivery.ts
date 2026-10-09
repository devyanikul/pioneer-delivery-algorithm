// Represents a single delivery interval request with an ID, start time, and finish time
export class Delivery {
  readonly deliveryId: string;
  readonly startTime: number;
  readonly finishTime: number;

  constructor(deliveryId: string, startTime: number, finishTime: number) {
    if (startTime >= finishTime) {
      throw new Error(
        `Invalid delivery ${deliveryId}: startTime (${startTime}) must be strictly less than finishTime (${finishTime}).`
      );
    }
    this.deliveryId = deliveryId;
    this.startTime = startTime;
    this.finishTime = finishTime;
  }

  // Returns true if this delivery does not overlap with the other delivery.
  // Per assignment rules, if one finishes at time t and the other starts at time t, they are compatible.
  isCompatible(other: Delivery): boolean {
    return (
      this.finishTime <= other.startTime || other.finishTime <= this.startTime
    );
  }

  toString(): string {
    return `${this.deliveryId} [${this.startTime}, ${this.finishTime})`;
  }
}

