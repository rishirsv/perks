import { computeDensity, DENSITY_STATUS, type DensityResult, type SlotMetric } from './density';
import { dedupeRepairSuggestions, suggestRemedy, type RepairSuggestion } from './qa';

export type SlotKind =
  | 'text'
  | 'textArray'
  | 'stringArray'
  | 'kpiArray'
  | 'columns'
  | 'contentsSections'
  | 'table'
  | 'chart';

export interface SlotDefinition {
  kind: SlotKind;
  required?: boolean;
  minItems?: number;
  minChars?: number;
  maxChars?: number;
  maxLength?: number;
  allowEmpty?: boolean;
  pattern?: string;
  renderingHints?: {
    priority?: 'high' | 'medium' | 'low';
    mode?: string;
    keepTogether?: boolean;
  };
}

export interface LayoutDefinition {
  slots?: Record<string, SlotDefinition>;
  densityTarget?: {
    minScore?: number;
    acceptableFloor?: number;
  };
}

export interface TemplatePackage {
  layouts?: {
    types?: Record<string, LayoutDefinition>;
  };
}

export interface SlotIssue {
  slot: string;
  kind: string;
  code: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  actual?: number | null;
  target?: number | null;
  hook: string;
  suggestedRemedy: string;
}

export interface SlideValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  qa: {
    missingSlots: string[];
    slotIssues: SlotIssue[];
    slotMetrics: SlotMetric[];
    density: DensityResult;
    repairSuggestions: RepairSuggestion[];
  };
}

export interface DeckValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  qa: {
    densityFindings: Array<{
      slideIndex: number;
      slideType: string;
      status: string;
      score: number;
      minScore: number;
      acceptableFloor: number;
      shouldRepair: boolean;
    }>;
    thinSlides: Array<Record<string, unknown>>;
    sparseSlides: Array<Record<string, unknown>>;
    missingSlots: Array<{ slideIndex: number; slideType: string; slot: string }>;
    slotIssues: Array<SlotIssue & { slideIndex: number; slideType: string }>;
    slotMetrics: Array<SlotMetric & { slideIndex: number; slideType: string }>;
    repairSuggestions: RepairSuggestion[];
  };
}

