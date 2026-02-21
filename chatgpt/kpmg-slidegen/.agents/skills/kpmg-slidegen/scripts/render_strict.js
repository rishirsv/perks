#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function parseArgs(argv) {
  const args = new Map();
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (next && !next.startsWith('--')) {
      args.set(key, next);
      index += 1;
    } else {
      args.set(key, true);
    }
  }
  return args;
}

function isRepoRoot(candidate) {
  return (
    fs.existsSync(path.join(candidate, 'generator', 'index.js')) &&
    fs.existsSync(path.join(candidate, 'templates', 'kpmg-diligence', 'package', 'layouts.json'))
  );
}

function findRepoRoot(startDir = process.cwd()) {
  let current = path.resolve(startDir);
  while (true) {
    if (isRepoRoot(current)) return current;
    const parent = path.dirname(current);
    if (parent === current) {
      throw new Error(
        'Unable to find repo root containing generator/index.js and templates/kpmg-diligence/package/layouts.json',
      );
    }
    current = parent;
  }
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function stampNow(date = new Date()) {
  return [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate()),
  ].join('-') +
    '_' +
    [pad(date.getUTCHours()), pad(date.getUTCMinutes()), pad(date.getUTCSeconds())].join('');
}

function slugify(rawValue) {
  return String(rawValue || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

function ensureRunDir({ repoRoot, runId, slug }) {
  const safeRunId = runId || (() => {
    const safeSlug = slugify(slug);
    const stamp = stampNow();
    return safeSlug ? `${stamp}-${safeSlug}` : stamp;
  })();

  const runDir = path.join(repoRoot, 'outputs', 'runs', safeRunId);
  fs.mkdirSync(runDir, { recursive: true });
  return { runId: safeRunId, runDir };
}

const BOILERPLATE_LINE_PATTERNS = [
  /^diligence focus:/i,
  /^validate margin trajectory,/i,
  /^assess customer concentration,/i,
  /^quantify working capital impacts/i,
  /^stress-test downside scenarios/i,
];

function normalizeBodyLine(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().toLowerCase();
}

function collectBodyArrays(slide) {
  const arrays = [];
  if (!slide || typeof slide !== 'object') return arrays;
  if (Array.isArray(slide.body)) arrays.push(slide.body);
  if (slide.content && typeof slide.content === 'object' && Array.isArray(slide.content.body)) {
    arrays.push(slide.content.body);
  }
  return arrays;
}

function dedupeRepeatedBoilerplate(deckSpec, options = {}) {
  const minRepeatCount = Number(options.minRepeatCount || 4);
  const lineCounts = new Map();

  for (const slide of Array.isArray(deckSpec?.slides) ? deckSpec.slides : []) {
    for (const body of collectBodyArrays(slide)) {
      for (const line of body) {
        const normalized = normalizeBodyLine(line);
        if (!normalized) continue;
        lineCounts.set(normalized, (lineCounts.get(normalized) || 0) + 1);
      }
    }
  }

  const removableLines = new Set();
  for (const [line, count] of lineCounts.entries()) {
    if (count < minRepeatCount) continue;
    if (BOILERPLATE_LINE_PATTERNS.some((pattern) => pattern.test(line))) {
      removableLines.add(line);
    }
  }

  const seenRemovable = new Set();
  const trimmedSlideIndexes = new Set();
  let removedLineCount = 0;

  for (let slideIndex = 0; slideIndex < (Array.isArray(deckSpec?.slides) ? deckSpec.slides.length : 0); slideIndex += 1) {
    const slide = deckSpec.slides[slideIndex];
    for (const body of collectBodyArrays(slide)) {
      const original = [...body];
      const next = [];
      let tentativeRemoved = 0;
      for (const line of body) {
        const normalized = normalizeBodyLine(line);
        if (!normalized || !removableLines.has(normalized)) {
          next.push(line);
          continue;
        }
        if (!seenRemovable.has(normalized)) {
          seenRemovable.add(normalized);
          next.push(line);
          continue;
        }
        tentativeRemoved += 1;
      }

      const nextText = next.filter((line) => typeof line === 'string').join(' ');
      const keepsMinimumBody = next.length >= 4 && nextText.length >= 180;

      if (keepsMinimumBody) {
        body.length = 0;
        body.push(...next);
        removedLineCount += tentativeRemoved;
        if (tentativeRemoved > 0) trimmedSlideIndexes.add(slideIndex + 1);
      } else {
        body.length = 0;
        body.push(...original);
      }
    }
  }

  return {
    minRepeatCount,
    removedLineCount,
    trimmedSlides: Array.from(trimmedSlideIndexes).sort((a, b) => a - b),
    trackedBoilerplateLines: Array.from(removableLines.values()).sort(),
  };
}

function ensureBackCoverLast(deckSpec) {
  const slides = Array.isArray(deckSpec?.slides) ? deckSpec.slides : null;
  if (!slides || slides.length === 0) {
    return { movedToTail: 0, originalIndexes: [] };
  }

  const backCoverIndexes = [];
  const nonBackCover = [];
  const backCover = [];

  slides.forEach((slide, index) => {
    if (slide && slide.type === 'backCover') {
      backCover.push(slide);
      backCoverIndexes.push(index + 1);
    } else {
      nonBackCover.push(slide);
    }
  });

  if (backCover.length === 0) {
    return { movedToTail: 0, originalIndexes: [] };
  }

  slides.length = 0;
  slides.push(...nonBackCover, ...backCover);

  const finalBackCoverStart = nonBackCover.length + 1;
  const alreadyAtTail =
    backCoverIndexes.length === backCover.length &&
    backCoverIndexes.every((index, offset) => index === finalBackCoverStart + offset);

  return {
    movedToTail: alreadyAtTail ? 0 : backCover.length,
    originalIndexes: backCoverIndexes,
  };
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);

  if (args.get('help')) {
    console.log(
      'Usage: node scripts/render_strict.js --in <deckSpec.json> [--repo-root <path>] [--run-id <id>] [--slug <slug>] [--template <name>] [--allow-sparse] [--skip-overlap] [--allow-repeated-boilerplate] [--boilerplate-repeat-threshold <n>]',
    );
    process.exit(0);
  }

  const input = args.get('in');
  if (!input) {
    console.error('Missing required argument: --in <deckSpec.json>');
    process.exit(2);
  }

  const inputPath = path.resolve(String(input));
  if (!fs.existsSync(inputPath)) {
    console.error(`Input deckSpec not found: ${inputPath}`);
    process.exit(2);
  }

  const repoRoot = args.get('repo-root')
    ? path.resolve(String(args.get('repo-root')))
    : findRepoRoot();

  if (!isRepoRoot(repoRoot)) {
    console.error(`Invalid repo root: ${repoRoot}`);
    process.exit(2);
  }

  const template = String(args.get('template') || 'kpmg-diligence');
  const allowSparse = Boolean(args.get('allow-sparse'));
  const skipOverlap = Boolean(args.get('skip-overlap'));
  const allowRepeatedBoilerplate = Boolean(args.get('allow-repeated-boilerplate'));
  const boilerplateRepeatThreshold = Number(args.get('boilerplate-repeat-threshold') || 4);

  const { runId, runDir } = ensureRunDir({
    repoRoot,
    runId: args.get('run-id') ? String(args.get('run-id')) : null,
    slug: args.get('slug') ? String(args.get('slug')) : null,
  });

  const runDeckSpec = path.join(runDir, 'deckSpec.json');
  const outPptx = path.join(runDir, 'deck.pptx');
  const qaOut = path.join(runDir, 'qaReport.json');

  const deckSpec = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const boilerplateCleanup = allowRepeatedBoilerplate
    ? {
        enabled: false,
        reason: 'disabled by --allow-repeated-boilerplate',
      }
    : {
        enabled: true,
        ...dedupeRepeatedBoilerplate(deckSpec, {
          minRepeatCount: Number.isFinite(boilerplateRepeatThreshold) ? boilerplateRepeatThreshold : 4,
        }),
      };

  const backCoverPlacement = ensureBackCoverLast(deckSpec);

  fs.writeFileSync(runDeckSpec, `${JSON.stringify(deckSpec, null, 2)}\n`, 'utf8');

  const command = [
    'generator/index.js',
    '--in',
    runDeckSpec,
    '--out',
    outPptx,
    '--qa-out',
    qaOut,
    '--template',
    template,
  ];

  if (allowSparse) command.push('--allow-sparse');
  if (skipOverlap) command.push('--skip-overlap');

  const result = spawnSync(process.execPath, command, {
    cwd: repoRoot,
    stdio: 'inherit',
  });

  const status = result.status ?? 1;
  if (status !== 0) {
    process.exit(status);
  }

  const qa = JSON.parse(fs.readFileSync(qaOut, 'utf8'));
  const severeCount = Number(qa?.overlapSummary?.severeCount || 0);
  const gateFailures = [];

  if (qa?.valid !== true) {
    gateFailures.push('qaReport.valid is false');
  }

  if (Array.isArray(qa?.errors) && qa.errors.length > 0) {
    gateFailures.push(`qaReport.errors has ${qa.errors.length} entries`);
  }

  if (!skipOverlap && severeCount > 0) {
    gateFailures.push(`overlapSummary.severeCount is ${severeCount}`);
  }

  if (gateFailures.length > 0) {
    console.error('Render gating failed:');
    for (const failure of gateFailures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  const summary = {
    repoRoot,
    runId,
    runDir,
    deckSpec: runDeckSpec,
    outputPptx: outPptx,
    qaReport: qaOut,
    overlapSevereCount: severeCount,
    warningCount: Array.isArray(qa?.warnings) ? qa.warnings.length : 0,
    boilerplateCleanup,
    backCoverPlacement,
  };

  console.log(JSON.stringify(summary, null, 2));
}

main();
