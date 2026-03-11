import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import {
  GENERATED_DECKSPEC_SCHEMA_PATH,
  GENERATED_FIXTURE_MANIFEST_PATH,
  GENERATED_GOLDEN_ALL_LAYOUTS_PATH,
  GENERATED_LAYOUTS_PATH,
  GENERATED_ONBOARDED_INDEX_PATH,
  GENERATED_ONBOARDED_MODULE_PATH,
  readJson,
} from './codegen/lib.mjs';
import { REPO_ROOT } from './support.mjs';

const TEMP_LAYOUT_TYPE = 'repoAggregatePromotionSmoke';
const layoutSourcePath = path.join(
  REPO_ROOT,
  'templates-src',
  'kpmg-diligence',
  'layouts',
  `${TEMP_LAYOUT_TYPE}.json`,
);
const sourceTemplate = readJson(
  path.join(REPO_ROOT, 'templates-src', 'kpmg-diligence', 'layouts', 'backCover.json'),
);
const generatedPaths = [
  GENERATED_LAYOUTS_PATH,
  GENERATED_ONBOARDED_INDEX_PATH,
  GENERATED_ONBOARDED_MODULE_PATH,
  GENERATED_DECKSPEC_SCHEMA_PATH,
  GENERATED_GOLDEN_ALL_LAYOUTS_PATH,
  GENERATED_FIXTURE_MANIFEST_PATH,
];
const originalGenerated = new Map(
  generatedPaths.map((filePath) => [filePath, fs.readFileSync(filePath, 'utf8')]),
);

const layoutFragment = {
  ...sourceTemplate,
  type: TEMP_LAYOUT_TYPE,
  description: 'Temporary full repo aggregate regeneration smoke layout',
  templateLayout: 'BackCover',
};

function runNodeScript(scriptPath, args, label) {
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    env: {
      ...process.env,
      PYTHONDONTWRITEBYTECODE: '1',
    },
  });
  assert.equal(
    result.status,
    0,
    `${label} should succeed.\n${result.stdout || ''}\n${result.stderr || ''}`.trim(),
  );
}

try {
  assert.equal(fs.existsSync(layoutSourcePath), false, 'Temporary layout smoke file should not already exist.');
  fs.writeFileSync(layoutSourcePath, `${JSON.stringify(layoutFragment, null, 2)}\n`);

  runNodeScript(
    path.join(REPO_ROOT, 'scripts', 'codegen', 'generate-runtime-aggregates.mjs'),
    [],
    'Full repo aggregate regeneration',
  );

  const layoutsAggregate = readJson(GENERATED_LAYOUTS_PATH);
  assert.ok(layoutsAggregate?.types?.[TEMP_LAYOUT_TYPE], 'Generated layout package should include the temporary layout type.');

  const registryIndex = readJson(GENERATED_ONBOARDED_INDEX_PATH);
  assert.ok(
    (registryIndex.entries || []).some((entry) => entry.type === TEMP_LAYOUT_TYPE),
    'Generated registry index should include the temporary layout type.',
  );

  const schema = readJson(GENERATED_DECKSPEC_SCHEMA_PATH);
  const schemaTypes = Object.values(schema?.$defs || {})
    .map((def) => def?.properties?.type?.const)
    .filter(Boolean);
  assert.ok(schemaTypes.includes(TEMP_LAYOUT_TYPE), 'Generated deckSpec schema should include the temporary layout type.');

  const goldenFixture = readJson(GENERATED_GOLDEN_ALL_LAYOUTS_PATH);
  assert.ok(
    (goldenFixture.slides || []).some((slide) => slide.type === TEMP_LAYOUT_TYPE),
    'Generated golden all-layouts fixture should include the temporary layout type.',
  );

  runNodeScript(
    path.join(REPO_ROOT, 'scripts', 'test-contracts.mjs'),
    [],
    'Contract lane after temporary layout regeneration',
  );

  runNodeScript(
    path.join(REPO_ROOT, 'scripts', 'codegen', 'generate-runtime-aggregates.mjs'),
    ['--check'],
    'Generated output verification after temporary layout regeneration',
  );
} finally {
  fs.rmSync(layoutSourcePath, { force: true });
  for (const [filePath, content] of originalGenerated.entries()) {
    fs.writeFileSync(filePath, content);
  }
}

console.log('Full repo aggregate contract regeneration passed.');