export interface ValidateOptions {
  allowSparse?: boolean;
  enforceDensity?: boolean;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function extractText(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (isPlainObject(value) && typeof value.text === 'string') return value.text.trim();
  return '';
}

function isMissingValue(value: unknown, def: SlotDefinition): boolean {
  if (value === null || value === undefined) return true;
  if (def.kind === 'text') return extractText(value).length === 0;
  if (def.kind === 'textArray' || def.kind === 'stringArray' || def.kind === 'kpiArray' || def.kind === 'columns' || def.kind === 'contentsSections') {
    return !Array.isArray(value) || value.length === 0;
  }
  if (def.kind === 'table') {
    return !isPlainObject(value) || !Array.isArray((value as Record<string, unknown>).rows) || (value as Record<string, unknown>).rows.length === 0;
  }
  if (def.kind === 'chart') {
    return !isPlainObject(value) || !Array.isArray((value as Record<string, unknown>).data) || (value as Record<string, unknown>).data.length === 0;
  }
  return false;
}

function countChars(value: unknown): number {
  if (typeof value === 'string') return value.trim().length;
  if (Array.isArray(value)) return value.map((item) => extractText(item)).join(' ').trim().length;
  if (isPlainObject(value)) return JSON.stringify(value).length;
  return 0;
}

function getQuantity(def: SlotDefinition, value: unknown): number {
  if (def.kind === 'text') return extractText(value).length;
  if (def.kind === 'textArray' || def.kind === 'stringArray' || def.kind === 'kpiArray' || def.kind === 'columns' || def.kind === 'contentsSections') {
    return Array.isArray(value) ? value.length : 0;
  }
  if (def.kind === 'table') {
    return isPlainObject(value) && Array.isArray(value.rows) ? value.rows.length : 0;
  }
  if (def.kind === 'chart') {
    return isPlainObject(value) && Array.isArray(value.data) ? value.data.length : 0;
  }
  return 0;
}

function isCharDriven(def: SlotDefinition): boolean {
  return def.kind === 'text' || def.kind === 'textArray' || def.kind === 'stringArray';
}

function buildIssue(
  slot: string,
  kind: string,
  code: string,
  message: string,
  severity: 'error' | 'warning',
  extra: { actual?: number; target?: number } = {},
): SlotIssue {
  const remedy = suggestRemedy(kind, code);
  return {
    slot,
    kind,
    code,
    message,
    severity,
    actual: extra.actual ?? null,
    target: extra.target ?? null,
    hook: remedy.hook,
    suggestedRemedy: remedy.suggestedRemedy,
  };
}

function validateSlot(
  slotName: string,
  def: SlotDefinition,
  value: unknown,
  options: { hasValue: boolean; allowSparse: boolean; enforceDensity: boolean },
): {
  errors: string[];
  warnings: string[];
  missingRequired: boolean;
  quantity: number;
  charCount: number;
  issues: SlotIssue[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const issues: SlotIssue[] = [];
  const missing = isMissingValue(value, def);
  const shouldWarnOnly = options.allowSparse || def?.renderingHints?.priority === 'low';

  if (def.required && missing) {
    const message = `Missing required: ${slotName}`;
    errors.push(message);
    issues.push(buildIssue(slotName, def.kind, 'missing_required', message, 'error'));
    return { errors, warnings, missingRequired: true, quantity: 0, charCount: 0, issues };
  }

  if (missing) {
    if (options.hasValue && def.allowEmpty === false) {
      const message = `Slot "${slotName}" may not be empty`;
      const severity = shouldWarnOnly ? 'warning' : 'error';
      (severity === 'warning' ? warnings : errors).push(message);
      issues.push(buildIssue(slotName, def.kind, 'empty_not_allowed', message, severity));
    }
    return { errors, warnings, missingRequired: false, quantity: 0, charCount: 0, issues };
  }

  if (def.kind === 'text' && typeof value !== 'string') {
    errors.push(`${slotName} must be a string`);
    issues.push(buildIssue(slotName, def.kind, 'type_mismatch', `${slotName} must be a string`, 'error'));
  }
  if ((def.kind === 'textArray' || def.kind === 'stringArray' || def.kind === 'kpiArray' || def.kind === 'columns' || def.kind === 'contentsSections') && !Array.isArray(value)) {
    errors.push(`${slotName} must be an array`);
    issues.push(buildIssue(slotName, def.kind, 'type_mismatch', `${slotName} must be an array`, 'error'));
  }
  if (def.kind === 'table' && !isPlainObject(value)) {
    errors.push(`${slotName} must be an object`);
    issues.push(buildIssue(slotName, def.kind, 'type_mismatch', `${slotName} must be an object`, 'error'));
  }
  if (def.kind === 'chart' && !isPlainObject(value)) {
    errors.push(`${slotName} must be an object`);
    issues.push(buildIssue(slotName, def.kind, 'type_mismatch', `${slotName} must be an object`, 'error'));
  }

  const quantity = getQuantity(def, value);
  const charCount = countChars(value);

  if (options.enforceDensity && def.minItems && quantity < def.minItems) {
    const message = `${slotName} requires at least ${def.minItems} item(s)`;
    const severity = shouldWarnOnly ? 'warning' : 'error';
    (severity === 'warning' ? warnings : errors).push(message);
    issues.push(buildIssue(slotName, def.kind, 'below_min_items', message, severity, { actual: quantity, target: def.minItems }));
  }

  if (options.enforceDensity && def.minChars && charCount < def.minChars) {
    const message = `${slotName} below minChars (${def.minChars})`;
    const severity = shouldWarnOnly ? 'warning' : 'error';
    (severity === 'warning' ? warnings : errors).push(message);
    issues.push(buildIssue(slotName, def.kind, 'below_min_chars', message, severity, { actual: charCount, target: def.minChars }));
  }

  if (typeof value === 'string') {
    const maxChars = def.maxChars || def.maxLength;
    if (maxChars && value.length > maxChars) {
      warnings.push(`${slotName} exceeds maxChars (${maxChars}), may shrink to fit`);
    }
    if (def.pattern && !(new RegExp(def.pattern).test(value))) {
      errors.push(`${slotName} doesn't match pattern: ${def.pattern}`);
      issues.push(buildIssue(slotName, def.kind, 'pattern_mismatch', `${slotName} doesn't match pattern: ${def.pattern}`, 'error'));
    }
  }

  return { errors, warnings, missingRequired: false, quantity, charCount, issues };
}

export function validateSlideContent(
  slideType: string,
  content: Record<string, unknown>,
  layout: LayoutDefinition,
  options: ValidateOptions = {},
): SlideValidationResult {
  const allowSparse = Boolean(options.allowSparse);
  const enforceDensity = options.enforceDensity !== false;
  const errors: string[] = [];
  const warnings: string[] = [];
  const missingSlots: string[] = [];
  const slotIssues: SlotIssue[] = [];
  const slotMetrics: SlotMetric[] = [];

  const slots = layout?.slots || {};
  for (const [slotName, def] of Object.entries(slots)) {
    const hasValue = Object.prototype.hasOwnProperty.call(content || {}, slotName);
    const value = content?.[slotName];
    const res = validateSlot(slotName, def, value, { hasValue, allowSparse, enforceDensity });
    errors.push(...res.errors);
    warnings.push(...res.warnings);
    slotIssues.push(...res.issues);
    if (res.missingRequired) missingSlots.push(slotName);

    const target = isCharDriven(def) ? Number(def.minChars || 0) : Number(def.minItems || 0);
    const actual = isCharDriven(def) ? res.charCount : res.quantity;
    const includeInDensity = Boolean(def.required || hasValue);
    slotMetrics.push({
      slot: slotName,
      kind: def.kind,
      actual,
      target: includeInDensity ? target : 0,
      priority: def?.renderingHints?.priority || 'medium',
    });
  }

  const density = computeDensity(slotMetrics, layout?.densityTarget || {});
  if (enforceDensity && density.status === DENSITY_STATUS.sparse) {
    const message = `Slide content ${DENSITY_STATUS.sparse} (density ${density.score.toFixed(2)} < ${density.acceptableFloor.toFixed(2)})`;
    (allowSparse ? warnings : errors).push(message);
    slotIssues.push(
      buildIssue('_slide', 'textArray', 'density_too_sparse', message, allowSparse ? 'warning' : 'error', {
        actual: Number(density.score.toFixed(3)),
        target: density.minScore,
      }),
    );
  } else if (enforceDensity && density.status === DENSITY_STATUS.thin) {
    warnings.push(`Slide content ${DENSITY_STATUS.thin} (density ${density.score.toFixed(2)} < ${density.minScore.toFixed(2)})`);
  }

  const repairSuggestions = dedupeRepairSuggestions(
    slotIssues.map((issue) => ({
      slot: issue.slot,
      severity: issue.severity,
      issueCode: issue.code,
      hook: issue.hook,
      suggestedRemedy: issue.suggestedRemedy,
    })),
  );

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    qa: {
      missingSlots,
      slotIssues,
      slotMetrics,
      density,
      repairSuggestions,
    },
  };
}

export function validateDeckSpec(
  deckSpec: unknown,
  templatePackage: TemplatePackage,
  options: ValidateOptions = {},
): DeckValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const densityFindings: DeckValidationResult['qa']['densityFindings'] = [];
  const thinSlides: Array<Record<string, unknown>> = [];
  const sparseSlides: Array<Record<string, unknown>> = [];
  const missingSlots: Array<{ slideIndex: number; slideType: string; slot: string }> = [];
  const slotIssues: Array<SlotIssue & { slideIndex: number; slideType: string }> = [];
  const slotMetrics: Array<SlotMetric & { slideIndex: number; slideType: string }> = [];
  const repairSuggestions: RepairSuggestion[] = [];
  const allowSparse = Boolean(options.allowSparse);

