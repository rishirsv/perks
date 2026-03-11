import fs from 'node:fs';
import path from 'node:path';

import { DECKSPEC_SCHEMA_BASE } from './deckspec-schema-base.mjs';
import {
  FIXTURE_MANIFEST_SOURCE_PATH,
  GENERATED_DECKSPEC_SCHEMA_PATH,
  GENERATED_FILE_HEADER,
  GENERATED_FIXTURE_MANIFEST_PATH,
  GENERATED_GOLDEN_ALL_LAYOUTS_PATH,
  GENERATED_LAYOUTS_PATH,
  GENERATED_ONBOARDED_INDEX_PATH,
  GENERATED_ONBOARDED_MODULE_PATH,
  makeGeneratedJsHeader,
  makeJsonContent,
  primitiveVersionRef,
  readJson,
  readSourceLayoutPackageMeta,
  readSourceLayouts,
  readSourcePrimitives,
  toPascalCase,
  writeFileIfChanged,
} from './lib.mjs';
import { REPO_ROOT } from '../support.mjs';

function parseArgs(argv) {
  return {
    check: argv.includes('--check'),
  };
}

const JS_RESERVED_WORDS = new Set([
  'await',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'else',
  'export',
  'extends',
  'false',
  'finally',
  'for',
  'function',
  'if',
  'import',
  'in',
  'instanceof',
  'new',
  'null',
  'return',
  'super',
  'switch',
  'this',
  'throw',
  'true',
  'try',
  'typeof',
  'var',
  'void',
  'while',
  'with',
  'yield',
]);

const GOLDEN_LAYOUT_PRIORITY = [
  'cover',
  'contents',
  'dividerDark',
  'dividerLight',
  'divider',
];

const TEXT_AMOUNT = 'lg';
const FIXTURE_FOOTER = Object.freeze({
  year: 2026,
  legalEntityName: 'KPMG LLP',
  jurisdiction: 'Ontario',
  legalStructure: 'limited liability partnership',
  documentClassification: 'KPMG Confidential',
  officeContactText: 'kpmg.com/ca/contact',
});

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Index items by a derived key.
 *
 * @param {any[]} items
 * @param {(item: any) => string} keyFn
 * @returns {Record<string, any>}
 */
export function mapBy(items, keyFn) {
  return Object.fromEntries(items.map((item) => [keyFn(item), item]));
}

/**
 * Validate that layout fragments only reference known primitives.
 *
 * @param {object[]} layouts
 * @param {Record<string, object>} primitivesByRef
 * @returns {void}
 */
export function validateSources(layouts, primitivesByRef) {
  for (const layout of layouts) {
    if (!layout.type) {
      throw new Error('Layout fragment missing "type"');
    }
    const primitive = primitivesByRef[layout.primitive];
    if (!primitive) {
      throw new Error(`Layout ${layout.type} references unknown primitive ${layout.primitive}`);
    }
  }
}

/**
 * Validate that the generated authored registry covers every authored layout type.
 *
 * @param {object[]} layouts
 * @param {object[]} entries
 * @returns {void}
 */
export function validateRegistryEntries(layouts, entries) {
  const layoutTypes = layouts.map((layout) => layout.type).sort();
  const entryTypes = entries.map((entry) => entry.type).sort();
  const missingTypes = layoutTypes.filter((type) => !entryTypes.includes(type));
  const extraTypes = entryTypes.filter((type) => !layoutTypes.includes(type));
  if (missingTypes.length > 0 || extraTypes.length > 0) {
    const parts = [];
    if (missingTypes.length > 0) parts.push(`missing generated entries: ${missingTypes.join(', ')}`);
    if (extraTypes.length > 0) parts.push(`unexpected generated entries: ${extraTypes.join(', ')}`);
    throw new Error(`Authored runtime registry coverage mismatch. ${parts.join(' | ')}`);
  }
}

/**
 * Build the runtime layout aggregate from source fragments.
 *
 * @param {object[]} layouts
 * @param {object} packageMeta
 * @returns {object}
 */
