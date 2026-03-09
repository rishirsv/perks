import path from 'node:path';

import {
  resolveBodyTextStyle,
  resolveHeadingTextStyle,
  resolveMajorHeadingFont,
  resolveTextBoxOptions,
  resolveTheme,
  resolveTokenTextStyle,
} from '../../helpers/theme.js';
import { resolveTemplateAssetsDir } from '../../runtime/template-roots.js';

const TEMPLATE_ASSETS_DIR = resolveTemplateAssetsDir('kpmg-diligence');
const ICON_ASSETS = Object.freeze([
  'mc-scope-statement-icon-2.png',
  'mc-scope-statement-icon-4.png',
  'mc-scope-statement-icon-3.png',
  'mc-scope-statement-icon-1.png',
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
      fontSize: 29,
      bold: true,
      margin: 0,
      fit: 'shrink',
    },
    body: {
      ...resolveBodyTextStyle(resolvedTheme),
      fontSize: 16,
      color: resolvedTheme.colors.kpmgBlue,
      margin: 0,
      fit: 'shrink',
      breakLine: true,
    },
    circleLine: resolvedTheme.colors.kpmgBlue,
    white: resolvedTheme.colors.white,
  };
}

export function buildMcScopeStatement(pptx, slideSpec = {}, ctx = {}) {
  const { title, objectives = [] } = slideSpec;
  const { geometry = {}, masterName, theme } = ctx;
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const styles = resolveStyles(theme);
  const textBox = resolveTextBoxOptions(theme, { margin: 0, wrap: true });
  const rows = Array.isArray(geometry?.typography?.rows) ? geometry.typography.rows.slice(0, 4) : [];
  if (!geometry.titleBox || rows.length < 4) {
    throw new Error('Missing required geometry for mcScopeStatement');
  }

  slide.addText(title || '', {
    ...geometry.titleBox,
    ...styles.title,
    ...textBox,
  });

  rows.forEach((row, index) => {
    const item = objectives[index] || '';
    slide.addShape(pptx.ShapeType.ellipse, {
      ...row.circleBox,
      line: { color: styles.circleLine, pt: 1.25 },
      fill: { color: styles.white, transparency: 100 },
    });
    slide.addImage({
      path: path.join(TEMPLATE_ASSETS_DIR, ICON_ASSETS[index]),
      ...row.iconBox,
    });
    slide.addText(String(item), {
      ...row.textBox,
      ...styles.body,
      ...textBox,
    });
  });

  return slide;
}

export default buildMcScopeStatement;
