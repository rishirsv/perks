export interface OverflowEvent {
  slideIndex: number;
  slideType: string;
  slot?: string;
  splitInto?: number;
  note?: string;
}

export function detectOverflow(): OverflowEvent[] {
  throw new Error('templates/diligence-plus/runtime/qa/overflow.ts is scaffold-only.');
}
