import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const DEFAULT_TIMEOUT_MS = 180000;

/**
 * Resolve a usable slides skill directory.
 * @returns {string|null}
 */
function resolveSlidesDir() {
  const envDir = process.env.SLIDES_SKILL_DIR;
  const candidates = [
    envDir,
    '/code/ai-tools/.agents/oai-skills/slides',
    '/Users/rishi/Code/ai-tools/.agents/oai-skills/slides',
    '/Users/rishi/Code/ai-tools/.agents/skills/oai-skills/slides',
    '/Users/rishi/code/ai-tools/.agents/skills/oai-skills/slides',
  ].filter(Boolean);
  for (const dir of candidates) {
    if (!fs.existsSync(dir)) continue;
    const required = ['render_slides.py', 'create_montage.py', 'slides_test.py'];
    if (required.every((name) => fs.existsSync(path.join(dir, name)))) return dir;
  }
  return null;
}

/**
 * Parse failing slide indices from slides_test stdout.
 * @param {string} output
 * @returns {number[]}
 */
function parseFailingSlides(output = '') {
  const match = output.match(/indexing\):\s*([0-9,\s]+)/i);
  if (!match) return [];
  return match[1]
    .split(',')
    .map((v) => Number(v.trim()))
    .filter((v) => Number.isInteger(v) && v > 0);
}

/**
 * Build a resilient adapter around embedded oai-skills/slides scripts.
 * All methods return status objects; none throw.
 * @returns {object}
 */
export function createSlidesAdapter() {
  const slidesDir = resolveSlidesDir();
  const python = process.env.PYTHON_BIN || 'python3';
  const scripts = {
    render: slidesDir ? path.join(slidesDir, 'render_slides.py') : null,
    montage: slidesDir ? path.join(slidesDir, 'create_montage.py') : null,
    overflow: slidesDir ? path.join(slidesDir, 'slides_test.py') : null,
  };
  const pythonExists =
    spawnSync('bash', ['-lc', `command -v ${python} >/dev/null 2>&1`], { stdio: 'ignore' }).status === 0;

  const availability = (() => {
    if (!slidesDir) {
      return {
        available: false,
        reason: 'slides_skill_dir_not_found',
        slidesDir: null,
        python,
      };
    }
    if (!pythonExists) {
      return {
        available: false,
        reason: 'python_not_found',
        slidesDir,
        python,
      };
    }
    return {
      available: true,
      reason: null,
      slidesDir,
      python,
    };
  })();

  function runScript(scriptPath, args = []) {
    if (!availability.available) {
      return {
        ok: false,
        status: 'skipped',
        reason: availability.reason || 'unavailable',
        stdout: '',
        stderr: '',
        code: null,
      };
    }
    const result = spawnSync(python, [scriptPath, ...args], {
      cwd: slidesDir,
      encoding: 'utf8',
      timeout: DEFAULT_TIMEOUT_MS,
    });
    const code = result.status;
    return {
      ok: code === 0,
      status: code === 0 ? 'ok' : 'error',
      reason: code === 0 ? null : 'script_failed',
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      code,
    };
  }

  return {
    detectAvailability() {
      return { ...availability };
    },

    renderPreview({ pptxPath, outputDir, width = 1600, height = 900 }) {
      if (!availability.available) {
        return {
          status: 'skipped',
          reason: availability.reason,
          outputDir,
          slideImageCount: 0,
        };
      }
      fs.mkdirSync(outputDir, { recursive: true });
      const run = runScript(scripts.render, [
        pptxPath,
        '--output_dir',
        outputDir,
        '--width',
        String(width),
        '--height',
        String(height),
      ]);
      if (!run.ok) {
        return {
          status: 'error',
          reason: run.reason,
          outputDir,
          slideImageCount: 0,
          stderr: run.stderr,
        };
      }
      const files = fs.readdirSync(outputDir).filter((name) => /^slide-\d+\.png$/i.test(name));
      return {
        status: 'ok',
        reason: null,
        outputDir,
        slideImageCount: files.length,
        width,
        height,
      };
    },

    createMontage({ inputDir, outputFile, numCol = 5, labelMode = 'number' }) {
      if (!availability.available) {
        return {
          status: 'skipped',
          reason: availability.reason,
          path: outputFile,
        };
      }
      fs.mkdirSync(path.dirname(outputFile), { recursive: true });
      const run = runScript(scripts.montage, [
        '--input_dir',
        inputDir,
        '--output_file',
        outputFile,
        '--num_col',
        String(numCol),
        '--label_mode',
        labelMode,
      ]);
      if (!run.ok) {
        return {
          status: 'error',
          reason: run.reason,
          path: outputFile,
          stderr: run.stderr,
        };
      }
      return {
        status: fs.existsSync(outputFile) ? 'ok' : 'error',
        reason: fs.existsSync(outputFile) ? null : 'montage_not_created',
        path: outputFile,
        numCol,
        labelMode,
      };
    },

    runVisualOverflow({ pptxPath, width = 1600, height = 900, padPx = 100 }) {
      if (!availability.available) {
        return {
          status: 'skipped',
          reason: availability.reason,
          failingSlides: [],
          imagePaths: [],
        };
      }
      const run = runScript(scripts.overflow, [
        pptxPath,
        '--width',
        String(width),
        '--height',
        String(height),
        '--pad_px',
        String(padPx),
      ]);
      const output = `${run.stdout || ''}\n${run.stderr || ''}`;
      const failingSlides = parseFailingSlides(output);
      const imagePaths = output
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.endsWith('.png') && fs.existsSync(line));

      if (/Test passed\./i.test(output)) {
        return {
          status: 'pass',
          reason: null,
          failingSlides: [],
          imagePaths: [],
        };
      }
      if (/Slides with content overflowing/i.test(output) || failingSlides.length > 0) {
        return {
          status: 'fail',
          reason: 'overflow_detected',
          failingSlides,
          imagePaths,
        };
      }
      if (!run.ok) {
        return {
          status: 'error',
          reason: 'script_failed',
          failingSlides: [],
          imagePaths: [],
          stderr: run.stderr,
        };
      }
      return {
        status: 'error',
        reason: 'unknown_output',
        failingSlides: [],
        imagePaths: [],
      };
    },
  };
}
