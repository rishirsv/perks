const SLIDE_REGISTRY_SCHEMA_VERSION = '1.0.0';

const REGISTRY = Object.freeze({
  cover: {
    builderId: 'cover',
    masterVariant: 'cover',
    requiredGeometry: ['title', 'logo', 'photo'],
    paginationPolicyKey: 'none.v1',
    validationHooks: [],
    excludeFromLogicalPaging: true,
  },
  divider: {
    builderId: 'divider',
    masterVariant: 'sectionDark',
    requiredGeometry: ['gradient', 'number', 'title'],
    paginationPolicyKey: 'none.v1',
    validationHooks: [],
    excludeFromLogicalPaging: true,
  },
  dividerDark: {
    builderId: 'divider',
    masterVariant: 'sectionDark',
    requiredGeometry: ['gradient', 'number', 'title'],
    paginationPolicyKey: 'none.v1',
    validationHooks: [],
    excludeFromLogicalPaging: true,
  },
  dividerLight: {
    builderId: 'divider',
    masterVariant: 'sectionLight',
    requiredGeometry: ['number', 'title'],
    paginationPolicyKey: 'none.v1',
    validationHooks: [],
    excludeFromLogicalPaging: true,
  },
  twoColumnText: {
    builderId: 'twoColumnText',
    masterVariant: 'white',
    requiredGeometry: ['title', 'left', 'right'],
    paginationPolicyKey: 'text.twoColumn.v1',
    validationHooks: [],
    excludeFromLogicalPaging: false,
  },
  oneColumnText: {
    builderId: 'oneColumnText',
    masterVariant: 'white',
    requiredGeometry: ['title', 'body'],
    paginationPolicyKey: 'text.oneColumn.v1',
    validationHooks: [],
    excludeFromLogicalPaging: false,
  },
  analysisNarrowTable: {
    builderId: 'analysisNarrowTable',
    masterVariant: 'white',
    requiredGeometry: ['title', 'table'],
    paginationPolicyKey: 'table.rows.v1',
    validationHooks: ['tableShape'],
    excludeFromLogicalPaging: false,
  },
  analysisWideChart2ColsText: {
    builderId: 'analysisWideChart2ColsText',
    masterVariant: 'white',
    requiredGeometry: ['title', 'textBox', 'chartBox'],
    paginationPolicyKey: 'text.analysisWide.2cols.v1',
    validationHooks: ['chartShape'],
    excludeFromLogicalPaging: false,
  },
  analysisWideChartTableText: {
    builderId: 'analysisWideChartTableText',
    masterVariant: 'white',
    requiredGeometry: ['title', 'textBox', 'tableBox'],
    paginationPolicyKey: 'text.analysisWide.table.v1',
    validationHooks: ['chartShape', 'tableShape'],
    excludeFromLogicalPaging: false,
  },
  analysisBridge: {
    builderId: 'analysisBridge',
    masterVariant: 'white',
    requiredGeometry: ['title', 'bridgeArea', 'analysisBoxes'],
    paginationPolicyKey: 'bridge.analysisColumns.v1',
    validationHooks: ['bridgeSpec'],
    excludeFromLogicalPaging: false,
  },
  businessOverview: {
    builderId: 'businessOverview',
    masterVariant: 'white',
    requiredGeometry: ['title', 'leftPanel', 'overviewBody'],
    paginationPolicyKey: 'business.overviewBody.v1',
    validationHooks: ['businessStructureSpec'],
    excludeFromLogicalPaging: false,
  },
  titleStrapline4TextBoxes: {
    builderId: 'titleStrapline4TextBoxes',
    masterVariant: 'white',
    requiredGeometry: ['title', 'columns'],
    paginationPolicyKey: 'none.v1',
    validationHooks: [],
    excludeFromLogicalPaging: false,
  },
  contents: {
    builderId: 'contents',
    masterVariant: 'white',
    requiredGeometry: ['title', 'topRow', 'bottomRow'],
    paginationPolicyKey: 'contents.sections.v1',
    validationHooks: [],
    excludeFromLogicalPaging: false,
  },
  backCover: {
    builderId: 'backCover',
    masterVariant: 'closing',
    requiredGeometry: ['body', 'logo'],
    paginationPolicyKey: 'none.v1',
    validationHooks: [],
    excludeFromLogicalPaging: true,
  },
});

export function resolveRegistryTypeForSlide(slideSpec = {}) {
  if (slideSpec?.type === 'divider' && slideSpec?.variant === 'light') return 'dividerLight';
  return slideSpec?.type;
}

export function listRegisteredSlideTypes() {
  return Object.keys(REGISTRY);
}

export function getSlideRegistryEntry(type) {
  if (!type || typeof type !== 'string') return null;
  return REGISTRY[type] || null;
}

export function getSlideRegistry() {
  return {
    schemaVersion: SLIDE_REGISTRY_SCHEMA_VERSION,
    byType: REGISTRY,
    get(type) {
      return getSlideRegistryEntry(type);
    },
    list() {
      return listRegisteredSlideTypes();
    },
  };
}

export function registryTypeSet() {
  return new Set(listRegisteredSlideTypes());
}

export function assertRegistryCoversTemplateTypes(templateLayouts = {}) {
  const templateTypes = Object.keys(templateLayouts || {});
  const registryTypes = registryTypeSet();
  const missing = templateTypes.filter((type) => !registryTypes.has(type));
  const extra = [...registryTypes].filter((type) => !Object.prototype.hasOwnProperty.call(templateLayouts || {}, type));

  if (missing.length || extra.length) {
    const parts = [];
    if (missing.length) parts.push(`missing in registry: ${missing.join(', ')}`);
    if (extra.length) parts.push(`extra in registry: ${extra.join(', ')}`);
    throw new Error(`Slide registry mismatch with template layouts: ${parts.join(' | ')}`);
  }
}

export function defaultMasterNameForType(type, templatePackage) {
  const entry = getSlideRegistryEntry(type);
  const variantKey = entry?.masterVariant || 'white';
  const variants = templatePackage?.layouts?.masters?.variants || {};
  const configured = variants?.[variantKey]?.masterName;

  if (typeof configured === 'string' && configured.trim()) return configured.trim();

  if (variantKey === 'cover') return 'KPMG_COVER';
  if (variantKey === 'closing') return 'KPMG_CLOSING';
  if (variantKey === 'sectionLight') return 'KPMG_SECTION_LIGHT';
  if (variantKey === 'sectionDark') return 'KPMG_SECTION_DARK';
  return 'KPMG_WHITE';
}

export function isExcludedFromLogicalPaging(type) {
  return Boolean(getSlideRegistryEntry(type)?.excludeFromLogicalPaging);
}

export { SLIDE_REGISTRY_SCHEMA_VERSION };
