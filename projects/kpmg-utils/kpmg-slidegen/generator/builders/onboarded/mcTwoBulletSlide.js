import path from 'node:path';

import {
  resolveBodyTextStyle,
  resolveHeadingTextStyle,
  resolveMajorHeadingFont,
  resolveTokenTextStyle,
  resolveTextBoxOptions,
  resolveTheme,
} from '../../helpers/theme.js';
import { resolveTemplateAssetsDir } from '../../runtime/template-roots.js';

const TEMPLATE_ASSETS_DIR = resolveTemplateAssetsDir('kpmg-diligence');
const ICON_BOXES = Object.freeze([
  { x: 0.96, y: 2.49, w: 0.78, h: 0.78 },
  { x: 0.98, y: 5.21, w: 0.66, h: 0.64 },
]);

function resolveStyles(theme = null) {
  const resolvedTheme = resolveTheme(theme);
  const headingFont = resolveMajorHeadingFont(resolvedTheme);
  return {
    panelBlue: resolvedTheme.colors.kpmgBlue,
    outlineBlue: resolvedTheme.colors.kpmgBlue,
    white: resolvedTheme.colors.white,
    title: {
      ...resolveTokenTextStyle(resolvedTheme, 'slideTitle', {
        ...resolveHeadingTextStyle(resolvedTheme, { colorKey: 'kpmgBlue' }),
      }),
      fontFace: headingFont,
      fontSize: 28,
      bold: true,
      margin: 0,
      fit: 'shrink',
    },
    subtitle: {
      ...resolveHeadingTextStyle(resolvedTheme, { colorKey: 'kpmgBlue' }),
      fontFace: headingFont,
      fontSize: 18,
      bold: false,
      margin: 0,
      fit: 'shrink',
    },
    leftHeading: {
      ...resolveHeadingTextStyle(resolvedTheme, { colorKey: 'white' }),
      fontFace: headingFont,
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

function computeGenericIconBox(leftBox = {}, rowIndex = 0) {
  const h = Number(leftBox?.h || 0);
  const w = Number(leftBox?.w || 0);
  const size = Math.min(0.78, Math.max(0.44, h * 0.32));
  const x = Number(leftBox?.x || 0) + Math.max(0.35, w * 0.1);
  const y = Number(leftBox?.y || 0) + Math.max(0.28, (h - size) / 2);
  return { x, y, w: size, h: size + (rowIndex === 0 ? 0.04 : 0) };
}

function resolveRowStyles(styles, leftBox = {}) {
  const rowHeight = Number(leftBox?.h || 0);
  let leftHeadingFontSize = 17;
  let rightBodyFontSize = 14;
  if (rowHeight <= 1.05) {
    leftHeadingFontSize = 14;
    rightBodyFontSize = 12.5;
  } else if (rowHeight <= 1.3) {
    leftHeadingFontSize = 15;
    rightBodyFontSize = 13;
  } else if (rowHeight <= 1.65) {
    leftHeadingFontSize = 16;
    rightBodyFontSize = 13.5;
  }
  return {
    leftHeading: {
      ...styles.leftHeading,
      fontSize: leftHeadingFontSize,
    },
    rightBody: {
      ...styles.rightBody,
      fontSize: rightBodyFontSize,
    },
  };
}

function drawRow(pptx, slide, rowIndex, column = {}, leftBox, rightBox, styles, textBox) {
  const rowStyles = resolveRowStyles(styles, leftBox);
  slide.addShape(pptx.ShapeType.rect, {
    ...leftBox,
    line: { color: styles.panelBlue, pt: 0 },
    fill: { color: styles.panelBlue },
  });
  slide.addShape(pptx.ShapeType.rect, {
    ...rightBox,
    line: { color: styles.outlineBlue, pt: 1 },
    fill: { color: styles.white, transparency: 100 },
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
    ...rowStyles.leftHeading,
    ...textBox,
  });

  const bodyText = Array.isArray(column.body) ? column.body.join('\n') : String(column.body || '');
  slide.addText(bodyText, {
    x: rightBox.x + 0.25,
    y: rightBox.y + 0.15,
    w: rightBox.w - 0.5,
    h: rightBox.h - 0.3,
    ...rowStyles.rightBody,
    ...textBox,
    breakLine: true,
  });
}

export function buildMcBulletRowsSlide(pptx, slideSpec = {}, ctx = {}) {
  const { title, strapline, columns } = slideSpec;
  const { geometry, masterName, theme } = ctx;
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const g = geometry || {};
  if (!g.titleBox || !g.straplineBox || !Array.isArray(g.columnBoxes) || g.columnBoxes.length < 2) {
    throw new Error('Missing required geometry for MC bullet rows slide (titleBox/straplineBox/columnBoxes)');
  }
  if (g.columnBoxes.length % 2 !== 0) {
    throw new Error('Expected columnBoxes to be left/right pairs for MC bullet rows slide.');
  }

  const styles = resolveStyles(theme);
  const textBox = resolveTextBoxOptions(theme, { wrap: true, margin: 0 });
  const rows = Array.isArray(columns) ? columns.slice(0, g.columnBoxes.length / 2) : [];

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

  for (let i = 0; i < g.columnBoxes.length; i += 2) {
    const rowIndex = i / 2;
    const leftBox = g.columnBoxes[i];
    const rightBox = g.columnBoxes[i + 1];
    const iconBox = ICON_BOXES[rowIndex] || computeGenericIconBox(leftBox, rowIndex);
    slide.addShape(pptx.ShapeType.rect, {
      ...leftBox,
      line: { color: styles.panelBlue, pt: 0 },
      fill: { color: styles.panelBlue },
    });
    slide.addShape(pptx.ShapeType.rect, {
      ...rightBox,
      line: { color: styles.outlineBlue, pt: 1 },
      fill: { color: styles.white, transparency: 100 },
    });
    slide.addImage({
      path: resolveIconPath(rows[rowIndex] || {}, rowIndex),
      ...iconBox,
    });
    const rowStyles = resolveRowStyles(styles, leftBox);
    slide.addText((rows[rowIndex] || {}).heading || '', {
      x: leftBox.x + Math.max(1.35, leftBox.w * 0.36),
      y: leftBox.y + 0.05,
      w: leftBox.w - Math.max(1.6, leftBox.w * 0.42),
      h: leftBox.h - 0.1,
      ...rowStyles.leftHeading,
      ...textBox,
    });
    const bodyText = Array.isArray((rows[rowIndex] || {}).body)
      ? (rows[rowIndex] || {}).body.join('\n')
      : String((rows[rowIndex] || {}).body || '');
    slide.addText(bodyText, {
      x: rightBox.x + 0.25,
      y: rightBox.y + 0.15,
      w: rightBox.w - 0.5,
      h: rightBox.h - 0.3,
      ...rowStyles.rightBody,
      ...textBox,
      breakLine: true,
    });
  }

  return slide;
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
