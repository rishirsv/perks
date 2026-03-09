import path from 'node:path';

import {
  resolveBodyTextStyle,
  resolveHeadingTextStyle,
  resolveTokenTextStyle,
  resolveTextBoxOptions,
  resolveTheme,
} from 'file:///Users/rishi/Code/ai-tools/projects/kpmg-utils/kpmg-slidegen/generator/helpers/theme.js';
import { resolveTemplateAssetsDir } from 'file:///Users/rishi/Code/ai-tools/projects/kpmg-utils/kpmg-slidegen/generator/runtime/template-roots.js';

const TEMPLATE_ASSETS_DIR = resolveTemplateAssetsDir('kpmg-diligence');
const ICON_BOXES = Object.freeze([
  { x: 0.96, y: 2.49, w: 0.78, h: 0.78 },
  { x: 0.98, y: 5.21, w: 0.66, h: 0.64 },
]);

function resolveStyles(theme = null) {
  const resolvedTheme = resolveTheme(theme);
  return {
    panelBlue: resolvedTheme.colors.kpmgBlue,
    outlineBlue: resolvedTheme.colors.kpmgBlue,
    title: {
      ...resolveTokenTextStyle(resolvedTheme, 'slideTitle', {
        ...resolveHeadingTextStyle(resolvedTheme, { colorKey: 'kpmgBlue' }),
      }),
      fontSize: 28,
      bold: true,
      margin: 0,
      fit: 'shrink',
    },
    subtitle: {
      ...resolveHeadingTextStyle(resolvedTheme, { colorKey: 'kpmgBlue' }),
      fontFace: resolvedTheme.fonts.heading,
      fontSize: 18,
      bold: false,
      margin: 0,
      fit: 'shrink',
    },
    leftHeading: {
      ...resolveHeadingTextStyle(resolvedTheme, { colorKey: 'white' }),
      fontFace: 'KPMG Bold',
      fontSize: 17,
      bold: true,
      margin: 0,
      fit: 'shrink',
      valign: 'mid',
    },
    rightBody: {
      ...resolveBodyTextStyle(resolvedTheme),
      fontFace: resolvedTheme.fonts.body,
      fontSize: 14,
      color: resolvedTheme.colors.kpmgBlue,
      margin: 0,
      fit: 'shrink',
      valign: 'mid',
    },
  };
}

function resolveIconPath(column = {}, index = 0) {
  const assetName =
    typeof column?.iconAsset === 'string' && column.iconAsset.trim()
      ? column.iconAsset.trim()
      : `mc-two-bullet-icon-${index + 1}.png`;
  return path.join(TEMPLATE_ASSETS_DIR, assetName);
}

function drawRow(pptx, slide, rowIndex, column = {}, leftBox, rightBox, styles, textBox) {
  slide.addShape(pptx.ShapeType.rect, {
    ...leftBox,
    line: { color: styles.panelBlue, pt: 0 },
    fill: { color: styles.panelBlue },
  });
  slide.addShape(pptx.ShapeType.rect, {
    ...rightBox,
    line: { color: styles.outlineBlue, pt: 1 },
    fill: { color: 'FFFFFF', transparency: 100 },
  });

  slide.addImage({
    path: resolveIconPath(column, rowIndex),
    ...ICON_BOXES[rowIndex],
  });

  slide.addText(column.heading || '', {
    x: leftBox.x + 1.35,
    y: leftBox.y + 0.05,
    w: leftBox.w - 1.6,
    h: leftBox.h - 0.1,
    ...styles.leftHeading,
    ...textBox,
  });

  const bodyText = Array.isArray(column.body) ? column.body.join('\n') : String(column.body || '');
  slide.addText(bodyText, {
    x: rightBox.x + 0.25,
    y: rightBox.y + 0.15,
    w: rightBox.w - 0.5,
    h: rightBox.h - 0.3,
    ...styles.rightBody,
    ...textBox,
    breakLine: true,
  });
}

export function buildMcTwoBulletSlide(pptx, slideSpec = {}, ctx = {}) {
  const { title, strapline, columns } = slideSpec;
  const { geometry, masterName, theme } = ctx;
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const g = geometry || {};
  if (!g.titleBox || !g.straplineBox || !Array.isArray(g.columnBoxes) || g.columnBoxes.length < 4) {
    throw new Error('Missing required geometry for slide type "mcTwoBulletSlide" (titleBox/straplineBox/columnBoxes)');
  }

  const styles = resolveStyles(theme);
  const textBox = resolveTextBoxOptions(theme, { wrap: true, margin: 0 });
  const rows = Array.isArray(columns) ? columns.slice(0, 2) : [];

  slide.addText(title || '', {
    ...g.titleBox,
    ...styles.title,
    ...textBox,
  });
  slide.addText(strapline || '', {
    ...g.straplineBox,
    ...styles.subtitle,
    ...textBox,
  });

  drawRow(pptx, slide, 0, rows[0] || {}, g.columnBoxes[0], g.columnBoxes[1], styles, textBox);
  drawRow(pptx, slide, 1, rows[1] || {}, g.columnBoxes[2], g.columnBoxes[3], styles, textBox);
  return slide;
}

export default buildMcTwoBulletSlide;