export function buildLayoutsAggregate(layouts, packageMeta = {}) {
  const types = {};
  for (const layout of layouts.slice().sort((left, right) => left.type.localeCompare(right.type))) {
    types[layout.type] = {
      description: layout.description,
      geometry: layout.geometry || {},
      slots: layout.slots || {},
      templateLayout: layout.templateLayout,
      ...(layout.densityTarget ? { densityTarget: layout.densityTarget } : {}),
    };
  }
  return {
    ...packageMeta,
    generatedFileHeader: GENERATED_FILE_HEADER,
    types,
  };
}

function buildImportKey({ builderModule, builderExport }) {
  return `${builderModule}::${builderExport}`;
}

function normalizeImportPath(specifier) {
  const posixSpecifier = specifier.split(path.sep).join('/');
  if (posixSpecifier.startsWith('.')) return posixSpecifier;
  return `./${posixSpecifier}`;
}

function toSafeIdentifier(value, fallback = 'builder') {
  const collapsed = String(value || '')
    .trim()
    .replace(/[^A-Za-z0-9_$]+/g, '_')
    .replace(/^([^A-Za-z_$])/, '_$1');
  const safe = collapsed.length > 0 ? collapsed : fallback;
  if (JS_RESERVED_WORDS.has(safe)) {
    return `${fallback}_${safe}`;
  }
  return safe;
}

/**
 * Resolve a repo-relative builder module to an import specifier that is correct
 * from the generated runtime registry module.
 *
 * @param {string} builderModule
 * @param {string} runtimeModulePath
 * @returns {string}
 */
export function resolveRuntimeImportPath(
  builderModule,
  runtimeModulePath = GENERATED_ONBOARDED_MODULE_PATH,
) {
  const runtimeDir = path.dirname(runtimeModulePath);
  const absoluteBuilderPath = path.isAbsolute(builderModule)
    ? builderModule
    : path.join(REPO_ROOT, builderModule);
  return normalizeImportPath(path.relative(runtimeDir, absoluteBuilderPath));
}

function assignImportBindings(entries) {
  const uniqueImports = [];
  const importByKey = new Map();
  for (const entry of entries) {
    const key = buildImportKey(entry);
    if (!importByKey.has(key)) {
      const importRecord = {
        builderModule: entry.builderModule,
        builderExport: entry.builderExport,
      };
      importByKey.set(key, importRecord);
      uniqueImports.push(importRecord);
    }
  }

  uniqueImports.sort(
    (left, right) =>
      left.builderModule.localeCompare(right.builderModule) ||
      left.builderExport.localeCompare(right.builderExport),
  );

  const usedBindings = new Set();
  for (const importRecord of uniqueImports) {
    const baseName = toSafeIdentifier(importRecord.builderExport, 'builder');
    const moduleStem = toSafeIdentifier(
      path.basename(importRecord.builderModule, path.extname(importRecord.builderModule)),
      'module',
    );
    let localBinding = baseName;
    if (usedBindings.has(localBinding)) {
      localBinding = `${baseName}__${moduleStem}`;
    }
    let counter = 2;
    while (usedBindings.has(localBinding)) {
      localBinding = `${baseName}__${counter}`;
      counter += 1;
    }
    usedBindings.add(localBinding);
    importRecord.localBinding = localBinding;
    importRecord.modulePath = resolveRuntimeImportPath(importRecord.builderModule);
  }

  return { importByKey, uniqueImports };
}

function formatImportLine(importRecord) {
  if (importRecord.builderExport === 'default') {
    return `import ${importRecord.localBinding} from '${importRecord.modulePath}';`;
  }
  if (importRecord.localBinding === importRecord.builderExport) {
    return `import { ${importRecord.builderExport} } from '${importRecord.modulePath}';`;
  }
  return `import { ${importRecord.builderExport} as ${importRecord.localBinding} } from '${importRecord.modulePath}';`;
}

/**
 * Build onboarded runtime registry entries from layout and primitive fragments.
 *
 * @param {object[]} layouts
 * @param {Record<string, object>} primitivesByRef
 * @returns {object[]}
 */
