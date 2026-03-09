import path from 'node:path';

import {
  resolveBodyTextStyle,
  resolveHeadingTextStyle,
  resolveMajorHeadingFont,
  resolveTextBoxOptions,
  resolveTheme,
  resolveTokenTextStyle,
} from 'file:///Users/rishi/Code/ai-tools/projects/kpmg-utils/kpmg-slidegen/generator/helpers/theme.js';
import { toBodyRuns } from 'file:///Users/rishi/Code/ai-tools/projects/kpmg-utils/kpmg-slidegen/generator/helpers/bullets.js';
import { resolveTemplateAssetsDir } from 'file:///Users/rishi/Code/ai-tools/projects/kpmg-utils/kpmg-slidegen/generator/runtime/template-roots.js';

const TEMPLATE_ASSETS_DIR = resolveTemplateAssetsDir('kpmg-diligence');

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
    objectiveFill: resolvedTheme.colors.primary,
    cardFill: resolvedTheme.colors.neutral100,
    cardHeaderFill: resolvedTheme.colors.kpmgPurple,
    titleWhite: {
      fontFace: headingFont,
      fontSize: 18,
      bold: true,
      color: resolvedTheme.colors.white,
      margin: 0,
      fit: 'shrink',
      valign: 'mid',
    },
    body: {
      ...resolveBodyTextStyle(resolvedTheme),
      fontSize: 15,
      color: resolvedTheme.colors.kpmgBlue,
      margin: 0,
      fit: 'shrink',
    },
  };
}

export function buildMcProjectOverviewMetrics(pptx, slideSpec = {}, ctx = {}) {
  const {
    title,
    objectiveTitle,
    objectiveText,
    contextTitle,
    contextItems = [],
    metricsTitle,
    metricsItems = [],
  } = slideSpec;
  const { geometry = {}, masterName, theme } = ctx;
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const styles = resolveStyles(theme);
  const textBox = resolveTextBoxOptions(theme, { margin: 0, wrap: true });
  const typography = geometry?.typography || {};
  if (!geometry.titleBox || !typography.objectiveHeaderBox || !typography.objectiveBodyBox || !typography.contextCard || !typography.metricsCard) {
    throw new Error('Missing required geometry for mcProjectOverviewMetrics');
  }

  slide.addText(title || '', { ...geometry.titleBox, ...styles.title, ...textBox });

  slide.addShape(pptx.ShapeType.rect, {
    ...typography.objectiveHeaderBox,
    line: { color: styles.objectiveFill, pt: 0 },
    fill: { color: styles.objectiveFill },
  });
  slide.addShape(pptx.ShapeType.rect, {
    ...typography.objectiveBodyBox,
    line: { color: styles.cardFill, pt: 0 },
    fill: { color: styles.cardFill },
  });
  slide.addText(objectiveTitle || '', {
    x: typography.objectiveHeaderBox.x + 0.2,
    y: typography.objectiveHeaderBox.y,
    w: 1.55,
    h: typography.objectiveHeaderBox.h,
    ...styles.titleWhite,
    ...textBox,
  });
  slide.addImage({
    path: path.join(TEMPLATE_ASSETS_DIR, 'mc-project-overview-objective-icon.svg'),
    ...typography.objectiveIconBox,
  });
  slide.addText(objectiveText || '', {
    ...typography.objectiveTextBox,
    ...styles.body,
    ...textBox,
  });

  [
    {
      card: typography.contextCard,
      title: contextTitle,
      iconAsset: 'mc-project-overview-context-icon.png',
      items: contextItems,
    },
    {
      card: typography.metricsCard,
      title: metricsTitle,
      iconAsset: 'mc-project-overview-metrics-icon.svg',
      items: metricsItems,
    },
  ].forEach(({ card, title: cardTitle, iconAsset, items }) => {
    slide.addShape(pptx.ShapeType.rect, {
      ...card.headerBox,
      line: { color: styles.cardHeaderFill, pt: 0 },
      fill: { color: styles.cardHeaderFill },
    });
    slide.addShape(pptx.ShapeType.rect, {
      ...card.bodyBox,
      line: { color: styles.cardFill, pt: 0 },
      fill: { color: styles.cardFill },
    });
    slide.addText(cardTitle || '', {
      x: card.headerBox.x + 0.2,
      y: card.headerBox.y,
      w: card.headerBox.w - 1,
      h: card.headerBox.h,
      ...styles.titleWhite,
      ...textBox,
    });
    slide.addImage({
      path: path.join(TEMPLATE_ASSETS_DIR, iconAsset),
      ...card.iconBox,
    });
    slide.addText(toBodyRuns(items, 'bullets', { theme }), {
      ...card.itemsBox,
      ...styles.body,
      ...textBox,
    });
  });

  return slide;
}

export default buildMcProjectOverviewMetrics;
