import path from 'node:path';

import {
  resolveBodyTextStyle,
  resolveHeadingTextStyle,
  resolveMajorHeadingFont,
  resolveTextBoxOptions,
  resolveTheme,
  resolveTokenTextStyle,
} from 'file:///Users/rishi/Code/ai-tools/projects/kpmg-utils/kpmg-slidegen/generator/helpers/theme.js';
import { resolveTemplateAssetsDir } from 'file:///Users/rishi/Code/ai-tools/projects/kpmg-utils/kpmg-slidegen/generator/runtime/template-roots.js';

const TEMPLATE_ASSETS_DIR = resolveTemplateAssetsDir('kpmg-diligence');

function resolveStyles(theme = null) {
  const resolvedTheme = resolveTheme(theme);
  const headingFont = resolveMajorHeadingFont(resolvedTheme);
  return {
    white: resolvedTheme.colors.white,
    panelColors: [
      resolvedTheme.colors.darkNavy,
      resolvedTheme.colors.kpmgBlueMid,
      resolvedTheme.colors.kpmgBlue,
      resolvedTheme.colors.kpmgBlueBright,
    ],
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
    strapline: {
      ...resolveHeadingTextStyle(resolvedTheme, { colorKey: 'kpmgBlue', bold: false }),
      fontFace: headingFont,
      fontSize: 18,
      margin: 0,
      fit: 'shrink',
    },
    stage: {
      fontFace: headingFont,
      fontSize: 16,
      bold: true,
      color: resolvedTheme.colors.kpmgCyan,
      margin: 0,
      fit: 'shrink',
    },
    heading: {
      fontFace: headingFont,
      fontSize: 22,
      bold: true,
      color: resolvedTheme.colors.white,
      margin: 0,
      fit: 'shrink',
    },
    subheading: {
      ...resolveBodyTextStyle(resolvedTheme),
      fontSize: 13,
      color: 'FFFFFF',
      margin: 0,
      fit: 'shrink',
    },
    bullets: {
      ...resolveBodyTextStyle(resolvedTheme),
      fontSize: 12,
      bold: true,
      color: 'FFFFFF',
      margin: 0,
      breakLine: true,
      fit: 'shrink',
    },
  };
}

function resolveBulletText(items = []) {
  return (Array.isArray(items) ? items : []).map((item) => `•   ${String(item || '').trim()}`).join('\n');
}

export function buildMcStageBulletGridSlide(pptx, slideSpec = {}, ctx = {}) {
  const { title, strapline, columns = [] } = slideSpec;
  const { geometry = {}, masterName, theme } = ctx;
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const textBox = resolveTextBoxOptions(theme, { margin: 0, wrap: true });
  const styles = resolveStyles(theme);
  const boxes = Array.isArray(geometry.columnBoxes) ? geometry.columnBoxes.slice(0, 4) : [];
  if (!geometry.titleBox || !geometry.straplineBox || boxes.length < 4) {
    throw new Error('Missing required geometry for mcStageBulletGridSlide');
  }

  slide.addText(title || '', { ...geometry.titleBox, ...styles.title, ...textBox });
  slide.addText(strapline || '', { ...geometry.straplineBox, ...styles.strapline, ...textBox });

  boxes.forEach((box, index) => {
    const column = columns[index] || {};
    const color = styles.panelColors[index] || styles.panelColors[styles.panelColors.length - 1];
    slide.addShape(pptx.ShapeType.rect, {
      x: box.x,
      y: box.y,
      w: box.w,
      h: Math.min(box.h, 5.08),
      line: { color, pt: 0 },
      fill: { color },
    });

    if (index > 0) {
      slide.addShape(pptx.ShapeType.diamond, {
        x: box.x - 0.14,
        y: box.y + 4.55,
        w: 0.28,
        h: 0.42,
        line: { color: styles.white, pt: 0 },
        fill: { color: styles.white },
      });
    }

    if (column.iconAsset) {
      slide.addImage({
        path: path.join(TEMPLATE_ASSETS_DIR, column.iconAsset),
        x: box.x + 0.38,
        y: box.y + 0.34,
        w: 0.42,
        h: 0.42,
      });
    }

    slide.addText(column.stage || '', {
      x: box.x + 0.42,
      y: box.y + 0.92,
      w: box.w - 0.64,
      h: 0.24,
      ...styles.stage,
      ...textBox,
    });
    slide.addText(column.heading || '', {
      x: box.x + 0.42,
      y: box.y + 1.38,
      w: box.w - 0.64,
      h: 0.56,
      ...styles.heading,
      ...textBox,
    });
    slide.addText(column.subheading || '', {
      x: box.x + 0.42,
      y: box.y + 2.82,
      w: box.w - 0.64,
      h: 0.26,
      ...styles.subheading,
      ...textBox,
    });
    slide.addText(resolveBulletText(column.items), {
      x: box.x + 0.42,
      y: box.y + 3.8,
      w: box.w - 0.64,
      h: 0.95,
      ...styles.bullets,
      ...textBox,
    });
  });

  return slide;
}

export default buildMcStageBulletGridSlide;
