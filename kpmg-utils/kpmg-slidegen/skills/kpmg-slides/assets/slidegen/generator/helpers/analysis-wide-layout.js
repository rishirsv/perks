import {
  clampToMasterFooter,
  computeStrapShift,
  footerSafeTopForMaster,
  resolveLayoutMetrics,
  shiftBox,
} from './layout.js';
import { resolveCalloutLayout } from './callouts.js';

function requireBox(box, slideType, key) {
  const ok =
    box &&
    Number.isFinite(box.x) &&
    Number.isFinite(box.y) &&
    Number.isFinite(box.w) &&
    Number.isFinite(box.h);
  if (ok) return box;
  throw new Error(`Missing required geometry "${key}" for slide type "${slideType}"`);
}

export function computeAnalysisWideChart2ColsTextGeometry({
  geometry,
  masterName = 'KPMG_WHITE',
  footerSafeTopByMaster = null,
  theme = null,
  strapline,
  chart = null,
  callouts = [],
} = {}) {
  const g = geometry || {};
  const layoutMetrics = resolveLayoutMetrics(theme);
  const strapText = strapline;
  const straplineBox = strapText && (g.straplineBox || g.strapline)
    ? (g.straplineBox || g.strapline)
    : null;

  const leftBase = requireBox(g.textBox || g.leftText, 'analysisWideChart2ColsText', 'textBox');
  const rightBase = requireBox(g.chartBox || g.rightChart, 'analysisWideChart2ColsText', 'chartBox');
  const yShift = computeStrapShift(straplineBox, Math.min(leftBase.y, rightBase.y), layoutMetrics.strapGap);
  const textBox = shiftBox(leftBase, yShift);
  const chartBox = shiftBox(rightBase, yShift);
  const safeTextBoxBase = clampToMasterFooter(textBox, masterName, 0, footerSafeTopByMaster);
  const calloutLayout = resolveCalloutLayout({
    slideType: 'analysisWideChart2ColsText',
    callouts,
    textBox: safeTextBoxBase,
    preferredBoxes: g.calloutBoxes,
  });
  const safeTextBox = calloutLayout.adjustedTextBox || safeTextBoxBase;
  const sourcePad = chart?.source ? 0.3 : 0;
  const safeChartBox = clampToMasterFooter(chartBox, masterName, sourcePad, footerSafeTopByMaster);

  return {
    geometry: g,
    strapText,
    straplineBox,
    callouts: calloutLayout.callouts,
    calloutBoxes: calloutLayout.calloutBoxes,
    safeTextBox,
    safeChartBox,
  };
}

export function computeAnalysisWideChartTableTextGeometry({
  geometry,
  masterName = 'KPMG_WHITE',
  footerSafeTopByMaster = null,
  theme = null,
  strapline,
  chart,
  table,
  noteSource,
  showSummaryChart = false,
  callouts = [],
} = {}) {
  const g = geometry || {};
  const layoutMetrics = resolveLayoutMetrics(theme);
  const strapText = strapline;
  const straplineBox = g.straplineBox || g.strapline || g.bodyBoxes?.[0] || null;

  const topBase = requireBox(g.textBox || g.body || g.rightBody || g.bodyBoxes?.[2], 'analysisWideChartTableText', 'textBox');
  const yShift = computeStrapShift(straplineBox, topBase.y, layoutMetrics.strapGap);
  const hasChartData = Boolean(chart?.type && Array.isArray(chart?.data) && chart.data.length > 0);
  const hasTableData = Boolean(table?.headers && Array.isArray(table?.rows) && table.rows.length > 0);
  const shouldRenderChart = hasChartData;
  const chartBase = shouldRenderChart
    ? hasTableData
      ? showSummaryChart
        ? g.summaryChartBox || g.chartBox || g.summaryChart || g.chart || null
        : g.chartBox || g.chart || g.summaryChartBox || g.summaryChart || null
      : g.tableBox || g.table || g.chartBox || g.chart || g.summaryChartBox || g.summaryChart || null
    : null;
  const tableBase = g.tableBox || g.table || null;
  const headingBase = g.headingBox || g.heading || g.bodyBoxes?.[1] || null;
  const footerSafeTop = footerSafeTopForMaster(masterName, footerSafeTopByMaster);

  if (shouldRenderChart && !chartBase) {
    throw new Error('Missing required geometry "chartBox" for slide type "analysisWideChartTableText"');
  }
  if (hasTableData && !tableBase) {
    throw new Error('Missing required geometry "tableBox" for slide type "analysisWideChartTableText"');
  }

  let textBox = shiftBox(topBase, yShift);
  let chartBox = chartBase ? shiftBox(requireBox(chartBase, 'analysisWideChartTableText', 'chartBox'), yShift) : null;
  let tableBox = tableBase ? shiftBox(tableBase, yShift) : null;

  const headingBottom = headingBase ? headingBase.y + headingBase.h : null;
  const isLegacyBottomAnchoredLayout = Boolean(
    hasChartData &&
      hasTableData &&
      headingBottom !== null &&
      chartBox &&
      textBox &&
      tableBox &&
      chartBox.y + chartBox.h <= headingBottom + 0.05 &&
      textBox.y >= headingBottom + 1.3,
  );
  if (isLegacyBottomAnchoredLayout) {
    if (!Number.isFinite(footerSafeTop)) {
      throw new Error(`Missing required footer safe-top for master "${masterName}"`);
    }
    const contentTop = headingBottom + 0.06 + yShift;
    const contentBottom = footerSafeTop - (noteSource && g.note ? 0.22 : 0);
    const available = Math.max(2.8, contentBottom - contentTop);
    const upperH = Math.max(1.35, Math.min(2.0, available * 0.48));
    const lowerY = contentTop + upperH + 0.1;
    const lowerH = Math.max(1.2, available - upperH - 0.1);
    const leftX = tableBox?.x;
    const leftW = tableBox?.w;
    const rightX = textBox?.x;
    const rightW = textBox?.w;
    if (![leftX, leftW, rightX, rightW].every(Number.isFinite)) {
      throw new Error('Missing geometry for legacy bottom-anchored analysis-wide chart/table layout');
    }

    chartBox = { x: leftX, y: contentTop, w: leftW, h: upperH };
    textBox = { x: rightX, y: contentTop, w: rightW, h: upperH };
    tableBox = { x: leftX, y: lowerY, w: leftW, h: lowerH };
  }

  const safeTextBoxBase = clampToMasterFooter(textBox, masterName, 0, footerSafeTopByMaster);
  const sourcePad = chart?.source ? 0.3 : 0;
  const safeChartBox = chartBox ? clampToMasterFooter(chartBox, masterName, sourcePad, footerSafeTopByMaster) : null;
  const safeTableBox = tableBox ? clampToMasterFooter(tableBox, masterName, 0, footerSafeTopByMaster) : null;
  const calloutLayout = resolveCalloutLayout({
    slideType: 'analysisWideChartTableText',
    callouts,
    textBox: safeTextBoxBase,
    preferredBoxes: g.calloutBoxes,
    headingBox: headingBase,
  });
  const safeTextBox = calloutLayout.adjustedTextBox || safeTextBoxBase;

  return {
    geometry: g,
    strapText,
    straplineBox,
    headingBase,
    callouts: calloutLayout.callouts,
    calloutBoxes: calloutLayout.calloutBoxes,
    safeTextBox,
    safeChartBox,
    safeTableBox,
  };
}
