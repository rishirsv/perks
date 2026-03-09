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
    kpmgBlue: resolvedTheme.colors.kpmgBlue,
    neutral300: resolvedTheme.colors.neutral300,
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
    label: {
      ...resolveHeadingTextStyle(resolvedTheme, { colorKey: 'white' }),
      fontFace: headingFont,
      fontSize: 16,
      bold: true,
      align: 'center',
      valign: 'mid',
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
  };
}

export function buildMcExecutiveSummaryKeyValue(pptx, slideSpec = {}, ctx = {}) {
  const { title, columns = [] } = slideSpec;
  const { geometry = {}, masterName, theme } = ctx;
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const styles = resolveStyles(theme);
  const textBox = resolveTextBoxOptions(theme, { margin: 0, wrap: true });
  const rows = Array.isArray(geometry.columnBoxes) ? geometry.columnBoxes.slice(0, 4) : [];
  if (!geometry.titleBox || rows.length < 4) {
    throw new Error('Missing required geometry for mcExecutiveSummaryKeyValue');
  }

  slide.addText(title || '', { ...geometry.titleBox, ...styles.title, ...textBox });

  rows.forEach((row, index) => {
    const column = columns[index] || {};
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.61,
      y: row.y,
      w: 1.68,
      h: row.h,
      line: { color: styles.kpmgBlue, pt: 0 },
      fill: { color: styles.kpmgBlue },
    });
    if (index < rows.length - 1) {
      slide.addShape(pptx.ShapeType.line, {
        x: 0.61,
        y: row.y + row.h + 0.07,
        w: 12.12,
        h: 0,
        line: { color: styles.neutral300, pt: 1, dash: 'dash' },
      });
    }
    slide.addText(column.heading || '', {
      x: 0.69,
      y: row.y + 0.1,
      w: 1.52,
      h: row.h - 0.2,
      ...styles.label,
      ...textBox,
    });
    slide.addText(Array.isArray(column.body) ? column.body.join('\n') : String(column.body || ''), {
      x: 2.46,
      y: row.y + 0.18,
      w: 10.27,
      h: row.h - 0.24,
      ...styles.body,
      ...textBox,
    });
  });

  return slide;
}

export default buildMcExecutiveSummaryKeyValue;
