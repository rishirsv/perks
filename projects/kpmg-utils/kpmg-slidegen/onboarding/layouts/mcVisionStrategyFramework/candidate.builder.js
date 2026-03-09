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
const ICON_ASSETS = Object.freeze([
  'mc-vision-framework-icon-1.png',
  'mc-vision-framework-icon-2.png',
  'mc-vision-framework-icon-4.png',
  'mc-vision-framework-icon-3.png',
]);

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
    prompt: {
      ...resolveHeadingTextStyle(resolvedTheme, { colorKey: 'kpmgBlue' }),
      fontFace: headingFont,
      fontSize: 15,
      bold: true,
      margin: 0,
      fit: 'shrink',
    },
    roofText: {
      ...resolveBodyTextStyle(resolvedTheme),
      fontSize: 16,
      color: resolvedTheme.colors.white,
      align: 'center',
      valign: 'mid',
      margin: 0,
      fit: 'shrink',
    },
    bandHeading: {
      ...resolveHeadingTextStyle(resolvedTheme, { colorKey: 'kpmgBlue' }),
      fontFace: headingFont,
      fontSize: 14.5,
      bold: true,
      margin: 0,
      fit: 'shrink',
    },
    bandBody: {
      ...resolveBodyTextStyle(resolvedTheme),
      fontSize: 13.5,
      color: resolvedTheme.colors.kpmgBlue,
      margin: 0,
      fit: 'shrink',
    },
    roofFill: resolvedTheme.colors.primary,
    bandFill: resolvedTheme.colors.neutral100,
  };
}

export function buildMcVisionStrategyFramework(pptx, slideSpec = {}, ctx = {}) {
  const { title, prompts = [], visionText, bandHeadings = [], bandBodies = [] } = slideSpec;
  const { geometry = {}, masterName, theme } = ctx;
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const styles = resolveStyles(theme);
  const textBox = resolveTextBoxOptions(theme, { margin: 0, wrap: true });
  const typography = geometry?.typography || {};
  const promptRows = Array.isArray(typography.promptRows) ? typography.promptRows.slice(0, 4) : [];
  const bandRows = Array.isArray(typography.bandRows) ? typography.bandRows.slice(0, 3) : [];
  if (!geometry.titleBox || !typography.roofBox || !typography.roofTextBox || promptRows.length < 4 || bandRows.length < 3) {
    throw new Error('Missing required geometry for mcVisionStrategyFramework');
  }

  slide.addText(title || '', { ...geometry.titleBox, ...styles.title, ...textBox });

  slide.addShape(pptx.ShapeType.pentagon, {
    ...typography.roofBox,
    line: { color: styles.roofFill, pt: 0 },
    fill: { color: styles.roofFill },
  });
  slide.addText(visionText || '', {
    ...typography.roofTextBox,
    ...styles.roofText,
    ...textBox,
  });

  promptRows.forEach((row, index) => {
    slide.addText(prompts[index] || '', {
      ...row.promptBox,
      ...styles.prompt,
      ...textBox,
    });
    slide.addImage({
      path: path.join(TEMPLATE_ASSETS_DIR, ICON_ASSETS[index]),
      ...row.iconBox,
    });
  });

  bandRows.forEach((row, index) => {
    slide.addShape(pptx.ShapeType.rect, {
      ...row.panelBox,
      line: { color: styles.bandFill, pt: 0 },
      fill: { color: styles.bandFill },
    });
    slide.addText(String(bandHeadings[index] || ''), {
      ...row.headingBox,
      ...styles.bandHeading,
      ...textBox,
    });
    slide.addText(String(bandBodies[index] || ''), {
      ...row.bodyBox,
      ...styles.bandBody,
      ...textBox,
    });
  });

  return slide;
}

export default buildMcVisionStrategyFramework;
