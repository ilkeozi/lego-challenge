export class LegoBoxEvent {
  constructor(
    public readonly id: number,
    public readonly name?: string,
    public readonly totalPrice?: number,
  ) {}
}
