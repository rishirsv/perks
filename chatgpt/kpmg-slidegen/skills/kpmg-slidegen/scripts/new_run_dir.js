#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

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

function ensureDirExists(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
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

function pad(value) {
  return String(value).padStart(2, '0');
}

function timestampStamp(now = new Date()) {
  return [
    now.getUTCFullYear(),
    pad(now.getUTCMonth() + 1),
    pad(now.getUTCDate()),
  ].join('-') +
    '_' +
    [pad(now.getUTCHours()), pad(now.getUTCMinutes()), pad(now.getUTCSeconds())].join('');
}

function slugify(rawValue) {
  return String(rawValue || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

function buildRunId({ runId, slug }) {
  if (runId) return runId;
  const safeSlug = slugify(slug);
  const stamp = timestampStamp();
  return safeSlug ? `${stamp}-${safeSlug}` : stamp;
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);

  if (args.get('help')) {
    console.log(
      'Usage: node scripts/new_run_dir.js [--repo-root <path>] [--run-id <id>] [--slug <slug>] [--print json|path]',
    );
    process.exit(0);
  }

  const repoRoot = args.get('repo-root')
    ? path.resolve(String(args.get('repo-root')))
    : findRepoRoot();

  if (!isRepoRoot(repoRoot)) {
    console.error(`Invalid repo root: ${repoRoot}`);
    process.exit(2);
  }

  const runId = buildRunId({ runId: args.get('run-id'), slug: args.get('slug') });
  const runDir = path.join(repoRoot, 'outputs', 'runs', runId);
  ensureDirExists(runDir);

  const payload = {
    repoRoot,
    runId,
    runDir,
  };

  if (args.get('print') === 'path') {
    console.log(runDir);
    return;
  }

  console.log(JSON.stringify(payload, null, 2));
}

main();