export function buildRegistryEntries(layouts, primitivesByRef) {
  const entries = [];
  for (const layout of layouts.slice().sort((left, right) => left.type.localeCompare(right.type))) {
    const primitive = primitivesByRef[layout.primitive];
    const builderModule = primitive.builderModule;
    const builderExport = primitive.builderExport || `build${toPascalCase(layout.type)}`;
    entries.push({
      type: layout.type,
      builderModule,
      builderExport,
      registryEntry: {
        builderId: layout.type,
        builder: '__BUILDER_REF__',
        master: layout.masterOverride || primitive.master,
        requiredGeometry: [...(primitive.requiredGeometry || [])],
        optionalGeometry: [...(primitive.optionalGeometry || [])],
        optionalDefaults: { ...(primitive.optionalDefaults || {}) },
        geometryKinds: { ...(primitive.geometryKinds || {}) },
        primitiveMetadata: {
          id: primitive.id,
          version: primitive.version,
          slotSchemaRef: primitive.slotSchemaRef || primitive.id,
          geometryKinds: { ...(primitive.geometryKinds || {}) },
        },
        paginationPolicyKey: primitive.paginationPolicyKey,
        validationHooks: [...(primitive.validationHooks || [])],
        excludeFromLogicalPaging: Boolean(primitive.excludeFromLogicalPaging),
      },
    });
  }
  return entries;
}

/**
 * Build the verification-friendly index for the generated onboarded registry.
 *
 * @param {object[]} entries
 * @returns {object}
 */
export function buildOnboardedIndex(entries) {
  return {
    generatedFileHeader: GENERATED_FILE_HEADER,
    schemaVersion: 4,
    entries,
  };
}

/**
 * Build the generated onboarded runtime registry module.
 *
 * @param {object[]} entries
 * @returns {string}
 */
export function buildOnboardedModule(entries) {
  if (entries.length === 0) {
    return `${makeGeneratedJsHeader()}export const AUTHORED_REGISTRY_ENTRIES = Object.freeze({});\n`;
  }
  const { importByKey, uniqueImports } = assignImportBindings(entries);
  const importLines = uniqueImports.map((importRecord) => formatImportLine(importRecord));
  const bodyLines = entries.map((entry) => {
    const importRecord = importByKey.get(buildImportKey(entry));
    const literal = JSON.stringify(entry.registryEntry, null, 2)
      .replace(/"__BUILDER_REF__"/g, importRecord.localBinding)
      .split('\n')
      .join('\n  ');
    return `  ${entry.type}: Object.freeze(${literal}),`;
  });
  return `${makeGeneratedJsHeader()}${importLines.join('\n')}\n\nexport const AUTHORED_REGISTRY_ENTRIES = Object.freeze({\n${bodyLines.join('\n')}\n});\n`;
}

function ensureArrayRef(defs, name, minItems, itemRef, { maxItems = null } = {}) {
  if (!defs[name]) {
    defs[name] = {
      type: 'array',
      minItems,
      ...(Number.isFinite(maxItems) ? { maxItems } : {}),
      items: {
        $ref: itemRef,
      },
    };
  }
  return { $ref: `#/$defs/${name}` };
}

function buildTextSchema(slot = {}) {
  const schema = {
    type: 'string',
    minLength: Math.max(1, Number(slot.minChars || 1)),
  };
  if (Number.isFinite(slot.maxChars)) {
    schema.maxLength = slot.maxChars;
  }
  if (slot.pattern) {
    schema.pattern = slot.pattern;
  }
  return schema;
}

