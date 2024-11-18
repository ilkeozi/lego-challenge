export class NestedBoxEvent {
  constructor(
    public readonly id: number,
    public readonly parentBoxId: number,
    public readonly childBoxId: number,
    public readonly amount: number,
  ) {}
}
