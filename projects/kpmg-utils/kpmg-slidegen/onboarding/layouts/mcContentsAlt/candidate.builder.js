import path from 'node:path';

import {
  resolveBodyTextStyle,
  resolveHeadingTextStyle,
  resolveTextBoxOptions,
  resolveTheme,
} from 'file:///Users/rishi/Code/ai-tools/projects/kpmg-utils/kpmg-slidegen/generator/helpers/theme.js';
import { resolveTemplateAssetsDir } from 'file:///Users/rishi/Code/ai-tools/projects/kpmg-utils/kpmg-slidegen/generator/runtime/template-roots.js';

const TEMPLATE_ASSETS_DIR = resolveTemplateAssetsDir('kpmg-diligence');
const TITLE_IMAGE_PATH = path.join(
  TEMPLATE_ASSETS_DIR,
  'mc-contents-alt-title.png',
);

const FULL_SLIDE = Object.freeze({ x: 0, y: 0, w: 13.333, h: 7.5 });
const PANEL_BOX = Object.freeze({ x: 0.63, y: 0.53, w: 9.09, h: 6.2 });
const TITLE_IMAGE_BOX = Object.freeze({ x: 0.46, y: 0.46, w: 2.84, h: 1.92 });

function buildListBox(geometry = {}) {
  const top = geometry.topRowBox || {};
  const x = Number.isFinite(top.x) ? top.x : 4.72;
  const w = Number.isFinite(top.w) ? top.w : 4.08;
  return {
    x,
    y: 1.54,
    w,
    h: 5.02,
  };
}

function resolveStyles(theme = null) {
  const resolvedTheme = resolveTheme(theme);
  return {
    frameFill: resolvedTheme.colors.primary || resolvedTheme.colors.kpmgBlue,
    panelFill: resolvedTheme.colors.white,
    number: {
      ...resolveHeadingTextStyle(resolvedTheme, { colorKey: 'darkNavy' }),
      fontFace: 'KPMG Bold',
      fontSize: 12.6,
      bold: true,
      margin: 0,
      valign: 'mid',
      fit: 'shrink',
    },
    titleRow: {
      ...resolveHeadingTextStyle(resolvedTheme, { colorKey: 'darkNavy' }),
      fontFace: 'KPMG Bold',
      fontSize: 10.4,
      bold: true,
      underline: { style: 'sng' },
      margin: 0,
      valign: 'mid',
      fit: 'shrink',
    },
    pageRange: {
      ...resolveBodyTextStyle(resolvedTheme),
      fontSize: 8.8,
      color: resolvedTheme.colors.darkNavy,
      margin: 0,
      align: 'right',
      valign: 'mid',
      fit: 'shrink',
    },
  };
}

function addSectionRows(pptx, slide, sections, box, styles, textBox) {
  const rows = Array.isArray(sections) ? sections : [];
  if (rows.length === 0) return;
  const rowH = box.h / rows.length;
  for (const [index, section] of rows.entries()) {
    const y = box.y + index * rowH;
    slide.addText(section.number || '', {
      x: box.x,
      y,
      w: 0.28,
      h: rowH,
      ...styles.number,
      ...textBox,
    });
    slide.addText(section.title || '', {
      x: box.x + 0.48,
      y,
      w: box.w - 0.92,
      h: rowH,
      ...styles.titleRow,
      ...textBox,
    });
    slide.addText(section.pageRange || '', {
      x: box.x + box.w - 0.26,
      y,
      w: 0.26,
      h: rowH,
      ...styles.pageRange,
      ...textBox,
    });
    slide.addShape('line', {
      x: box.x,
      y: y + rowH - 0.02,
      w: box.w,
      h: 0,
      line: { color: '6F8FD7', pt: 0.6 },
    });
  }
}

export function buildMcContentsAlt(pptx, slideSpec = {}, ctx = {}) {
  const { sections } = slideSpec;
  const { geometry, masterName, theme } = ctx;
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const g = geometry || {};
  if (!g.titleBox || !g.topRowBox || !g.bottomRowBox) {
    throw new Error('Missing required geometry for slide type "mcContentsAlt" (titleBox/topRowBox/bottomRowBox)');
  }

  const styles = resolveStyles(theme);
  const textBox = resolveTextBoxOptions(theme, { wrap: true, margin: 0 });
  const listBox = buildListBox(g);

  slide.addShape(pptx.ShapeType.rect, {
    ...FULL_SLIDE,
    line: { color: styles.frameFill, pt: 0 },
    fill: { color: styles.frameFill },
  });
  slide.addShape(pptx.ShapeType.rect, {
    ...PANEL_BOX,
    line: { color: styles.panelFill, pt: 0 },
    fill: { color: styles.panelFill },
  });
  slide.addImage({
    path: TITLE_IMAGE_PATH,
    ...TITLE_IMAGE_BOX,
  });
  addSectionRows(pptx, slide, sections, listBox, styles, textBox);

  return slide;
}

export default buildMcContentsAlt;