  if (!isPlainObject(deckSpec)) {
    return {
      valid: false,
      errors: ['Deck spec must be an object'],
      warnings: [],
      qa: { densityFindings, thinSlides, sparseSlides, missingSlots, slotIssues, slotMetrics, repairSuggestions },
    };
  }
  if (!Array.isArray(deckSpec.slides)) {
    return {
      valid: false,
      errors: ['Deck spec missing `slides` array'],
      warnings: [],
      qa: { densityFindings, thinSlides, sparseSlides, missingSlots, slotIssues, slotMetrics, repairSuggestions },
    };
  }

  deckSpec.slides.forEach((slide: unknown, slideIndex: number) => {
    if (!isPlainObject(slide)) {
      errors.push(`slides[${slideIndex}] must be an object`);
      return;
    }
    if (typeof slide.type !== 'string' || !slide.type) {
      errors.push(`slides[${slideIndex}] missing string 'type'`);
      return;
    }

    const layout = templatePackage?.layouts?.types?.[slide.type];
    if (!layout) {
      errors.push(`slides[${slideIndex}]: Unknown type: ${slide.type}`);
      return;
    }

    const result = validateSlideContent(slide.type, slide, layout, {
      allowSparse,
      enforceDensity: options.enforceDensity !== false,
    });
    if (!result.valid) errors.push(...result.errors.map((msg) => `slides[${slideIndex}]: ${msg}`));
    warnings.push(...result.warnings.map((msg) => `slides[${slideIndex}]: ${msg}`));

    for (const slot of result.qa.missingSlots) {
      missingSlots.push({ slideIndex, slideType: slide.type, slot });
    }
    for (const issue of result.qa.slotIssues) {
      slotIssues.push({ ...issue, slideIndex, slideType: slide.type });
    }
    for (const metric of result.qa.slotMetrics) {
      slotMetrics.push({
        slideIndex,
        slideType: slide.type,
        slot: metric.slot,
        kind: metric.kind,
        actual: Number(metric.actual || 0),
        target: Number(metric.target || 0),
        priority: metric.priority || 'medium',
      });
    }
    for (const suggestion of result.qa.repairSuggestions) {
      repairSuggestions.push({ ...suggestion, slideIndex, slideType: slide.type });
    }

    const densityFinding = {
      slideIndex,
      slideType: slide.type,
      status: result.qa.density.status,
      score: Number(result.qa.density.score.toFixed(3)),
      minScore: result.qa.density.minScore,
      acceptableFloor: result.qa.density.acceptableFloor,
      shouldRepair: result.qa.density.shouldRepair,
    };
    densityFindings.push(densityFinding);
    if (densityFinding.status === DENSITY_STATUS.thin) thinSlides.push(densityFinding);
    if (densityFinding.status === DENSITY_STATUS.sparse) sparseSlides.push(densityFinding);
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    qa: {
      densityFindings,
      thinSlides,
      sparseSlides,
      missingSlots,
      slotIssues,
      slotMetrics,
      repairSuggestions: dedupeRepairSuggestions(repairSuggestions),
    },
  };
}
