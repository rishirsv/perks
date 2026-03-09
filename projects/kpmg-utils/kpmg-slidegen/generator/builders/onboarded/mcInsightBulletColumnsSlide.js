import {
  resolveBodyTextStyle,
  resolveHeadingTextStyle,
  resolveMajorHeadingFont,
  resolveTextBoxOptions,
  resolveTheme,
  resolveTokenTextStyle,
} from '../../helpers/theme.js';

function resolveStyles(theme = null) {
  const resolvedTheme = resolveTheme(theme);
  const headingFont = resolveMajorHeadingFont(resolvedTheme);
  return {
    neutral300: resolvedTheme.colors.neutral300,
    kpmgBlue: resolvedTheme.colors.kpmgBlue,
    darkNavy: resolvedTheme.colors.darkNavy,
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
    label: {
      ...resolveHeadingTextStyle(resolvedTheme, { colorKey: 'kpmgBlue' }),
      fontFace: headingFont,
      fontSize: 16,
      italic: true,
      bold: true,
      margin: 0,
    },
    number: {
      fontFace: headingFont,
      fontSize: 28,
      bold: true,
      color: resolvedTheme.colors.white,
      align: 'center',
      margin: 0,
      fit: 'shrink',
      valign: 'mid',
    },
    heading: {
      ...resolveHeadingTextStyle(resolvedTheme, { colorKey: 'kpmgBlue' }),
      fontFace: headingFont,
      fontSize: 19,
      bold: true,
      margin: 0,
      fit: 'shrink',
    },
    body: {
      ...resolveBodyTextStyle(resolvedTheme),
      fontSize: 13,
      color: resolvedTheme.colors.kpmgBlue,
      margin: 0,
      fit: 'shrink',
    },
    insight: {
      fontFace: headingFont,
      fontSize: 17,
      bold: true,
      color: resolvedTheme.colors.white,
      align: 'center',
      valign: 'mid',
      margin: 0,
      fit: 'shrink',
    },
  };
}

export function buildMcInsightBulletColumnsSlide(pptx, slideSpec = {}, ctx = {}) {
  const { title, strapline, sectionLabel, insightText, columns = [] } = slideSpec;
  const { geometry = {}, masterName, theme } = ctx;
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const textBox = resolveTextBoxOptions(theme, { margin: 0, wrap: true });
  const styles = resolveStyles(theme);
  const boxes = Array.isArray(geometry.columnBoxes) ? geometry.columnBoxes.slice(0, 5) : [];
  if (!geometry.titleBox || !geometry.straplineBox || boxes.length < 5) {
    throw new Error('Missing required geometry for mcInsightBulletColumnsSlide');
  }
  const sectionLabelBox = { x: 5.18, y: 1.72, w: 2.95, h: 0.3 };
  const insightBandBox = { x: 0, y: 5.73, w: 13.3333, h: 0.82 };

  slide.addText(title || '', { ...geometry.titleBox, ...styles.title, ...textBox });
  slide.addText(strapline || '', { ...geometry.straplineBox, ...styles.strapline, ...textBox });

  slide.addShape(pptx.ShapeType.line, {
    x: 0.62, y: 1.96, w: 4.75, h: 0,
    line: { color: styles.neutral300, pt: 1, dash: 'dash' },
  });
  slide.addShape(pptx.ShapeType.line, {
    x: 8.45, y: 1.96, w: 4.28, h: 0,
    line: { color: styles.neutral300, pt: 1, dash: 'dash' },
  });
  slide.addText(sectionLabel || '', { ...sectionLabelBox, ...styles.label, ...textBox, align: 'center' });

  boxes.forEach((box, index) => {
    const column = columns[index] || {};
    slide.addShape(pptx.ShapeType.rect, {
      x: box.x,
      y: box.y + 0.38,
      w: 0.88,
      h: 0.86,
      line: { color: styles.kpmgBlue, pt: 0 },
      fill: { color: styles.kpmgBlue },
    });
    slide.addText(column.number || String(index + 1).padStart(2, '0'), {
      x: box.x,
      y: box.y + 0.38,
      w: 0.88,
      h: 0.86,
      ...styles.number,
      ...textBox,
    });
    slide.addText(column.heading || '', {
      x: box.x,
      y: box.y + 1.42,
      w: box.w,
      h: 0.42,
      ...styles.heading,
      ...textBox,
    });
    slide.addText(column.body || '', {
      x: box.x,
      y: box.y + 2.55,
      w: box.w,
      h: 0.3,
      ...styles.body,
      ...textBox,
    });
  });

  slide.addShape(pptx.ShapeType.rect, {
    ...insightBandBox,
    line: { color: styles.darkNavy, pt: 0 },
    fill: { color: styles.darkNavy },
  });
  slide.addText(insightText || '', {
    ...insightBandBox,
    ...styles.insight,
    ...textBox,
  });
  return slide;
}

export default buildMcInsightBulletColumnsSlide;
