import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..', '..');

const GENERATED_TEMPLATE_ROOT = path.join(REPO_ROOT, 'templates');
const CANONICAL_PPTX_ROOT = path.join(REPO_ROOT, 'pptx-templates');

export function resolveCanonicalPptxRoot() {
  if (!fs.existsSync(CANONICAL_PPTX_ROOT)) {
    throw new Error(`Canonical PPTX root not found: ${CANONICAL_PPTX_ROOT}`);
  }
  return CANONICAL_PPTX_ROOT;
}

export function resolveTemplateRoot() {
  if (fs.existsSync(GENERATED_TEMPLATE_ROOT)) {
    return GENERATED_TEMPLATE_ROOT;
  }
  throw new Error(
    `Generated template root not found: ${GENERATED_TEMPLATE_ROOT}. ` +
      'Expected generator templates under /templates and canonical files under /pptx-templates.',
  );
}

export function resolveTemplateDir(templateName = 'kpmg-diligence') {
  return path.join(resolveTemplateRoot(), templateName);
}

export function resolveTemplateAssetsDir(templateName = 'kpmg-diligence') {
  return path.join(resolveTemplateDir(templateName), 'assets');
}

export function resolveTemplateModuleUrl(templateName = 'kpmg-diligence') {
  const modulePath = path.join(resolveTemplateDir(templateName), 'template.js');
  return pathToFileURL(modulePath).href;
}
