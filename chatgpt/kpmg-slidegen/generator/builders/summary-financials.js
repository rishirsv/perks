import { FONTS, COLORS } from '../tokens.js';
import { addTitle } from '../helpers/title.js';

const DEFAULT_TOP_SECTIONS = ['Quality of earnings', 'Net working capital', 'Net debt'];
const DEFAULT_BOTTOM_SECTIONS = ['Cash conversion', 'Other value bridge'];

const SUMMARY_SCAFFOLD = {
  panelFill: 'EDEDED',
  panelHeaderColor: '00338D',
  readMoreFill: '5A1CD7',
  panelHeight: 2.512,
  title: { x: 1.092, y: 0.472, w: 11.15, h: 0.583 },
};

function splitSummaryScaffoldHeaders(geometry) {
  const headers = Array.isArray(geometry?.bodyBoxes) ? geometry.bodyBoxes : [];
  if (headers.length >= 5) {
    return { top: headers.slice(0, 3), bottom: headers.slice(3, 5) };
  }
  const top = [
    { x: 1.089, y: 1.29, w: 3.622, h: 0.276 },
    { x: 4.857, y: 1.29, w: 3.622, h: 0.276 },
    { x: 8.626, y: 1.29, w: 3.622, h: 0.276 },
  ];
  const bottom = [
    { x: 1.089, y: 3.917, w: 5.508, h: 0.276 },
    { x: 6.736, y: 3.917, w: 5.508, h: 0.276 },
  ];
  return { top, bottom };
}

function toSectionLabelsFromKpis(kpis) {
  if (!Array.isArray(kpis)) return [];
  return kpis
    .map((kpi) => (typeof kpi?.label === 'string' ? kpi.label.trim() : ''))
    .filter(Boolean);
}

function normalizeSectionArray(input, fallback, count) {
  const values = Array.isArray(input)
    ? input
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter(Boolean)
    : [];
  const out = [...values];
  for (let i = 0; out.length < count && i < fallback.length; i += 1) {
    if (!out.includes(fallback[i])) out.push(fallback[i]);
  }
  return out.slice(0, count);
}

function resolveSections(slideSpec = {}) {
  const legacyLabels = toSectionLabelsFromKpis(slideSpec.kpis);
  const legacyTop = legacyLabels.slice(0, 3);
  const legacyBottom = legacyLabels.slice(3, 5);

  return {
    sectionsTop: normalizeSectionArray(slideSpec.sectionsTop || legacyTop, DEFAULT_TOP_SECTIONS, 3),
    sectionsBottom: normalizeSectionArray(slideSpec.sectionsBottom || legacyBottom, DEFAULT_BOTTOM_SECTIONS, 2),
  };
}

function addScaffoldPanel(pptx, slide, headerGeo, headingText, showReadMore, panelHeight) {
  const panelH = panelHeight || SUMMARY_SCAFFOLD.panelHeight;
  slide.addShape(pptx.ShapeType.rect, {
    x: headerGeo.x,
    y: headerGeo.y,
    w: headerGeo.w,
    h: panelH,
    line: { color: SUMMARY_SCAFFOLD.panelFill, pt: 0.5 },
    fill: { color: SUMMARY_SCAFFOLD.panelFill },
  });

  slide.addText(headingText || '', {
    x: headerGeo.x + 0.08,
    y: headerGeo.y + 0.03,
    w: Math.max(0.5, headerGeo.w - (showReadMore ? 0.9 : 0.15)),
    h: headerGeo.h,
    fontFace: FONTS.body,
    fontSize: 10,
    color: SUMMARY_SCAFFOLD.panelHeaderColor,
    bold: true,
    margin: 0,
    valign: 'mid',
  });

  if (!showReadMore) return;

  const tagW = 0.82;
  const tagH = 0.22;
  const tagX = headerGeo.x + headerGeo.w - tagW - 0.05;
  const tagY = headerGeo.y + 0.03;

  slide.addShape(pptx.ShapeType.roundRect, {
    x: tagX,
    y: tagY,
    w: tagW,
    h: tagH,
    rectRadius: 0.03,
    line: { color: SUMMARY_SCAFFOLD.readMoreFill, pt: 0.5 },
    fill: { color: SUMMARY_SCAFFOLD.readMoreFill },
  });

  slide.addText('Read more', {
    x: tagX,
    y: tagY + 0.01,
    w: tagW,
    h: tagH,
    fontFace: FONTS.body,
    fontSize: 7,
    color: COLORS.white,
    bold: true,
    align: 'center',
    valign: 'mid',
    margin: 0,
  });
}

// Legacy alias: keep type `summaryFinancials`, but render only canonical scaffold.
export function addSummaryFinancials(pptx, slideSpec = {}) {
  const { sectionsTop, sectionsBottom } = resolveSections(slideSpec);
  return addSummaryFinancialsScaffold(pptx, {
    title: slideSpec.title || 'Summary financials',
    sectionsTop,
    sectionsBottom,
    source: slideSpec.source || slideSpec.chart?.source || null,
    geometry: slideSpec.geometry,
    masterName: slideSpec.masterName,
  });
}

export function addSummaryFinancialsScaffold(
  pptx,
  { title, sectionsTop, sectionsBottom, source, geometry, masterName } = {},
) {
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const { top, bottom } = splitSummaryScaffoldHeaders(geometry);
  const panelHeight = geometry?.panelHeight || SUMMARY_SCAFFOLD.panelHeight;

  addTitle(slide, title || 'Summary financials', geometry?.title || SUMMARY_SCAFFOLD.title);

  const topHeadings = normalizeSectionArray(sectionsTop, DEFAULT_TOP_SECTIONS, 3);
  const bottomHeadings = normalizeSectionArray(sectionsBottom, DEFAULT_BOTTOM_SECTIONS, 2);

  top.forEach((geo, idx) => addScaffoldPanel(pptx, slide, geo, topHeadings[idx], true, panelHeight));
  bottom.forEach((geo, idx) => addScaffoldPanel(pptx, slide, geo, bottomHeadings[idx], false, panelHeight));

  if (source) {
    slide.addText(String(source), {
      x: 1.0919,
      y: 6.45,
      w: 5.2,
      h: 0.2,
      fontFace: FONTS.body,
      fontSize: 6,
      color: '666666',
      margin: 0,
      valign: 'mid',
    });
  }

  return slide;
}
