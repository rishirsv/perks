import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import {
  GENERATED_DECKSPEC_SCHEMA_PATH,
  GENERATED_FILE_HEADER,
  GENERATED_FIXTURE_MANIFEST_PATH,
  GENERATED_GOLDEN_ALL_LAYOUTS_PATH,
  GENERATED_LAYOUTS_PATH,
  GENERATED_ONBOARDED_INDEX_PATH,
  GENERATED_ONBOARDED_MODULE_PATH,
  makeJsonContent,
  readSourceLayoutPackageMeta,
  readSourceLayouts,
} from './codegen/lib.mjs';
import {
  buildDeckspecSchema,
  buildFixtureManifest,
  buildGoldenAllLayoutsDeck,
  buildLayoutsAggregate,
  buildOnboardedIndex,
  buildOnboardedModule,
  buildRegistryEntries,
  mapBy,
} from './codegen/generate-runtime-aggregates.mjs';
import { REPO_ROOT } from './support.mjs';
import { primitiveVersionRef, readSourcePrimitives } from './codegen/lib.mjs';

const layouts = readSourceLayouts();
const primitives = readSourcePrimitives();
const primitivesByRef = mapBy(primitives, primitiveVersionRef);
const registryEntries = buildRegistryEntries(layouts, primitivesByRef);
const expectedFiles = new Map([
  [
    GENERATED_LAYOUTS_PATH,
    makeJsonContent(buildLayoutsAggregate(layouts, readSourceLayoutPackageMeta())),
  ],
  [
    GENERATED_ONBOARDED_INDEX_PATH,
    makeJsonContent(buildOnboardedIndex(registryEntries)),
  ],
  [
    GENERATED_ONBOARDED_MODULE_PATH,
    buildOnboardedModule(registryEntries),
  ],
  [
    GENERATED_DECKSPEC_SCHEMA_PATH,
    makeJsonContent(buildDeckspecSchema(layouts)),
  ],
  [
    GENERATED_GOLDEN_ALL_LAYOUTS_PATH,
    makeJsonContent(buildGoldenAllLayoutsDeck(layouts)),
  ],
  [
    GENERATED_FIXTURE_MANIFEST_PATH,
    makeJsonContent(buildFixtureManifest()),
  ],
]);
const originalContents = new Map(
  [...expectedFiles.keys()].map((filePath) => [filePath, fs.readFileSync(filePath, 'utf8')]),
);

try {
  for (const filePath of expectedFiles.keys()) {
    fs.writeFileSync(
      filePath,
      `{\n  "corrupted": true,\n  "note": "source reproducibility smoke for ${path.basename(filePath)}"\n`,
    );
  }

  const regen = spawnSync(process.execPath, [path.join(REPO_ROOT, 'scripts', 'codegen', 'generate-runtime-aggregates.mjs')], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    env: {
      ...process.env,
      PYTHONDONTWRITEBYTECODE: '1',
    },
  });
  assert.equal(
    regen.status,
    0,
    `Runtime aggregate regeneration should succeed from source fragments alone.\n${regen.stdout || ''}\n${regen.stderr || ''}`.trim(),
  );

  for (const [filePath, expectedContent] of expectedFiles.entries()) {
    const regeneratedContent = fs.readFileSync(filePath, 'utf8');
    assert.equal(
      regeneratedContent,
      expectedContent,
      `Regenerated output should be reproducible from authored sources only: ${path.relative(REPO_ROOT, filePath)}`,
    );
  }
  assert.match(
    fs.readFileSync(GENERATED_LAYOUTS_PATH, 'utf8'),
    new RegExp(`"generatedFileHeader": "${GENERATED_FILE_HEADER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`),
    'The regenerated layout package should restore the generated file header.',
  );

  const verify = spawnSync(process.execPath, [path.join(REPO_ROOT, 'scripts', 'codegen', 'generate-runtime-aggregates.mjs'), '--check'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    env: {
      ...process.env,
      PYTHONDONTWRITEBYTECODE: '1',
    },
  });
  assert.equal(
    verify.status,
    0,
    `Generated output verification should pass after regeneration from source-only inputs.\n${verify.stdout || ''}\n${verify.stderr || ''}`.trim(),
  );
} finally {
  for (const [filePath, content] of originalContents.entries()) {
    fs.writeFileSync(filePath, content);
  }
}

console.log('Source-only codegen reproducibility passed.');
