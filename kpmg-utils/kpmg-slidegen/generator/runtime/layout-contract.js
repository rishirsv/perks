import { recordFallback, recordWarning } from './diagnostics.js';

function cloneBox(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
  const out = {};
  for (const [key, item] of Object.entries(value)) {
    if (Array.isArray(item)) {
      out[key] = item.map((entry) => cloneBox(entry));
      continue;
    }
    out[key] = cloneBox(item);
  }
  return out;
}

function isBox(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      Number.isFinite(value.x) &&
      Number.isFinite(value.y) &&
      Number.isFinite(value.w) &&
      Number.isFinite(value.h),
  );
}

function pickBottomRowPair(bodyBoxes = []) {
  const boxes = (Array.isArray(bodyBoxes) ? bodyBoxes : []).filter(isBox);
  if (boxes.length < 2) return { left: null, right: null };

  const byY = [...boxes].sort((a, b) => b.y - a.y || a.x - b.x);
  const targetY = byY[0].y;
  const sameRow = byY.filter((box) => Math.abs(box.y - targetY) <= 0.12);
  const row = (sameRow.length >= 2 ? sameRow : byY.slice(0, 2)).sort((a, b) => a.x - b.x);
  return { left: row[0] || null, right: row[1] || null };
}

function normalizeAnalysisWide2ColsGeometry(rawGeometry = {}, sharedGeometry = null) {
  const raw = cloneBox(rawGeometry) || {};
  const events = [];
  const { left: inferredLeft, right: inferredRight } = pickBottomRowPair(raw.bodyBoxes);
  const sharedTitle = isBox(sharedGeometry?.title) ? sharedGeometry.title : null;

  let title = null;
  if (isBox(raw.title)) title = raw.title;
  else if (isBox(sharedTitle)) {
    title = sharedTitle;
    events.push({ reason: 'mapped_shared_geometry', details: { from: 'shared.title', to: 'title' } });
  }

  let textBox = null;
  if (isBox(raw.textBox)) textBox = raw.textBox;
  else if (isBox(raw.leftText)) {
    textBox = raw.leftText;
    events.push({ reason: 'mapped_legacy_key', details: { from: 'leftText', to: 'textBox' } });
  } else if (isBox(raw.body)) {
    textBox = raw.body;
    events.push({ reason: 'mapped_legacy_key', details: { from: 'body', to: 'textBox' } });
  } else if (isBox(inferredLeft)) {
    textBox = inferredLeft;
    events.push({ reason: 'mapped_body_boxes', details: { to: 'textBox' } });
  }

  let chartBox = null;
  if (isBox(raw.chartBox)) chartBox = raw.chartBox;
  else if (isBox(raw.rightChart)) {
    chartBox = raw.rightChart;
    events.push({ reason: 'mapped_legacy_key', details: { from: 'rightChart', to: 'chartBox' } });
  } else if (isBox(inferredRight)) {
    chartBox = inferredRight;
    events.push({ reason: 'mapped_body_boxes', details: { to: 'chartBox' } });
  } else if (isBox(raw.chart)) {
    chartBox = raw.chart;
    events.push({ reason: 'mapped_legacy_key', details: { from: 'chart', to: 'chartBox' } });
  }

  const straplineBox =
    (isBox(raw.straplineBox) && raw.straplineBox) ||
    (isBox(raw.strapline) && raw.strapline) ||
    (isBox(raw.bodyBoxes?.[0]) ? raw.bodyBoxes[0] : null);
  if (!isBox(raw.straplineBox) && isBox(straplineBox)) {
    events.push({ reason: 'mapped_legacy_key', details: { from: 'strapline/bodyBoxes[0]', to: 'straplineBox' } });
  }

  const geometry = {
    ...raw,
    title,
    strapline: straplineBox || raw.strapline || null,
    textBox,
    chartBox,
    straplineBox,
    leftText: textBox || raw.leftText || null,
    rightChart: chartBox || raw.rightChart || null,
  };
  return { geometry, events };
}