function buildSlotSchema(slotName, slot, defs) {
  if (slot.kind === 'text') {
    return buildTextSchema(slot);
  }

  if (slot.kind === 'textArray') {
    const minItems = Math.max(1, Number(slot.minItems || 1));
    const maxItems = Number.isFinite(slot.maxItems) ? slot.maxItems : null;
    const defName = maxItems ? `textArrayMin${minItems}Max${maxItems}` : `textArrayMin${minItems}`;
    return ensureArrayRef(defs, defName, minItems, '#/$defs/textRun', { maxItems });
  }

  if (slot.kind === 'columns') {
    const minItems = Math.max(1, Number(slot.minItems || 1));
    const maxItems = Number.isFinite(slot.maxItems) ? slot.maxItems : null;
    const defName = maxItems ? `columnsMin${minItems}Max${maxItems}` : `columnsMin${minItems}`;
    return ensureArrayRef(defs, defName, minItems, '#/$defs/column', { maxItems });
  }

  if (slot.kind === 'contentsSections') {
    const minItems = Math.max(1, Number(slot.minItems || 1));
    const defName = `contentsSectionsMin${minItems}`;
    return ensureArrayRef(defs, defName, minItems, '#/$defs/contentsSection');
  }

  if (slot.kind === 'table') {
    return { $ref: '#/$defs/table' };
  }
  if (slot.kind === 'chart') {
    return { $ref: '#/$defs/chart' };
  }
  if (slot.kind === 'bridge') {
    return { $ref: '#/$defs/bridge' };
  }
  if (slot.kind === 'businessStructure') {
    return { $ref: '#/$defs/businessStructure' };
  }

  throw new Error(`Unsupported slot kind "${slot.kind}" in layout ${slotName}`);
}

function buildSlideDefinition(layout, defs) {
  const required = ['type'];
  const properties = {
    type: {
      const: layout.type,
    },
  };

  for (const [slotName, slot] of Object.entries(layout.slots || {})) {
    properties[slotName] = buildSlotSchema(slotName, slot, defs);
    if (slot.required) required.push(slotName);
  }

  return {
    type: 'object',
    additionalProperties: false,
    required,
    properties,
  };
}

export function buildDeckspecSchema(layouts) {
  const schema = cloneJson(DECKSPEC_SCHEMA_BASE);
  const defs = schema.$defs || {};
  const slideRefs = [];
  for (const layout of layouts.slice().sort((left, right) => left.type.localeCompare(right.type))) {
    const defName = `slide${toPascalCase(layout.type)}`;
    defs[defName] = buildSlideDefinition(layout, defs);
    slideRefs.push({
      $ref: `#/$defs/${defName}`,
    });
  }
  defs.slide = {
    oneOf: slideRefs,
  };
  return {
    ...schema,
    generatedFileHeader: GENERATED_FILE_HEADER,
    $defs: defs,
  };
}

function compareLayoutPriority(left, right) {
  const leftIndex = GOLDEN_LAYOUT_PRIORITY.indexOf(left.type);
  const rightIndex = GOLDEN_LAYOUT_PRIORITY.indexOf(right.type);
  if (leftIndex !== -1 || rightIndex !== -1) {
    if (leftIndex === -1) return 1;
    if (rightIndex === -1) return -1;
    return leftIndex - rightIndex;
  }
  return left.type.localeCompare(right.type);
}

function fitText(text, { minChars = 0, maxChars = null } = {}) {
  let value = String(text || '').trim();
  const filler = ' generated authoring aggregate sample';
  while (value.length < minChars) {
    value = `${value}${filler}`;
  }
  if (Number.isFinite(maxChars) && value.length > maxChars) {
    value = value.slice(0, maxChars).trim();
  }
  return value;
}

function buildTextValue(slotName, slot = {}, slideType) {
  if (slot.pattern === '^(bullets|paragraphs)$') {
    return 'bullets';
  }
  if (slotName === 'sectionNumber') {
    return '01';
  }
  const base = {
    title:
      slideType === 'cover'
        ? 'Slidegen Gold Standard Regression Deck'
        : `${toPascalCase(slideType)} generated sample title`,
    subtitle:
      slideType === 'cover'
        ? 'All layouts, generated from authored sources for deterministic QA and visual baselining.'
        : `${toPascalCase(slideType)} generated sample subtitle with authoring coverage.`,
    strapline: `Generated strapline for ${slideType} to keep the canonical fixture readable during regeneration.`,
    source: `Source: generated aggregate fixture for ${slideType}.`,
    note: `Generated note for ${slideType} fixture coverage.`,
    notes: `Generated notes for ${slideType} fixture coverage.`,
    noteSource: `Generated note and source text for ${slideType}.`,
    url: 'kpmg.com/ca/contact',
    disclaimer: 'Generated fixture disclaimer for regression coverage and onboarding promotion.',
    heading: `${toPascalCase(slideType)} heading`,
    leftHeading: 'Transaction perimeter',
    rightHeading: 'Business overview',
    insightTitle: 'Key takeaways',
    sectionTitle: `${toPascalCase(slideType)} section overview`,
  }[slotName] || `${toPascalCase(slideType)} ${slotName} sample`;
  return fitText(base, { minChars: slot.minChars || 1, maxChars: slot.maxChars || null });
}

