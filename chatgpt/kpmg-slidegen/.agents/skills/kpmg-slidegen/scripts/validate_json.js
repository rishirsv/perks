#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SKILL_ROOT = path.resolve(__dirname, '..');
const SCHEMA_ROOT = path.join(SKILL_ROOT, 'schemas');

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

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isPlainObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function isRepoRoot(candidate) {
  return fs.existsSync(path.join(candidate, 'generator', 'index.js'));
}

function findRepoRoot(startDir = process.cwd()) {
  let current = path.resolve(startDir);
  while (true) {
    if (isRepoRoot(current)) return current;
    const parent = path.dirname(current);
    if (parent === current) {
      throw new Error('Unable to find repo root containing generator/index.js');
    }
    current = parent;
  }
}

function inferKind(inputPath) {
  const lower = path.basename(inputPath).toLowerCase();
  if (lower.includes('contentpack')) return 'contentPack';
  if (lower.includes('deckplan')) return 'deckPlan';
  if (lower.includes('deckspec')) return 'deckSpec';
  if (lower.includes('qareport') || lower.includes('.qa')) return 'qaReport';
  return null;
}

function validateContentPack(doc) {
  const errors = [];

  if (!isPlainObject(doc)) {
    return ['contentPack must be a JSON object'];
  }

  if (!isNonEmptyString(doc.version)) {
    errors.push('contentPack.version must be a non-empty string');
  } else if (!/^v?[0-9]+\.[0-9]+(\.[0-9]+)?$/.test(doc.version)) {
    errors.push('contentPack.version must match semver-like format (e.g. 1.0 or v1.0)');
  }

  if (!Array.isArray(doc.slides) || doc.slides.length < 1) {
    errors.push('contentPack.slides must be a non-empty array');
  } else {
    doc.slides.forEach((entry, index) => {
      if (!isPlainObject(entry)) {
        errors.push(`contentPack.slides[${index}] must be an object`);
        return;
      }
      if (!isNonEmptyString(entry.type)) {
        errors.push(`contentPack.slides[${index}].type must be a non-empty string`);
      }
      if (!isPlainObject(entry.slots) || Object.keys(entry.slots).length === 0) {
        errors.push(`contentPack.slides[${index}].slots must be a non-empty object`);
      }
      if (entry.id !== undefined && !isNonEmptyString(entry.id)) {
        errors.push(`contentPack.slides[${index}].id must be a non-empty string when provided`);
      }
      if (entry.notes !== undefined) {
        const notesValid =
          isNonEmptyString(entry.notes) ||
          (Array.isArray(entry.notes) && entry.notes.length > 0 && entry.notes.every(isNonEmptyString));
        if (!notesValid) {
          errors.push(
            `contentPack.slides[${index}].notes must be a non-empty string or non-empty string array when provided`,
          );
        }
      }
    });
  }

  if (doc.evidence !== undefined) {
    if (!Array.isArray(doc.evidence)) {
      errors.push('contentPack.evidence must be an array when provided');
    } else {
      doc.evidence.forEach((entry, index) => {
        if (!isPlainObject(entry)) {
          errors.push(`contentPack.evidence[${index}] must be an object`);
          return;
        }
        if (!isNonEmptyString(entry.id)) {
          errors.push(`contentPack.evidence[${index}].id must be a non-empty string`);
        }
        if (!isNonEmptyString(entry.source)) {
          errors.push(`contentPack.evidence[${index}].source must be a non-empty string`);
        }
      });
    }
  }

  return errors;
}

function loadDeckPlanTypes() {
  const schema = readJson(path.join(SCHEMA_ROOT, 'deckPlan.schema.json'));
  return schema?.properties?.slides?.items?.properties?.type?.enum || [];
}

