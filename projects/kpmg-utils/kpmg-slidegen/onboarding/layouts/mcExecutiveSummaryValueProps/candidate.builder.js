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
    panelFill: resolvedTheme.colors.neutral100,
    divider: resolvedTheme.colors.kpmgBlue,
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
    sectionLabel: {
      ...resolveHeadingTextStyle(resolvedTheme, { colorKey: 'kpmgBlue' }),
      fontFace: headingFont,
      fontSize: 18,
      bold: true,
      margin: 0,
      fit: 'shrink',
    },
    body: {
      ...resolveBodyTextStyle(resolvedTheme),
      fontSize: 15,
      color: resolvedTheme.colors.kpmgBlue,
      margin: 0,
      fit: 'shrink',
      breakLine: true,
    },
    bullets: {
      ...resolveBodyTextStyle(resolvedTheme),
      fontSize: 13,
      color: resolvedTheme.colors.kpmgBlue,
      margin: 0,
      fit: 'shrink',
      breakLine: true,
    },
  };
}

function formatBullets(items = []) {
  return (Array.isArray(items) ? items : []).map((item) => `•   ${String(item || '').trim()}`).join('\n');
}

export function buildMcExecutiveSummaryValueProps(pptx, slideSpec = {}, ctx = {}) {
  const { title, strapline, columns = [] } = slideSpec;
  const { geometry = {}, masterName, theme } = ctx;
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const styles = resolveStyles(theme);
  const textBox = resolveTextBoxOptions(theme, { margin: 0, wrap: true });
  const boxes = Array.isArray(geometry.columnBoxes) ? geometry.columnBoxes.slice(0, 3) : [];
  if (!geometry.titleBox || boxes.length < 3) {
    throw new Error('Missing required geometry for mcExecutiveSummaryValueProps');
  }

  slide.addText(title || '', { ...geometry.titleBox, ...styles.title, ...textBox });
  slide.addText(strapline || 'What [Client] is looking for:', {
    x: 0.61,
    y: 1.86,
    w: 4.1,
    h: 0.22,
    ...styles.sectionLabel,
    ...textBox,
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.61,
    y: 2.19,
    w: 12.12,
    h: 2.1,
    line: { color: styles.panelFill, pt: 0 },
    fill: { color: styles.panelFill },
  });
  slide.addText('What we bring:', {
    x: 0.61,
    y: 4.51,
    w: 2.8,
    h: 0.22,
    ...styles.sectionLabel,
    ...textBox,
  });

  boxes.forEach((box, index) => {
    const column = columns[index] || {};
    if (index > 0) {
      slide.addShape(pptx.ShapeType.line, {
        x: box.x - 0.08,
        y: 2.36,
        w: 0,
        h: 1.76,
        line: { color: styles.divider, pt: 1, dash: 'dash' },
      });
      slide.addShape(pptx.ShapeType.line, {
        x: box.x - 0.08,
        y: 4.87,
        w: 0,
        h: 1.93,
        line: { color: styles.divider, pt: 1, dash: 'dash' },
      });
    }
    if (column.iconAsset) {
      slide.addImage({
        path: path.join(TEMPLATE_ASSETS_DIR, column.iconAsset),
        x: box.x,
        y: 2.52,
        w: 0.51,
        h: 0.51,
      });
    }
    slide.addText(column.heading || '', {
      x: box.x,
      y: 3.32,
      w: box.w,
      h: 0.68,
      ...styles.body,
      ...textBox,
    });
    slide.addText(formatBullets(column.items), {
      x: box.x,
      y: 4.86,
      w: box.w,
      h: 1.25,
      ...styles.bullets,
      ...textBox,
    });
  });

  return slide;
}

export default buildMcExecutiveSummaryValueProps;
