import {
  resolveBodyTextStyle,
  resolveHeadingTextStyle,
  resolveMajorHeadingFont,
  resolveTextBoxOptions,
  resolveTheme,
  resolveTokenTextStyle,
} from 'file:///Users/rishi/Code/ai-tools/projects/kpmg-utils/kpmg-slidegen/generator/helpers/theme.js';

function resolveStyles(theme = null) {
  const resolvedTheme = resolveTheme(theme);
  const headingFont = resolveMajorHeadingFont(resolvedTheme);
  return {
    white: resolvedTheme.colors.white,
    neutral300: resolvedTheme.colors.neutral300,
    panelColors: [
      resolvedTheme.colors.darkNavy,
      resolvedTheme.colors.kpmgBlueDark,
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
    heading: {
      fontFace: headingFont,
      fontSize: 16,
      bold: true,
      color: resolvedTheme.colors.white,
      margin: 0,
      fit: 'shrink',
    },
    subheading: {
      ...resolveBodyTextStyle(resolvedTheme),
      fontSize: 13,
      bold: true,
      color: resolvedTheme.colors.white,
      margin: 0,
      fit: 'shrink',
    },
    sectionTitle: {
      fontFace: headingFont,
      fontSize: 15,
      bold: true,
      underline: true,
      color: resolvedTheme.colors.white,
      margin: 0,
      fit: 'shrink',
    },
    bullets: {
      ...resolveBodyTextStyle(resolvedTheme),
      fontSize: 12,
      bold: true,
      color: resolvedTheme.colors.white,
      margin: 0,
      breakLine: true,
      fit: 'shrink',
    },
    number: {
      fontFace: headingFont,
      fontSize: 18,
      bold: true,
      color: resolvedTheme.colors.darkNavy,
      align: 'right',
      margin: 0,
      fit: 'shrink',
    },
  };
}

function resolveBulletText(items = []) {
  return (Array.isArray(items) ? items : []).map((item) => `•   ${String(item || '').trim()}`).join('\n');
}

export function buildMcNumberedBulletColumnsSlide(pptx, slideSpec = {}, ctx = {}) {
  const { title, strapline, columns = [] } = slideSpec;
  const { geometry = {}, masterName, theme } = ctx;
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const textBox = resolveTextBoxOptions(theme, { margin: 0, wrap: true });
  const styles = resolveStyles(theme);
  const boxes = Array.isArray(geometry.columnBoxes) ? geometry.columnBoxes.slice(0, 5) : [];
  if (!geometry.titleBox || !geometry.straplineBox || boxes.length < 5) {
    throw new Error('Missing required geometry for mcNumberedBulletColumnsSlide');
  }

  slide.addText(title || '', { ...geometry.titleBox, ...styles.title, ...textBox });
  slide.addText(strapline || '', { ...geometry.straplineBox, ...styles.strapline, ...textBox });

  boxes.forEach((box, index) => {
    const column = columns[index] || {};
    const color = styles.panelColors[index] || styles.panelColors[styles.panelColors.length - 1];
    slide.addShape(pptx.ShapeType.rect, {
      ...box,
      line: { color, pt: 0 },
      fill: { color },
    });
    slide.addShape(pptx.ShapeType.rtTriangle, {
      x: box.x + box.w - 0.44,
      y: box.y,
      w: 0.44,
      h: 1.08,
      rotate: 180,
      line: { color: styles.neutral300, pt: 0 },
      fill: { color: styles.neutral300 },
    });
    slide.addText(column.number || String(index + 1), {
      x: box.x + box.w - 0.42,
      y: box.y + 0.1,
      w: 0.26,
      h: 0.28,
      ...styles.number,
      ...textBox,
    });
    if (index < boxes.length - 1) {
      slide.addShape(pptx.ShapeType.diamond, {
        x: box.x + box.w - 0.1,
        y: box.y + 2.74,
        w: 0.2,
        h: 0.28,
        line: { color: styles.white, pt: 0 },
        fill: { color: styles.white },
      });
    }
    slide.addText(column.heading || '', {
      x: box.x + 0.25,
      y: box.y + 0.16,
      w: box.w - 0.6,
      h: 0.28,
      ...styles.heading,
      ...textBox,
    });
    slide.addText(column.subheading || '', {
      x: box.x + 0.25,
      y: box.y + 1.42,
      w: box.w - 0.45,
      h: 0.28,
      ...styles.subheading,
      ...textBox,
    });
    slide.addText(column.sectionTitle || '', {
      x: box.x + 0.25,
      y: box.y + 2.72,
      w: box.w - 0.45,
      h: 0.28,
      ...styles.sectionTitle,
      ...textBox,
    });
    slide.addText(resolveBulletText(column.items), {
      x: box.x + 0.25,
      y: box.y + 3.06,
      w: box.w - 0.45,
      h: 0.88,
      ...styles.bullets,
      ...textBox,
    });
  });

  return slide;
}

export default buildMcNumberedBulletColumnsSlide;