function validateDeckPlan(doc) {
  const errors = [];
  const allowedTopLevel = new Set(['metadata', 'slides']);
  const allowedMetadata = new Set(['objective', 'audience', 'tone']);
  const allowedSlideKeys = new Set(['title', 'type', 'intent', 'notes', 'section']);
  const allowedTypes = new Set(loadDeckPlanTypes());

  if (!isPlainObject(doc)) {
    return ['deckPlan must be a JSON object'];
  }

  for (const key of Object.keys(doc)) {
    if (!allowedTopLevel.has(key)) {
      errors.push(`deckPlan contains unknown top-level key: ${key}`);
    }
  }

  if (!Array.isArray(doc.slides) || doc.slides.length < 1) {
    errors.push('deckPlan.slides must be a non-empty array');
  } else {
    doc.slides.forEach((slide, index) => {
      if (!isPlainObject(slide)) {
        errors.push(`deckPlan.slides[${index}] must be an object`);
        return;
      }
      for (const key of Object.keys(slide)) {
        if (!allowedSlideKeys.has(key)) {
          errors.push(`deckPlan.slides[${index}] contains unknown key: ${key}`);
        }
      }
      if (!isNonEmptyString(slide.title)) {
        errors.push(`deckPlan.slides[${index}].title must be a non-empty string`);
      }
      if (!isNonEmptyString(slide.type)) {
        errors.push(`deckPlan.slides[${index}].type must be a non-empty string`);
      } else if (!allowedTypes.has(slide.type)) {
        errors.push(`deckPlan.slides[${index}].type is not allowed: ${slide.type}`);
      }
      if (!isNonEmptyString(slide.intent)) {
        errors.push(`deckPlan.slides[${index}].intent must be a non-empty string`);
      }
      if (slide.notes !== undefined && typeof slide.notes !== 'string') {
        errors.push(`deckPlan.slides[${index}].notes must be a string when provided`);
      }
      if (slide.section !== undefined && typeof slide.section !== 'string') {
        errors.push(`deckPlan.slides[${index}].section must be a string when provided`);
      }
    });
  }

  if (doc.metadata !== undefined) {
    if (!isPlainObject(doc.metadata)) {
      errors.push('deckPlan.metadata must be an object when provided');
    } else {
      for (const key of Object.keys(doc.metadata)) {
        if (!allowedMetadata.has(key)) {
          errors.push(`deckPlan.metadata contains unknown key: ${key}`);
        }
        if (!isNonEmptyString(doc.metadata[key])) {
          errors.push(`deckPlan.metadata.${key} must be a non-empty string`);
        }
      }
    }
  }

  return errors;
}

function validateQaReport(doc) {
  const errors = [];
  const schema = readJson(path.join(SCHEMA_ROOT, 'qaReport.schema.json'));
  const required = Array.isArray(schema.required) ? schema.required : [];

  if (!isPlainObject(doc)) {
    return ['qaReport must be a JSON object'];
  }

  for (const key of required) {
    if (!(key in doc)) {
      errors.push(`qaReport missing required field: ${key}`);
    }
  }

  if (doc.valid !== undefined && typeof doc.valid !== 'boolean') {
    errors.push('qaReport.valid must be boolean');
  }
  if (doc.errors !== undefined && !Array.isArray(doc.errors)) {
    errors.push('qaReport.errors must be an array');
  }
  if (doc.warnings !== undefined && !Array.isArray(doc.warnings)) {
    errors.push('qaReport.warnings must be an array');
  }
  if (doc.outputPptx !== undefined && typeof doc.outputPptx !== 'string') {
    errors.push('qaReport.outputPptx must be a string');
  }

  return errors;
}

function validateDeckSpecWithGenerator(inputPath, options = {}) {
  const repoRoot = options.repoRoot || findRepoRoot();
  const cmd = [
    'generator/validate.js',
    '--in',
    inputPath,
    '--template',
    options.template || 'kpmg-diligence',
  ];
  if (options.allowSparse) cmd.push('--allow-sparse');

  const result = spawnSync(process.execPath, cmd, {
    cwd: repoRoot,
    stdio: 'inherit',
  });

  return result.status ?? 1;
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);

  if (args.get('help')) {
    console.log(
      'Usage: node scripts/validate_json.js --in <file> [--kind contentPack|deckPlan|deckSpec|qaReport] [--repo-root <path>] [--template <name>] [--allow-sparse]',
    );
    process.exit(0);
  }

  const input = args.get('in');
  if (!input) {
    console.error('Missing required argument: --in <file>');
    process.exit(2);
  }

  const inputPath = path.resolve(String(input));
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    process.exit(2);
  }

  const kind = args.get('kind') || inferKind(inputPath);
  if (!kind) {
    console.error('Unable to infer artifact kind. Use --kind contentPack|deckPlan|deckSpec|qaReport');
    process.exit(2);
  }

  if (kind === 'deckSpec') {
    const status = validateDeckSpecWithGenerator(inputPath, {
      repoRoot: args.get('repo-root') ? path.resolve(String(args.get('repo-root'))) : undefined,
      template: args.get('template') || 'kpmg-diligence',
      allowSparse: Boolean(args.get('allow-sparse')),
    });
    if (status !== 0) process.exit(status);
    console.log('OK: deckSpec validated with generator/validate.js');
    return;
  }

  const doc = readJson(inputPath);
  let errors = [];

  if (kind === 'contentPack') {
    errors = validateContentPack(doc);
  } else if (kind === 'deckPlan') {
    errors = validateDeckPlan(doc);
  } else if (kind === 'qaReport') {
    errors = validateQaReport(doc);
  } else {
    console.error(`Unsupported kind: ${kind}`);
    process.exit(2);
  }

  if (errors.length > 0) {
    console.error(`Validation failed for ${kind}:`);
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`OK: ${kind} validated`);
}

main();
