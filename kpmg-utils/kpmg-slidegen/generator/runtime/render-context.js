import { buildLayoutContract } from './layout-contract.js';
import { buildTheme } from '../helpers/theme.js';
import { getSlideRegistry, assertRegistryCoversTemplateTypes } from './slide-registry.js';
import { assertPolicyCoverage, buildPaginationPolicy } from './pagination-policy.js';

function buildFooterSafeTopByMaster(templatePackage = {}) {
  const masters = templatePackage?.layouts?.masters || {};
  const variants = masters?.variants || {};
  const footerChrome = masters?.footerChrome || {};
  const logoY = Number(footerChrome?.logo?.y);
  if (!Number.isFinite(logoY)) return {};
  const safeTop = logoY - 0.1;

  const out = {};
  for (const variant of Object.values(variants)) {
    if (!variant?.masterName) continue;
    out[variant.masterName] = variant.includeFooter ? safeTop : null;
  }
  return out;
}

export function buildRenderContext(templatePackage = {}) {
  const theme = buildTheme(templatePackage);
  const slideRegistry = getSlideRegistry();
  assertRegistryCoversTemplateTypes(templatePackage?.layouts?.types || {});
  const paginationPolicy = buildPaginationPolicy(templatePackage);
  assertPolicyCoverage(slideRegistry, paginationPolicy);
  const layoutContract = buildLayoutContract(templatePackage, {
    slideRegistry,
    dimensions: theme?.dimensions || templatePackage?.tokens?.dimensions || null,
  });
  const footerSafeTopByMaster = buildFooterSafeTopByMaster(templatePackage);

  return {
    theme,
    layoutContract,
    slideRegistry,
    paginationPolicy,
    footerSafeTopByMaster,
  };
}
