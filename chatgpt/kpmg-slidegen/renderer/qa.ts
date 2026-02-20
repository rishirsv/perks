export interface RepairSuggestion {
  slideIndex?: number;
  slideType?: string;
  slot?: string | null;
  severity?: 'error' | 'warning' | 'info';
  issueCode?: string;
  hook: string;
  suggestedRemedy: string;
}

export function suggestRemedy(kind: string, code?: string): Pick<RepairSuggestion, 'hook' | 'suggestedRemedy'> {
  if (kind === 'chart') {
    return {
      hook: 'insertPlaceholderChartCaption',
      suggestedRemedy: 'Insert placeholder chart caption and add at least one chart data series.',
    };
  }
  if (kind === 'table') {
    return {
      hook: 'addTableRows',
      suggestedRemedy: 'Add table headers and rows; if content is large, split across two slides.',
    };
  }
  if (kind === 'kpiArray') {
    return {
      hook: 'addKpiItems',
      suggestedRemedy: 'Add KPI cards with value and label text.',
    };
  }
  if (kind === 'contentsSections') {
    return {
      hook: 'addContentsSections',
      suggestedRemedy: 'Add section number, title, page range, and items for each contents block.',
    };
  }
  if (kind === 'columns') {
    return {
      hook: 'addColumns',
      suggestedRemedy: 'Add text to each column; keep each column balanced for readability.',
    };
  }
  if (code === 'below_min_chars') {
    return {
      hook: 'addBullets',
      suggestedRemedy: 'Add bullets or paragraph text to reach the minimum content density.',
    };
  }
  return {
    hook: 'addBullets',
    suggestedRemedy: 'Add bullets and supporting text to this slot.',
  };
}

export function buildOverflowSuggestions(
  overflowEvents: Array<Record<string, unknown>> = [],
): RepairSuggestion[] {
  return overflowEvents
    .filter((event) => Number(event?.splitInto || 0) > 1)
    .map((event) => ({
      slideType: String(event.slideType || ''),
      slot: null,
      severity: 'info',
      issueCode: 'auto_split',
      hook: 'splitSlide',
      suggestedRemedy: `Slide was auto-split into ${event.splitInto} pages; keep as split or tighten bullet text.`,
    }));
}

export function dedupeRepairSuggestions(items: RepairSuggestion[] = []): RepairSuggestion[] {
  const seen = new Set<string>();
  const out: RepairSuggestion[] = [];
  for (const item of items) {
    const key = `${item.slideIndex ?? ''}|${item.slideType ?? ''}|${item.slot ?? ''}|${item.hook}|${item.suggestedRemedy}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}
