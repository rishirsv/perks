import { FONTS, COLORS, TYPE_SIZES, TEXT_BOX, STRAPLINE_SHIFT } from '../tokens.js';
import { toBulletRuns } from '../helpers/bullets.js';
import { addTitle } from '../helpers/title.js';
import { clampBoxToBottom, isValidColumnGeometry } from '../helpers/geometry.js';
import { calcTextBoxHeight, sanitizeText } from '../helpers/text.js';
import { recordFallback } from '../runtime/diagnostics.js';
import { FOOTER_SAFE_TOP } from '../helpers/footer.js';

export const TOKENS = {
  geometry: {
    title: { x: 1.0919, y: 0.6, w: 11.1596, h: 0.6 },
    left: { x: 1.0919, y: 1.5, w: 5.7, h: 5.7 },
    right: { x: 7.0415, y: 1.5, w: 5.2, h: 5.7 },
  },
  textStyles: {
    title: {
      fontFace: FONTS.heading,
      fontSize: TYPE_SIZES.slideTitle,
      color: COLORS.kpmgBlue,
      bold: true,
      align: 'left',
      valign: 'top',
    },
    body: {
      fontFace: FONTS.body,
      fontSize: TYPE_SIZES.body,
      color: COLORS.black,
      align: 'left',
      valign: 'top',
      paraSpaceAfter: 6,
    },
  },
};

export function addTwoColumnText(pptx, { title, leftBody, rightBody } = {}) {
  const slide = pptx.addSlide();

  addTitle(slide, title, TOKENS.geometry.title);

  slide.addText(toBulletRuns(leftBody), { ...TOKENS.geometry.left, ...TOKENS.textStyles.body, wrap: TEXT_BOX.wrap, margin: TEXT_BOX.marginPt, valign: 'top' });
  slide.addText(toBulletRuns(rightBody), { ...TOKENS.geometry.right, ...TOKENS.textStyles.body, wrap: TEXT_BOX.wrap, margin: TEXT_BOX.marginPt, valign: 'top' });

  return slide;
}

export function addTwoColumnTextWithStrapline(pptx, { title, strapline, leftBody, rightBody, geometry, masterName } = {}) {
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const candidate = geometry || TOKENS.geometry;
  const useExtracted = isValidColumnGeometry([candidate.left, candidate.right], 2);
  const g = useExtracted ? candidate : TOKENS.geometry;
  if (!useExtracted && geometry) {
    recordFallback('twoColumnTextWithStrapline', 'invalid_extracted_columns', {
      left: candidate.left,
      right: candidate.right,
    });
  }

  addTitle(slide, title, g.title || TOKENS.geometry.title);
  if (strapline) {
    const titleGeo = g.title || TOKENS.geometry.title;
    const strapBox = g.strapline || {
      x: titleGeo.x,
      y: titleGeo.y + titleGeo.h + 0.05,
      w: titleGeo.w,
      h: calcTextBoxHeight(TYPE_SIZES.strapline, 1),
    };
    slide.addText(sanitizeText(strapline), {
      ...strapBox,
      fontFace: FONTS.body,
      fontSize: TYPE_SIZES.strapline,
      color: COLORS.kpmgPurple,
      italic: true,
      bold: true,
      wrap: TEXT_BOX.wrap,
      margin: TEXT_BOX.marginPt,
      valign: 'top',
    });
  }

  const hasMeasuredStrapline = Boolean(g.strapline);
  const shift = strapline && !hasMeasuredStrapline ? STRAPLINE_SHIFT : 0;
  const leftBase = g.left || TOKENS.geometry.left;
  const rightBase = g.right || TOKENS.geometry.right;
  const leftGeo = shift ? { ...leftBase, y: leftBase.y + shift, h: leftBase.h - shift } : leftBase;
  const rightGeo = shift ? { ...rightBase, y: rightBase.y + shift, h: rightBase.h - shift } : rightBase;
  const footerSafeTop = masterName === 'KPMG_WHITE' ? FOOTER_SAFE_TOP : null;
  const safeLeftGeo = footerSafeTop ? clampBoxToBottom(leftGeo, footerSafeTop) : leftGeo;
  const safeRightGeo = footerSafeTop ? clampBoxToBottom(rightGeo, footerSafeTop) : rightGeo;

  slide.addText(toBulletRuns(leftBody), { ...safeLeftGeo, ...TOKENS.textStyles.body, wrap: TEXT_BOX.wrap, margin: TEXT_BOX.marginPt, valign: 'top' });
  slide.addText(toBulletRuns(rightBody), { ...safeRightGeo, ...TOKENS.textStyles.body, wrap: TEXT_BOX.wrap, margin: TEXT_BOX.marginPt, valign: 'top' });

  return slide;
}
