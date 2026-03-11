import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

import { createSlidesAdapter } from '../../generator/postprocess/slides-adapter.js';
import { REPO_ROOT } from '../support.mjs';

export { REPO_ROOT };

export const ONBOARDING_OUTPUT_ROOT =
  process.env.ONBOARDING_OUTPUT_ROOT || path.join(REPO_ROOT, 'outputs', 'onboarding');
export const ONBOARDING_POLICY_ROOT = path.join(REPO_ROOT, 'onboarding', 'policies');
export const GOLDEN_ALL_LAYOUTS_PATH = path.join(
  REPO_ROOT,
  'fixtures',
  'harness',
  'golden',
  'all-layouts',
  'deckSpec.json',
);
export const DIFF_THRESHOLDS_PATH = path.join(
  ONBOARDING_POLICY_ROOT,
  'diff-thresholds.json',
);
export const DEFAULT_PREVIEW_WIDTH = 1600;
export const DEFAULT_PREVIEW_HEIGHT = 900;
export const DEFAULT_VISUAL_OVERFLOW_PAD_PX = 100;

/**
 * Parse CLI args into a stable flag map.
 *
 * @param {string[]} argv
 * @returns {Map<string, string|boolean>}
 */
export function parseArgMap(argv = []) {
  const args = new Map();
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      args.set(key, next);
      i += 1;
    } else {
      args.set(key, true);
    }
  }
  return args;
}

/**
 * Read JSON from disk.
 *
 * @param {string} filePath
 * @returns {any}
 */
export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/**
 * Write JSON with a trailing newline.
 *
 * @param {string} filePath
 * @param {any} value
 */
export function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

/**
 * Write text with a parent directory guard.
 *
 * @param {string} filePath
 * @param {string} value
 */
export function writeText(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value);
}

/**
 * Ensure a directory exists.
 *
 * @param {string} dirPath
 */
export function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

/**
 * Normalize a PNG for onboarding compare.
 *
 * @param {object} params
 * @returns {string}
 */
export function normalizePng({
  inputPath,
  outputPath,
  mode = 'preserve',
  width = null,
  height = null,
}) {
  const normalizeScript = path.join(REPO_ROOT, 'scripts', 'onboarding', 'normalize_png.py');
  ensureDir(path.dirname(outputPath));
  const args = [
    normalizeScript,
    '--input',
    inputPath,
    '--output',
    outputPath,
  ];
  if (mode === 'resize') {
    if (!Number.isFinite(width) || !Number.isFinite(height)) {
      throw new Error('normalizePng resize mode requires finite width and height.');
    }
    args.push('--resize', '--width', String(width), '--height', String(height));
  } else if (mode !== 'preserve') {
    throw new Error(`Unsupported normalizePng mode: ${mode}`);
  }
  const normalize = spawnSync(
    'python3',
    args,
    {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    },
  );
  if (normalize.status !== 0) {
    throw new Error(
      `Failed to normalize PNG.\n${normalize.stdout || ''}\n${normalize.stderr || ''}`.trim(),
    );
  }
  return outputPath;
}

/**
 * Convert a layout id to PascalCase for export names.
 *
 * @param {string} value
 * @returns {string}
 */
