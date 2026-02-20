import fs from 'node:fs';
import path from 'node:path';

import { loadTemplatePackage } from '../runtime/template-package.js';

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function makeChart() {
  return {
    type: 'bar',
    data: [
      {
        name: '.',
        labels: ['A', 'B', 'C', 'D'],
        values: [1, 2, 3, 4],
      },
    ],
  };
}

function makeRows(count = 3) {
  const rows = [];
  for (let i = 0; i < count; i++) rows.push(['.', '.']);
  return rows;
}

function makeSlide(type, idx) {
  const sectionNumber = String(idx + 1).padStart(2, '0');
  switch (type) {
    case 'cover':
      return { type, title: '.', subtitle: '.' };
    case 'divider':
      return { type, sectionNumber, sectionTitle: 'Dark Divider' };
    case 'dividerDark':
      return { type, sectionNumber, sectionTitle: 'Dark Divider' };
    case 'dividerLight':
      return { type, sectionNumber, sectionTitle: 'Light Divider' };
    case 'contents':
      return {
        type,
        title: 'Contents',
        sections: [
          { number: '01', title: 'Executive summary', pageRange: '(p. 3-25)', items: ['Business overview', 'Summary financials'] },
          { number: '02', title: 'Historical trading', pageRange: '(p. 26-35)', items: ['Profit & loss overview', 'Quality of earnings'] },
          { number: '03', title: 'Forecast trading', pageRange: '(p. 36-43)', items: ['Forecast overview'] },
          { number: '04', title: 'Balance sheet', pageRange: '(p. 44-48)', items: ['Balance sheet overview'] },
          { number: '05', title: 'Cash flows', pageRange: '(p. 49-50)', items: ['Operating cash flows'] },
          { number: '06', title: 'Reporting', pageRange: '(p. 51-53)', items: ['Reporting environment'] },
          { number: '07', title: 'Value creation', pageRange: '(p. 54-60)', items: ['Financial benchmarking'] },
          { number: '08', title: 'Pre-Deal PPA', pageRange: '(p. 61-65)', items: ['Methodology & procedures'] },
          { number: '09', title: 'Taxation', pageRange: '(p. 66-68)', items: ['Add title'] },
          { number: '10', title: 'Appendices', pageRange: '(p. 69-77)', items: ['Engagement appendices'] },
        ],
      };
    case 'summaryFinancials':
      return {
        type,
        title: '.',
        sectionsTop: ['.', '.', '.'],
        sectionsBottom: ['.', '.'],
      };
    case 'summaryFinancialsScaffold':
      return {
        type,
        title: '.',
        sectionsTop: ['.', '.', '.'],
        sectionsBottom: ['.', '.'],
      };
    case 'analysisWideChart2ColsText':
    case 'analysisWideChartTableText':
      return { type, title: '.', body: ['.', '.', '.', '.'], chart: makeChart() };
    case 'analysisWideChartTableTextScaffold':
      return {
        type,
        title: 'Profit & loss overview',
        strapline: 'Use this strapline to summarize the key message.',
        heading: 'Click to add the heading',
        body: ['Add text here'],
        chart: makeChart(),
        table: { headers: ['Metric', 'Value'], rows: makeRows(4) },
      };
    case 'analysisNarrowTable':
      return { type, title: '.', table: { headers: ['.', '.'], rows: makeRows(3) } };
    case 'twoColumnText':
    case 'analysis2ColumnsText':
      return { type, title: '.', leftBody: ['.', '.'], rightBody: ['.', '.'] };
    case 'oneColumnText':
      return { type, title: '.', body: ['.', '.', '.'] };
    case 'qualityOfEarnings':
      return { type, title: '.', body: ['.'] };
    case 'titleStrapline4TextBoxes':
      return {
        type,
        title: '.',
        columns: [
          { heading: '.', body: ['.'] },
          { heading: '.', body: ['.'] },
          { heading: '.', body: ['.'] },
          { heading: '.', body: ['.'] },
        ],
      };
    case 'backCover':
      return { type };
    default:
      return { type, title: '.' };
  }
}

const TYPE_ORDER = [
  'cover',
  'contents',
  'divider',
  'dividerDark',
  'dividerLight',
  'analysisWideChartTableTextScaffold',
  'summaryFinancials',
  'summaryFinancialsScaffold',
  'analysisWideChart2ColsText',
  'analysisWideChartTableText',
  'analysisNarrowTable',
  'twoColumnText',
  'analysis2ColumnsText',
  'oneColumnText',
  'qualityOfEarnings',
  'titleStrapline4TextBoxes',
  'backCover',
];

export function buildLayoutCatalogSpec(templateName = 'kpmg-diligence') {
  const templatePackage = loadTemplatePackage(templateName);
  const knownTypes = Object.keys(templatePackage.layouts?.types || {});
  const ordered = TYPE_ORDER.filter((t) => knownTypes.includes(t));
  const remaining = knownTypes.filter((t) => !ordered.includes(t)).sort();
  const types = [...ordered, ...remaining];

  return {
    metadata: {
      title: `KPMG Generator Layout Catalog (Blank) - ${templateName}`,
      author: 'kpmg-slidegen',
      company: 'KPMG LLP',
      subject: 'All available layout types with minimal placeholder content',
      allowSparse: true,
    },
    slides: types.map((type, idx) => makeSlide(type, idx)),
  };
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

  const templateName = args.get('template') || 'kpmg-diligence';
  const outPath =
    args.get('out') ||
    path.resolve('outputs', `${templateName}-layout-catalog-blank-spec.json`);

  const spec = buildLayoutCatalogSpec(templateName);
  writeJson(outPath, spec);
  console.log(`Layout catalog spec written: ${outPath}`);
  console.log(`Slides: ${spec.slides.length}`);
}

if (import.meta.url === `file://${path.resolve(process.argv[1])}`) {
  main();
}
