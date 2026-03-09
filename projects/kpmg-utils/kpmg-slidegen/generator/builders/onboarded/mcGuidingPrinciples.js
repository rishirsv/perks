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
    circleText: {
      fontFace: headingFont,
      fontSize: 14,
      bold: true,
      color: resolvedTheme.colors.white,
      align: 'center',
      valign: 'mid',
      margin: 0,
      fit: 'shrink',
    },
    body: {
      ...resolveBodyTextStyle(resolvedTheme),
      fontSize: 16,
      color: resolvedTheme.colors.kpmgBlue,
      margin: 0,
      fit: 'shrink',
    },
    divider: resolvedTheme.colors.neutral300,
    connector: resolvedTheme.colors.kpmgBlue,
    circleFills: [
      resolvedTheme.colors.primary,
      resolvedTheme.colors.kpmgCyan,
      resolvedTheme.colors.kpmgBlue,
      resolvedTheme.colors.kpmgPurple,
    ],
  };
}

export function buildMcGuidingPrinciples(pptx, slideSpec = {}, ctx = {}) {
  const { title, principleLabels = [], principleBodies = [] } = slideSpec;
  const { geometry = {}, masterName, theme } = ctx;
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const styles = resolveStyles(theme);
  const textBox = resolveTextBoxOptions(theme, { margin: 0, wrap: true });
  const rows = Array.isArray(geometry?.typography?.rows) ? geometry.typography.rows.slice(0, 4) : [];
  if (!geometry.titleBox || rows.length < 4) {
    throw new Error('Missing required geometry for mcGuidingPrinciples');
  }

  slide.addText(title || '', {
    ...geometry.titleBox,
    ...styles.title,
    ...textBox,
  });

  rows.forEach((row, index) => {
    const fill = styles.circleFills[index] || styles.circleFills[styles.circleFills.length - 1];
    slide.addShape(pptx.ShapeType.ellipse, {
      ...row.circleBox,
      line: { color: fill, pt: 0 },
      fill: { color: fill },
    });
    slide.addText(String(principleLabels[index] || ''), {
      ...row.circleBox,
      ...styles.circleText,
      ...textBox,
    });
    slide.addText(String(principleBodies[index] || ''), {
      ...row.textBox,
      ...styles.body,
      ...textBox,
    });
    if (row.dividerBox) {
      slide.addShape(pptx.ShapeType.line, {
        x: row.dividerBox.x,
        y: row.dividerBox.y,
        w: row.dividerBox.w,
        h: 0,
        line: { color: styles.divider, pt: 1, dash: 'dash' },
      });
    }
    if (row.connectorBox) {
      slide.addShape(pptx.ShapeType.line, {
        x: row.connectorBox.x,
        y: row.connectorBox.y,
        w: 0,
        h: row.connectorBox.h,
        line: { color: styles.connector, pt: 1.25, endArrowType: 'triangle' },
      });
    }
  });

  return slide;
}

export default buildMcGuidingPrinciples;
