import { buildMcBulletRowsSlide } from './mcTwoBulletSlide.js';

export function buildMcThreeBulletSlide(pptx, slideSpec = {}, ctx = {}) {
  return buildMcBulletRowsSlide(pptx, slideSpec, ctx);
}

export default buildMcThreeBulletSlide;
