import { buildMcBulletRowsSlide } from 'file:///Users/rishi/Code/ai-tools/projects/kpmg-utils/kpmg-slidegen/generator/builders/onboarded/mcTwoBulletSlide.js';

export function buildMcFiveBulletSlide(pptx, slideSpec = {}, ctx = {}) {
  return buildMcBulletRowsSlide(pptx, slideSpec, ctx);
}

export default buildMcFiveBulletSlide;
