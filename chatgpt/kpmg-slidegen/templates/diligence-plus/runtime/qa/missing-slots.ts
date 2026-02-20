export interface MissingSlot {
  slideIndex: number;
  slideType: string;
  slot: string;
}

export function findMissingSlots(): MissingSlot[] {
  throw new Error('templates/diligence-plus/runtime/qa/missing-slots.ts is scaffold-only.');
}
