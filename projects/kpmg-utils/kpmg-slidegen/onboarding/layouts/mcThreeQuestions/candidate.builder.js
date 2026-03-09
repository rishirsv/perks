import {
  resolveBodyTextStyle,
  resolveHeadingTextStyle,
  resolveMajorHeadingFont,
  resolveTextBoxOptions,
  resolveTheme,
  resolveTokenTextStyle,
} from 'file:///Users/rishi/Code/ai-tools/projects/kpmg-utils/kpmg-slidegen/generator/helpers/theme.js';
import { toBodyRuns } from 'file:///Users/rishi/Code/ai-tools/projects/kpmg-utils/kpmg-slidegen/generator/helpers/bullets.js';

function resolveStyles(theme = null) {
  const resolvedTheme = resolveTheme(theme);
  const headingFont = resolveMajorHeadingFont(resolvedTheme);
  return {
    title: {
      ...resolveTokenTextStyle(resolvedTheme, 'slideTitle', {
        ...resolveHeadingTextStyle(resolvedTheme, { colorKey: 'kpmgBlue' }),
      }),
      fontFace: headingFont,
      fontSize: 29,
      bold: true,
      margin: 0,
      fit: 'shrink',
    },
    sectionHeading: {
      ...resolveHeadingTextStyle(resolvedTheme, { colorKey: 'kpmgBlue' }),
      fontFace: headingFont,
      fontSize: 18,
      bold: true,
      margin: 0,
      fit: 'shrink',
    },
    body: {
      ...resolveBodyTextStyle(resolvedTheme),
      fontSize: 13.5,
      color: resolvedTheme.colors.kpmgBlue,
      margin: 0,
      fit: 'shrink',
    },
    panelFill: resolvedTheme.colors.neutral100,
    numberFill: resolvedTheme.colors.primary,
    question: {
      ...resolveBodyTextStyle(resolvedTheme),
      fontSize: 14,
      color: resolvedTheme.colors.kpmgBlue,
      margin: 0,
      fit: 'shrink',
    },
    number: {
      fontFace: headingFont,
      fontSize: 18,
      bold: true,
      color: resolvedTheme.colors.white,
      align: 'center',
      valign: 'mid',
      margin: 0,
      fit: 'shrink',
    },
  };
}

export function buildMcThreeQuestions(pptx, slideSpec = {}, ctx = {}) {
  const {
    title,
    situationTitle,
    situationPoints = [],
    questionsTitle,
    questions = [],
  } = slideSpec;
  const { geometry = {}, masterName, theme } = ctx;
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const styles = resolveStyles(theme);
  const textBox = resolveTextBoxOptions(theme, { margin: 0, wrap: true });
  const typography = geometry?.typography || {};
  const questionRows = Array.isArray(typography.questionRows) ? typography.questionRows.slice(0, 3) : [];
  if (!geometry.titleBox || !geometry.leftHeadingBox || !typography.leftBodyBox || !typography.panelBox || !typography.panelHeadingBox || questionRows.length < 3) {
    throw new Error('Missing required geometry for mcThreeQuestions');
  }

  slide.addText(title || '', { ...geometry.titleBox, ...styles.title, ...textBox });
  slide.addText(situationTitle || '', { ...geometry.leftHeadingBox, ...styles.sectionHeading, ...textBox });
  slide.addText(toBodyRuns(situationPoints, 'bullets', { theme }), {
    ...typography.leftBodyBox,
    ...styles.body,
    ...textBox,
  });

  slide.addShape(pptx.ShapeType.rect, {
    ...typography.panelBox,
    line: { color: styles.panelFill, pt: 0 },
    fill: { color: styles.panelFill },
  });
  slide.addText(questionsTitle || '', {
    ...typography.panelHeadingBox,
    ...styles.sectionHeading,
    ...textBox,
  });

  questionRows.forEach((row, index) => {
    const question = questions[index] || '';
    slide.addShape(pptx.ShapeType.ellipse, {
      ...row.circleBox,
      line: { color: styles.numberFill, pt: 0 },
      fill: { color: styles.numberFill },
    });
    slide.addText(String(index + 1), {
      ...row.circleBox,
      ...styles.number,
      ...textBox,
    });
    slide.addText(String(question), {
      ...row.textBox,
      ...styles.question,
      ...textBox,
    });
  });

  return slide;
}

export default buildMcThreeQuestions;