export function toPascalCase(value) {
  const normalized = String(value || '').trim();
  if (!/^[a-z][a-zA-Z0-9]+$/.test(normalized)) {
    throw new Error(
      'Expected --layout-id to be camelCase and start with a lowercase letter.',
    );
  }
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

/**
 * Load deterministic diff thresholds.
 *
 * @returns {object}
 */
export function loadDiffThresholds() {
  return readJson(DIFF_THRESHOLDS_PATH);
}

/**
 * Remove draft-only metadata before writing a canonical template layout entry.
 *
 * @param {object} candidateLayout
 * @returns {object}
 */
export function sanitizeCandidateLayout(candidateLayout) {
  const sanitizedLayout = JSON.parse(JSON.stringify(candidateLayout));
  delete sanitizedLayout.type;
  delete sanitizedLayout.family;
  delete sanitizedLayout.schemaVersion;
  return sanitizedLayout;
}

/**
 * Load a draft builder module from disk.
 *
 * @param {string} filePath
 * @param {string} layoutId
 * @returns {Promise<Function>}
 */
export async function loadDraftBuilder(filePath, layoutId) {
  const mod = await import(`${pathToFileURL(filePath).href}?t=${Date.now()}`);
  const pascal = toPascalCase(layoutId);
  const builder =
    mod.default ||
    mod[`build${pascal}`] ||
    mod.builder ||
    null;
  if (typeof builder !== 'function') {
    throw new Error(`Draft builder file does not export a function: ${filePath}`);
  }
  return builder;
}

/**
 * Capture a reference slide PNG using the same preview adapter as candidate rendering.
 *
 * @param {object} params
 * @returns {string}
 */
export function captureReferenceSlide({
  pptxPath,
  slideNumber,
  referencePngPath,
  width = DEFAULT_PREVIEW_WIDTH,
  height = DEFAULT_PREVIEW_HEIGHT,
}) {
  const adapter = createSlidesAdapter();
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kpmg-layout-reference-'));
  try {
    const preview = adapter.renderPreview({
      pptxPath,
      outputDir: tempDir,
      width,
      height,
    });
    if (preview?.status !== 'ok') {
      throw new Error(
        `Failed to render reference preview: ${preview?.reason || 'unknown_reason'}`,
      );
    }
    const sourcePng = path.join(tempDir, `slide-${Number(slideNumber)}.png`);
    if (!fs.existsSync(sourcePng)) {
      throw new Error(`Reference slide ${slideNumber} was not found in rendered preview output.`);
    }
    normalizePng({
      inputPath: sourcePng,
      outputPath: referencePngPath,
    });
    return referencePngPath;
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

/**
 * Run the onboarding evidence extractor for a selected slide.
 *
 * @param {object} params
 */
export function extractOnboardingEvidence({
  pptxPath,
  slideNumber,
  rawPath,
  normalizedPath,
  fingerprintPath,
}) {
  const scriptPath = path.join(REPO_ROOT, 'scripts', 'onboarding', 'extract_slide_seed.py');
  ensureDir(path.dirname(rawPath));
  ensureDir(path.dirname(normalizedPath));
  ensureDir(path.dirname(fingerprintPath));
  const args = [
    scriptPath,
    '--pptx',
    pptxPath,
    '--slide',
    String(slideNumber),
    '--raw-out',
    rawPath,
    '--normalized-out',
    normalizedPath,
    '--fingerprint-out',
    fingerprintPath,
  ];
  const result = spawnSync('python3', args, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    env: {
      ...process.env,
      PYTHONDONTWRITEBYTECODE: '1',
    },
  });
  if (result.status !== 0) {
    throw new Error(
      `Evidence extraction failed.\n${result.stdout || ''}\n${result.stderr || ''}`.trim(),
    );
  }
}

/**
 * Build postprocess options for deterministic candidate rendering.
 *
 * @param {object} paths
 * @param {boolean} withMontage
 * @returns {object}
 */
export function buildCandidatePostprocessOptions(paths, withMontage = false) {
  return {
    withPreview: true,
    withMontage,
    withVisualOverflow: true,
    previewWidth: DEFAULT_PREVIEW_WIDTH,
    previewHeight: DEFAULT_PREVIEW_HEIGHT,
    previewOutputDir: paths.candidatePreviewDir,
    montageOutputFile: paths.candidateMontagePath,
    montageCols: 1,
    montageLabelMode: 'none',
    visualOverflowPadPx: DEFAULT_VISUAL_OVERFLOW_PAD_PX,
  };
}

/**
 * Return blocking checks from a normalized QA report.
 *
 * @param {object} qa
 * @returns {object[]}
 */
export function getBlockingChecks(qa = {}) {
  return (qa?.checks || []).filter((check) => {
    const status = String(check?.status || '').trim();
    return Boolean(check?.blocking) && ['fail', 'error'].includes(status);
  });
}

/**
 * Run the compare helper script for reference vs candidate PNGs.
 *
 * @param {object} params
 * @returns {object}
 */
export function compareCandidateImages({
  referencePngPath,
  candidatePngPath,
  diffPngPath,
  diffJsonPath,
  scorecardPath,
}) {
  const scriptPath = path.join(REPO_ROOT, 'scripts', 'onboarding', 'compare_images.py');
  const result = spawnSync(
    'python3',
    [
      scriptPath,
      '--reference',
      referencePngPath,
      '--candidate',
      candidatePngPath,
      '--diff-out',
      diffPngPath,
      '--diff-json-out',
      diffJsonPath,
      '--scorecard-out',
      scorecardPath,
      '--thresholds',
      DIFF_THRESHOLDS_PATH,
    ],
    {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      env: {
        ...process.env,
        PYTHONDONTWRITEBYTECODE: '1',
      },
    },
  );
  if (result.status !== 0) {
    throw new Error(
      `Image compare failed.\n${result.stdout || ''}\n${result.stderr || ''}`.trim(),
    );
  }
  return {
    diff: readJson(diffJsonPath),
    scorecard: readJson(scorecardPath),
  };
}
