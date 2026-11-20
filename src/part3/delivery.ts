// Data models for Part III dynamic programming tasks

// Task A: Delivery request with time window and profit
export class WeightedDelivery {
  constructor(
    public id: string,
    public start: number,
    public finish: number,
    public profit: number
  ) {}
}

// Task B: Delivery request with fuel cost and profit
export class FuelDelivery {
  constructor(
    public id: string,
    public fuelCost: number,
    public profit: number
  ) {}
}