function buildTextArrayValue(slotName, slot = {}, slideType) {
  const itemCount = Math.max(1, Number(slot.minItems || 3));
  const targetChars = Math.max(Number(slot.minChars || 0), itemCount * 28);
  const items = [];
  while (items.length < itemCount || items.join(' ').length < targetChars) {
    const itemNumber = items.length + 1;
    items.push(
      fitText(
        `${toPascalCase(slideType)} ${slotName} point ${itemNumber} keeps generated fixture coverage deterministic.`,
        { minChars: 28 },
      ),
    );
  }
  return items;
}

function buildColumnsValue(slot = {}, slideType) {
  const itemCount = Math.max(1, Number(slot.minItems || 1));
  return Array.from({ length: itemCount }, (_, index) => ({
    title: fitText(`${toPascalCase(slideType)} column ${index + 1}`, { minChars: 8 }),
    body: [
      fitText(`Generated body for ${slideType} column ${index + 1}.`, { minChars: 24 }),
      fitText(`Keeps column coverage stable for authoring regeneration.`, { minChars: 24 }),
    ],
  }));
}

function buildContentsSectionsValue(slot = {}) {
  const itemCount = Math.max(12, Number(slot.minItems || 3));
  return Array.from({ length: itemCount }, (_, index) => ({
    number: String(index + 1).padStart(2, '0'),
    title: `Generated contents section ${index + 1}`,
    items: ['Coverage checkpoint', 'Promotion proof'],
  }));
}

function buildTableValue(slot = {}, slideType) {
  const rowCount = Math.max(2, Number(slot.minItems || 1));
  const headers = ['Metric', 'Current', 'Target'];
  return {
    title: `${toPascalCase(slideType)} table`,
    headers,
    rows: Array.from({ length: rowCount }, (_, index) => [
      `Row ${index + 1}`,
      100 + index * 5,
      120 + index * 5,
    ]),
  };
}

function buildChartValue(slideType) {
  return {
    type: 'bar',
    data: [
      {
        name: `${toPascalCase(slideType)} series`,
        labels: ['FY24', 'FY25', 'FY26'],
        values: [120, 138, 154],
      },
    ],
    source: `Source: generated chart sample for ${slideType}.`,
  };
}

function buildBridgeValue(slot = {}, slideType) {
  const stepCount = Math.max(1, Number(slot.minItems || 3));
  const deltas = Array.from({ length: stepCount }, (_, index) => (index % 2 === 0 ? 12 : -4));
  const startValue = 100;
  const endValue = startValue + deltas.reduce((sum, value) => sum + value, 0);
  return {
    startLabel: `${toPascalCase(slideType)} start`,
    endLabel: `${toPascalCase(slideType)} end`,
    startValue,
    endValue,
    steps: deltas.map((delta, index) => ({
      label: `Bridge step ${index + 1}`,
      delta,
    })),
  };
}

function buildBusinessStructureValue() {
  return {
    topTier: [
      { label: 'HoldCo', pct: '100%' },
      { label: 'Shared services', pct: '100%' },
    ],
    bottomTier: [
      { label: 'Canada', pct: '60%' },
      { label: 'US', pct: '40%' },
    ],
    perimeter: {
      enabled: true,
      label: 'Transaction perimeter',
      subLabel: 'Generated coverage sample',
    },
  };
}