function normalizeAnalysisWideChartTableGeometry(rawGeometry = {}, sharedGeometry = null) {
  const raw = cloneBox(rawGeometry) || {};
  const events = [];
  const sharedTitle = isBox(sharedGeometry?.title) ? sharedGeometry.title : null;

  let title = null;
  if (isBox(raw.title)) title = raw.title;
  else if (isBox(sharedTitle)) {
    title = sharedTitle;
    events.push({ reason: 'mapped_shared_geometry', details: { from: 'shared.title', to: 'title' } });
  }

  let textBox = null;
  if (isBox(raw.textBox)) textBox = raw.textBox;
  else if (isBox(raw.body)) {
    textBox = raw.body;
    events.push({ reason: 'mapped_legacy_key', details: { from: 'body', to: 'textBox' } });
  } else if (isBox(raw.rightBody)) {
    textBox = raw.rightBody;
    events.push({ reason: 'mapped_legacy_key', details: { from: 'rightBody', to: 'textBox' } });
  } else if (isBox(raw.bodyBoxes?.[2])) {
    textBox = raw.bodyBoxes[2];
    events.push({ reason: 'mapped_body_boxes', details: { to: 'textBox' } });
  }

  let chartBox = null;
  if (isBox(raw.chartBox)) chartBox = raw.chartBox;
  else if (isBox(raw.chart)) {
    chartBox = raw.chart;
    events.push({ reason: 'mapped_legacy_key', details: { from: 'chart', to: 'chartBox' } });
  } else if (isBox(raw.bottomChart)) {
    chartBox = raw.bottomChart;
    events.push({ reason: 'mapped_legacy_key', details: { from: 'bottomChart', to: 'chartBox' } });
  }

  let tableBox = null;
  if (isBox(raw.tableBox)) tableBox = raw.tableBox;
  else if (isBox(raw.table)) {
    tableBox = raw.table;
    events.push({ reason: 'mapped_legacy_key', details: { from: 'table', to: 'tableBox' } });
  }

  const headingBox =
    (isBox(raw.headingBox) && raw.headingBox) ||
    (isBox(raw.heading) && raw.heading) ||
    (isBox(raw.bodyBoxes?.[1]) ? raw.bodyBoxes[1] : null);
  if (!isBox(raw.headingBox) && isBox(headingBox)) {
    events.push({ reason: 'mapped_legacy_key', details: { from: 'heading/bodyBoxes[1]', to: 'headingBox' } });
  }

  const straplineBox =
    (isBox(raw.straplineBox) && raw.straplineBox) ||
    (isBox(raw.strapline) && raw.strapline) ||
    (isBox(raw.bodyBoxes?.[0]) ? raw.bodyBoxes[0] : null);
  if (!isBox(raw.straplineBox) && isBox(straplineBox)) {
    events.push({ reason: 'mapped_legacy_key', details: { from: 'strapline/bodyBoxes[0]', to: 'straplineBox' } });
  }

  const geometry = {
    ...raw,
    title,
    strapline: straplineBox || raw.strapline || null,
    textBox,
    chartBox,
    tableBox,
    headingBox,
    straplineBox,
    body: textBox || raw.body || null,
    chart: chartBox || raw.chart || null,
    table: tableBox || raw.table || null,
    heading: headingBox || raw.heading || null,
  };
  return { geometry, events };
}

function inferSharedGeometry(typeLayouts = {}) {
  const candidates = Object.values(typeLayouts)
    .map((layout) => layout?.geometry?.title)
    .filter((box) => isBox(box));
  if (candidates.length === 0) return { title: null };
  const keyCounts = new Map();
  for (const box of candidates) {
    const key = `${box.x}|${box.y}|${box.w}|${box.h}`;
    keyCounts.set(key, (keyCounts.get(key) || 0) + 1);
  }
  const preferredKey = [...keyCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const preferred = candidates.find((box) => `${box.x}|${box.y}|${box.w}|${box.h}` === preferredKey) || candidates[0];
  return { title: preferred };
}

export function normalizeGeometry(slideType, rawGeometry = null, options = {}) {
  const raw = cloneBox(rawGeometry) || {};
  const sharedGeometry = options?.sharedGeometry || null;

  if (slideType === 'analysisWideChart2ColsText') {
    return normalizeAnalysisWide2ColsGeometry(raw, sharedGeometry);
  }
  if (slideType === 'analysisWideChartTableText') {
    return normalizeAnalysisWideChartTableGeometry(raw, sharedGeometry);
  }
  return { geometry: raw, events: [] };
}

function requiredGeometryKeys(slideType) {
  if (slideType === 'analysisWideChart2ColsText') return ['title', 'textBox', 'chartBox'];
  if (slideType === 'analysisWideChartTableText') return ['title', 'textBox', 'chartBox'];
  return [];
}

function notifyAdapterEvents(slideType, templateLayout, events = []) {
  if (!Array.isArray(events) || events.length === 0) return;
  for (const event of events) {
    recordFallback(slideType, `geometry_adapter:${event.reason}`, {
      templateLayout,
      ...(event?.details || {}),
    });
  }
}

function assertRequiredGeometry(slideType, templateLayout, geometry = {}) {
  const missing = requiredGeometryKeys(slideType).filter((key) => !isBox(geometry?.[key]));
  if (missing.length === 0) return;

  recordFallback(slideType, 'geometry_adapter:missing_required_keys', {
    templateLayout,
    missing,
    available: Object.keys(geometry || {}),
  });
  const message = `Layout geometry for "${slideType}" (${templateLayout || 'unknown-layout'}) is missing required keys: ${missing.join(', ')}`;
  recordWarning(message);
  throw new Error(message);
}

export function buildLayoutContract(templatePackage = {}) {
  const typeLayouts = templatePackage?.layouts?.types || {};
  const sharedGeometry = inferSharedGeometry(typeLayouts);
  const byType = {};

  for (const [slideType, layout] of Object.entries(typeLayouts)) {
    const { geometry, events } = normalizeGeometry(slideType, layout?.geometry || {}, { sharedGeometry });
    notifyAdapterEvents(slideType, layout?.templateLayout || null, events);
    assertRequiredGeometry(slideType, layout?.templateLayout || null, geometry);

    byType[slideType] = {
      boxes: geometry,
      templateLayout: layout?.templateLayout || null,
    };
  }

  return {
    byType,
    get(slideType) {
      return byType[slideType] || { boxes: {}, templateLayout: null };
    },
  };
}

export function resolveSlideGeometry(layoutContract, slideType, fallbackGeometry = null) {
  const contract = layoutContract?.get?.(slideType);
  if (contract?.boxes && Object.keys(contract.boxes).length > 0) {
    assertRequiredGeometry(slideType, contract?.templateLayout || null, contract.boxes);
    return contract.boxes;
  }
  const { geometry } = normalizeGeometry(slideType, fallbackGeometry || null);
  assertRequiredGeometry(slideType, contract?.templateLayout || null, geometry);
  return geometry;
}
