export const DENSITY_STATUS = {
  ok: 'OK',
  thin: 'thin but acceptable',
  sparse: 'too sparse, should be repaired or flagged',
} as const;

export type DensityStatus =
  | typeof DENSITY_STATUS.ok
  | typeof DENSITY_STATUS.thin
  | typeof DENSITY_STATUS.sparse;

export type SlotPriority = 'high' | 'medium' | 'low';

export interface SlotMetric {
  slot: string;
  kind: string;
  actual: number;
  target: number;
  priority?: SlotPriority;
}

export interface DensityTarget {
  minScore?: number;
  acceptableFloor?: number;
}

export interface DensityResult {
  minScore: number;
  score: number;
  acceptableFloor: number;
  status: DensityStatus;
  thin: boolean;
  tooSparse: boolean;
  shouldRepair: boolean;
}

export function classifyDensity(score: number, minScore: number, acceptableFloor: number): DensityStatus {
  if (score >= minScore) return DENSITY_STATUS.ok;
  if (score >= acceptableFloor) return DENSITY_STATUS.thin;
  return DENSITY_STATUS.sparse;
}

export function computeDensity(
  slotMetrics: SlotMetric[],
  densityTarget: DensityTarget = {},
): DensityResult {
  const minScore = Number(densityTarget.minScore || 0);
  if (minScore <= 0) {
    return {
      minScore,
      score: 1,
      acceptableFloor: 1,
      status: DENSITY_STATUS.ok,
      thin: false,
      tooSparse: false,
      shouldRepair: false,
    };
  }

  let weightedActual = 0;
  let weightedTarget = 0;
  for (const metric of slotMetrics || []) {
    const target = Number(metric?.target || 0);
    if (target <= 0) continue;

    const priority = metric?.priority || 'medium';
    const weight = priority === 'high' ? 1 : priority === 'low' ? 0.35 : 0.65;
    weightedTarget += target * weight;
    weightedActual += Math.min(target, Number(metric?.actual || 0)) * weight;
  }

  const score = weightedTarget > 0 ? weightedActual / weightedTarget : 1;
  const acceptableFloor = Number(
    densityTarget.acceptableFloor || Math.max(0.45, Number((minScore * 0.85).toFixed(3))),
  );
  const status = classifyDensity(score, minScore, acceptableFloor);
  return {
    minScore,
    score,
    acceptableFloor,
    status,
    thin: status !== DENSITY_STATUS.ok,
    tooSparse: status === DENSITY_STATUS.sparse,
    shouldRepair: status === DENSITY_STATUS.sparse,
  };
}
