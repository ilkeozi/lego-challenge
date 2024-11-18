export class LegoBoxPieceEvent {
  constructor(
    public readonly boxId: number,
    public readonly pieceId: number,
    public readonly amount?: number,
  ) {}
}
