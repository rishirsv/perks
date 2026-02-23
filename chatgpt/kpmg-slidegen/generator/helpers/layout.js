import { FOOTER_SAFE_TOP } from './footer.js';
import { clampBoxToBottom } from './geometry.js';

const STRAP_GAP = 0.06;

export function normalizeBodyStyle(bodyStyle) {
  const normalized = String(bodyStyle || '').trim().toLowerCase();
  return normalized === 'paragraph' || normalized === 'paragraphs' ? 'paragraphs' : 'bullets';
}

export function computeStrapShift(strapBox, contentTop, gap = STRAP_GAP) {
  if (!strapBox || !Number.isFinite(contentTop)) return 0;
  return Math.max(0, (strapBox.y + strapBox.h + gap) - contentTop);
}

export function shiftBox(box, shift = 0) {
  if (!box || !shift) return box;
  return { ...box, y: box.y + shift, h: box.h - shift };
}

export function footerSafeTopForMaster(masterName) {
  return masterName === 'KPMG_WHITE' ? FOOTER_SAFE_TOP : null;
}

export function clampToMasterFooter(box, masterName, pad = 0) {
  const safeTop = footerSafeTopForMaster(masterName);
  if (!safeTop) return box;
  return clampBoxToBottom(box, safeTop - pad);
}
