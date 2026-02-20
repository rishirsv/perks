export interface DensityFinding {
  slideIndex: number;
  slideType: string;
  status: 'OK' | 'thin but acceptable' | 'too sparse, should be repaired or flagged';
  score: number;
  minScore: number;
  acceptableFloor: number;
  shouldRepair: boolean;
}

export function scoreDensity(): DensityFinding[] {
  throw new Error('templates/diligence-plus/runtime/qa/density.ts is scaffold-only.');
}
