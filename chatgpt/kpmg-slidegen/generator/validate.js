import fs from 'node:fs';
import path from 'node:path';

import { loadTemplatePackage } from './runtime/template-package.js';
import { validateDeckSpecWithTemplate } from './runtime/render-deck.js';

export function validateDeckSpec(deckSpec) {
  const templatePackage = loadTemplatePackage('kpmg-diligence');
  return validateDeckSpecWithTemplate(deckSpec, templatePackage, {
    allowSparse: Boolean(deckSpec?.metadata?.allowSparse),
  });
}

export function readJson(filePath) {
  const s = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(s);
}

export async function main(argv = process.argv.slice(2)) {
  const args = new Map();
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      args.set(key, next);
      i++;
    } else {
      args.set(key, true);
    }
  }

  const inPath = args.get('in');
  const templateName = args.get('template') || 'kpmg-diligence';
  const allowSparse = Boolean(args.get('allow-sparse'));
  if (!inPath) {
    console.error(
      'Usage: node generator/validate.js --in <deck.json> [--template <name>] [--allow-sparse]',
    );
    process.exit(2);
  }

  const deckSpec = readJson(inPath);
  const templatePackage = loadTemplatePackage(templateName);
  const result = validateDeckSpecWithTemplate(deckSpec, templatePackage, { allowSparse });

  if (!result.valid) {
    for (const e of result.errors) console.error(e);
    process.exit(1);
  }

  for (const w of result.warnings) console.warn(w);
  console.log('OK');
}

if (import.meta.url === `file://${path.resolve(process.argv[1])}`) {
  main();
}
