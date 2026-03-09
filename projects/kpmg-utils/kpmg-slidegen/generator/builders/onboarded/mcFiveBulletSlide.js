import { buildMcBulletRowsSlide } from './mcTwoBulletSlide.js';

export function buildMcFiveBulletSlide(pptx, slideSpec = {}, ctx = {}) {
  return buildMcBulletRowsSlide(pptx, slideSpec, ctx);
}

export default buildMcFiveBulletSlide;
