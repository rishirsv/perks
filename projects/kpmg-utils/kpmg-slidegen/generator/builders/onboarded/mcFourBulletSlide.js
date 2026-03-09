import { buildMcBulletRowsSlide } from './mcTwoBulletSlide.js';

export function buildMcFourBulletSlide(pptx, slideSpec = {}, ctx = {}) {
  return buildMcBulletRowsSlide(pptx, slideSpec, ctx);
}

export default buildMcFourBulletSlide;