function buildSlotFixtureValue(slotName, slot, slideType) {
  if (slot.kind === 'text') {
    return buildTextValue(slotName, slot, slideType);
  }
  if (slot.kind === 'textArray') {
    return buildTextArrayValue(slotName, slot, slideType);
  }
  if (slot.kind === 'columns') {
    return buildColumnsValue(slot, slideType);
  }
  if (slot.kind === 'contentsSections') {
    return buildContentsSectionsValue(slot);
  }
  if (slot.kind === 'table') {
    return buildTableValue(slot, slideType);
  }
  if (slot.kind === 'chart') {
    return buildChartValue(slideType);
  }
  if (slot.kind === 'bridge') {
    return buildBridgeValue(slot, slideType);
  }
  if (slot.kind === 'businessStructure') {
    return buildBusinessStructureValue();
  }
  throw new Error(`Unsupported slot kind "${slot.kind}" while building fixture for ${slideType}.${slotName}`);
}

function buildGoldenSlide(layout) {
  const slide = {
    type: layout.type,
  };
  for (const [slotName, slot] of Object.entries(layout.slots || {})) {
    if (slot.required || slotName === 'strapline') {
      slide[slotName] = buildSlotFixtureValue(slotName, slot, layout.type);
    }
  }
  return slide;
}

export function buildGoldenAllLayoutsDeck(layouts) {
  return {
    generatedFileHeader: GENERATED_FILE_HEADER,
    metadata: {
      title: 'QA Golden All Layouts Generated Fixture',
      textAmount: TEXT_AMOUNT,
      subject: 'Generated render and pagination regression fixture',
      company: 'KPMG LLP',
      author: 'Slidegen QA Harness',
      allowSparse: true,
      footer: cloneJson(FIXTURE_FOOTER),
    },
    slides: layouts.slice().sort(compareLayoutPriority).map((layout) => buildGoldenSlide(layout)),
  };
}

export function buildFixtureManifest() {
  const source = readJson(FIXTURE_MANIFEST_SOURCE_PATH);
  const fixtures = (source.fixtures || []).map((entry) => {
    const deckSpecPath = path.join(path.dirname(GENERATED_FIXTURE_MANIFEST_PATH), entry.deckSpec);
    if (!fs.existsSync(deckSpecPath)) {
      throw new Error(`Fixture manifest source references missing deckSpec: ${entry.deckSpec}`);
    }
    const deckSpec = readJson(deckSpecPath);
    return {
      ...entry,
      textAmount: deckSpec?.metadata?.textAmount || entry.textAmount || null,
    };
  });
  return {
    generatedFileHeader: GENERATED_FILE_HEADER,
    schemaVersion: 1,
    fixtures,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const layouts = readSourceLayouts();
  const primitives = readSourcePrimitives();
  const layoutPackageMeta = readSourceLayoutPackageMeta();
  const primitivesByRef = mapBy(primitives, primitiveVersionRef);
  validateSources(layouts, primitivesByRef);

  const layoutsAggregate = buildLayoutsAggregate(layouts, layoutPackageMeta);
  const registryEntries = buildRegistryEntries(layouts, primitivesByRef);
  validateRegistryEntries(layouts, registryEntries);
  const onboardedIndex = buildOnboardedIndex(registryEntries);
  const onboardedModule = buildOnboardedModule(registryEntries);
  const deckspecSchema = buildDeckspecSchema(layouts);
  const goldenAllLayoutsDeck = buildGoldenAllLayoutsDeck(layouts);

  writeFileIfChanged(GENERATED_LAYOUTS_PATH, makeJsonContent(layoutsAggregate), args);
  writeFileIfChanged(GENERATED_ONBOARDED_INDEX_PATH, makeJsonContent(onboardedIndex), args);
  writeFileIfChanged(GENERATED_ONBOARDED_MODULE_PATH, onboardedModule, args);
  writeFileIfChanged(GENERATED_DECKSPEC_SCHEMA_PATH, makeJsonContent(deckspecSchema), args);
  writeFileIfChanged(GENERATED_GOLDEN_ALL_LAYOUTS_PATH, makeJsonContent(goldenAllLayoutsDeck), args);
  writeFileIfChanged(GENERATED_FIXTURE_MANIFEST_PATH, makeJsonContent(buildFixtureManifest()), args);

  console.log(args.check ? 'Generated outputs are up to date.' : 'Regenerated repo aggregates.');
}

if (process.argv[1] && import.meta.url === `file://${path.resolve(process.argv[1])}`) {
  main();
}
