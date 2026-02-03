/**
 * AI Tools Visual Showcase - PowerPoint Generator
 * Generates a 2-slide PPTX showcasing KPMG TS AI tools
 */

const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');
const sharp = require('sharp');
const html2pptx = require('/Users/rishi/Code/tools/document-skills/pptx/scripts/html2pptx');

// KPMG Brand Colors
const COLORS = {
  KPMG_BLUE: '00338D',
  MEDIUM_BLUE: '005EB8',
  LIGHT_BLUE: '0091DA',
  GREEN: '00A3A1',
  PURPLE: '6D2077',
  WHITE: 'FFFFFF',
  BLACK: '000000'
};

// Directories
const BASE_DIR = '/Users/rishi/Code/chatgpt/ai-tools-showcase';
const WORKSPACE = path.join(BASE_DIR, 'workspace');
const OUTPUT_DIR = path.join(BASE_DIR, 'output');

// Released tools data (icon paths will be set after copying to workspace)
const RELEASED_TOOLS_DATA = [
  {
    name: 'KDN Tasks',
    originalIcon: '/Users/rishi/Code/chatgpt/kdn-tasks/kdn_logo.png',
    description: 'Drafts clear, actionable email instructions for KDN offshore execution teams. Handles any task\u2014from IS/BS roll-forwards and AR/AP schedules to GL breakdowns and QoE support work.'
  },
  {
    name: 'Meeting Intelligence',
    originalIcon: '/Users/rishi/Code/chatgpt/meeting-intelligence/dist/meeting-intelligence-logo.png',
    description: 'Transforms meeting transcripts into comprehensive, template-structured notes for FDD and General Business meetings. All content is transcript-grounded with zero invention.'
  },
  {
    name: 'MetaPrompt',
    originalIcon: '/Users/rishi/Code/chatgpt/meta-prompt/Generated Image November 23, 2025 - 1_09PM.jpeg',
    description: 'Optimizes user tasks into refined AI prompts using structured templates, ensuring consistent quality for downstream model execution.'
  },
  {
    name: 'TS Copywriter',
    originalIcon: '/Users/rishi/Code/chatgpt/ts-copywriter/archive/ts-copywriter-icon.png',
    description: 'Rewrites, drafts, and polishes financial due diligence report content with Big 4 partner-level expertise, applying strict style guidelines and data-anchored language.'
  },
  {
    name: 'Lingo',
    originalIcon: '/Users/rishi/Code/chatgpt/kpmg-pptx/lingo/lingo_logo.png',
    description: 'Automatically extracts abbreviations from documents and generates professional, KPMG-branded glossary slides. Upload any PowerPoint or PDF for instant glossary creation.'
  }
];

// Roadmap tools data
const IN_DEVELOPMENT = [
  {
    name: 'TS Letters',
    initials: 'TSL',
    description: 'Automates generation of Transaction Services due diligence letters (Client Release, Third Party Access, Factual Accuracy) by filling DOCX templates with deal-specific data.'
  },
  {
    name: 'SPA Assistant',
    initials: 'SPA',
    description: 'AI assistant for Sale and Purchase Agreement analysis and support.'
  },
  {
    name: 'FDD Researcher',
    initials: 'FDD',
    description: 'Pre-data-room kickoff brief generator that creates comprehensive business overviews of the target company, with industry-specific playbooks and data request templates.'
  }
];

const PLANNED = [
  {
    name: 'Databook Associate',
    initials: 'DBA',
    description: 'Generates Excel schedules in Transaction Services according to KPMG brand standards. Processes a variety of data room schedules including leases, trial balances, aging schedules, and GL breakdowns.'
  },
  {
    name: 'Quality Control Assistant',
    initials: 'QCA',
    description: 'Performs QC analysis on Transaction Services databooks and reports through automated consistency checks across deliverables.'
  }
];

/**
 * Generate placeholder icon with initials in KPMG Blue circle
 */
async function createPlaceholderIcon(initials, outputPath) {
  const size = 200;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#${COLORS.KPMG_BLUE}"/>
    <text x="${size/2}" y="${size/2}"
          font-family="Arial, sans-serif"
          font-size="${size * 0.35}"
          font-weight="bold"
          fill="white"
          text-anchor="middle"
          dominant-baseline="central">${initials}</text>
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(outputPath);
  return outputPath;
}

/**
 * Copy and resize icon to workspace with clean filename
 */
async function copyIcon(originalPath, outputFilename) {
  const outputPath = path.join(WORKSPACE, outputFilename);
  await sharp(originalPath)
    .resize(200, 200, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(outputPath);
  return outputPath;
}

/**
 * Generate Slide 1 HTML: Released AI Tools (3+2 grid for 5 tools)
 */
function generateSlide1HTML(releasedTools) {
  // Split tools into rows: 3 on top, 2 on bottom (centered)
  const topRow = releasedTools.slice(0, 3);
  const bottomRow = releasedTools.slice(3);

  return `<!DOCTYPE html>
<html>
<head>
<style>
html { background: #ffffff; }
body {
  width: 720pt; height: 405pt; margin: 0; padding: 0;
  background: #ffffff; font-family: Arial, sans-serif;
  display: flex; flex-direction: column;
}
.header {
  background: #${COLORS.KPMG_BLUE};
  padding: 10pt 30pt;
}
.header h1 {
  color: white;
  font-size: 20pt;
  margin: 0;
  font-weight: bold;
}
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12pt 15pt;
  gap: 10pt;
}
.row {
  display: flex;
  justify-content: center;
  gap: 10pt;
}
.tool-card {
  width: 218pt;
  height: 135pt;
  display: flex;
  background: #f8f9fa;
  border-radius: 5pt;
  padding: 10pt;
  box-sizing: border-box;
}
.icon-container {
  width: 55pt;
  height: 55pt;
  flex-shrink: 0;
  margin-right: 10pt;
}
.icon-container img {
  width: 55pt;
  height: 55pt;
  object-fit: contain;
  border-radius: 5pt;
}
.tool-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.tool-name {
  color: #${COLORS.KPMG_BLUE};
  font-size: 11pt;
  font-weight: bold;
  margin: 0 0 4pt 0;
}
.tool-desc {
  color: #${COLORS.BLACK};
  font-size: 8pt;
  line-height: 1.3;
  margin: 0;
}
.badge {
  background: #${COLORS.GREEN};
  border-radius: 3pt;
  margin-bottom: 4pt;
  padding: 2pt 6pt;
  display: inline-block;
  width: fit-content;
}
.badge p {
  color: white;
  font-size: 7pt;
  font-weight: bold;
  margin: 0;
}
</style>
</head>
<body>
<div class="header">
  <h1>Released AI Tools</h1>
</div>
<div class="content">
  <div class="row">
    ${topRow.map(tool => `
    <div class="tool-card">
      <div class="icon-container">
        <img src="${tool.icon}" alt="${tool.name}">
      </div>
      <div class="tool-info">
        <div class="badge"><p>Released</p></div>
        <p class="tool-name">${tool.name}</p>
        <p class="tool-desc">${tool.description}</p>
      </div>
    </div>`).join('')}
  </div>
  <div class="row">
    ${bottomRow.map(tool => `
    <div class="tool-card">
      <div class="icon-container">
        <img src="${tool.icon}" alt="${tool.name}">
      </div>
      <div class="tool-info">
        <div class="badge"><p>Released</p></div>
        <p class="tool-name">${tool.name}</p>
        <p class="tool-desc">${tool.description}</p>
      </div>
    </div>`).join('')}
  </div>
</div>
</body>
</html>`;
}

/**
 * Generate Slide 2 HTML: AI Tools Roadmap
 */
function generateSlide2HTML(placeholderIcons) {
  return `<!DOCTYPE html>
<html>
<head>
<style>
html { background: #ffffff; }
body {
  width: 720pt; height: 405pt; margin: 0; padding: 0;
  background: #ffffff; font-family: Arial, sans-serif;
  display: flex; flex-direction: column;
}
.header {
  background: #${COLORS.KPMG_BLUE};
  padding: 12pt 30pt;
}
.header h1 {
  color: white;
  font-size: 22pt;
  margin: 0;
  font-weight: bold;
}
.content {
  flex: 1;
  padding: 12pt 20pt;
  display: flex;
  flex-wrap: wrap;
  gap: 10pt;
  align-content: flex-start;
}
.section-label {
  width: 100%;
  margin: 0 0 2pt 0;
  color: #${COLORS.KPMG_BLUE};
  font-size: 11pt;
  font-weight: bold;
}
.tool-card {
  width: 218pt;
  height: 90pt;
  display: flex;
  background: #f8f9fa;
  border-radius: 5pt;
  padding: 8pt;
  box-sizing: border-box;
}
.icon-container {
  width: 45pt;
  height: 45pt;
  flex-shrink: 0;
  margin-right: 8pt;
}
.icon-container img {
  width: 45pt;
  height: 45pt;
  object-fit: contain;
  border-radius: 50%;
}
.tool-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.tool-name {
  color: #${COLORS.KPMG_BLUE};
  font-size: 10pt;
  font-weight: bold;
  margin: 0 0 3pt 0;
}
.tool-desc {
  color: #${COLORS.BLACK};
  font-size: 7pt;
  line-height: 1.25;
  margin: 0;
}
.badge-dev {
  background: #${COLORS.LIGHT_BLUE};
  border-radius: 2pt;
  margin-bottom: 3pt;
  padding: 1pt 5pt;
  display: inline-block;
  width: fit-content;
}
.badge-dev p {
  color: white;
  font-size: 7pt;
  font-weight: bold;
  margin: 0;
}
.badge-planned {
  background: #${COLORS.PURPLE};
  border-radius: 2pt;
  margin-bottom: 3pt;
  padding: 1pt 5pt;
  display: inline-block;
  width: fit-content;
}
.badge-planned p {
  color: white;
  font-size: 7pt;
  font-weight: bold;
  margin: 0;
}
</style>
</head>
<body>
<div class="header">
  <h1>AI Tools Roadmap</h1>
</div>
<div class="content">
  <p class="section-label">In Development</p>
  ${IN_DEVELOPMENT.map((tool, i) => `
  <div class="tool-card">
    <div class="icon-container">
      <img src="${placeholderIcons[i]}" alt="${tool.name}">
    </div>
    <div class="tool-info">
      <div class="badge-dev"><p>In Development</p></div>
      <p class="tool-name">${tool.name}</p>
      <p class="tool-desc">${tool.description}</p>
    </div>
  </div>`).join('')}
  <p class="section-label">Planned</p>
  ${PLANNED.map((tool, i) => `
  <div class="tool-card">
    <div class="icon-container">
      <img src="${placeholderIcons[IN_DEVELOPMENT.length + i]}" alt="${tool.name}">
    </div>
    <div class="tool-info">
      <div class="badge-planned"><p>Planned</p></div>
      <p class="tool-name">${tool.name}</p>
      <p class="tool-desc">${tool.description}</p>
    </div>
  </div>`).join('')}
</div>
</body>
</html>`;
}

async function main() {
  console.log('AI Tools Visual Showcase - PowerPoint Generator');
  console.log('================================================\n');

  // Ensure directories exist
  if (!fs.existsSync(WORKSPACE)) fs.mkdirSync(WORKSPACE, { recursive: true });
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Step 1a: Copy released tool icons to workspace (to avoid path issues with special characters)
  console.log('1. Preparing tool icons...');
  console.log('   Copying released tool icons to workspace...');
  const releasedTools = [];
  for (let i = 0; i < RELEASED_TOOLS_DATA.length; i++) {
    const tool = RELEASED_TOOLS_DATA[i];
    const cleanFilename = `released-icon-${i + 1}.png`;
    const iconPath = await copyIcon(tool.originalIcon, cleanFilename);
    releasedTools.push({
      name: tool.name,
      icon: iconPath,
      description: tool.description
    });
    console.log(`   Copied: ${tool.name} -> ${cleanFilename}`);
  }

  // Step 1b: Generate placeholder icons for roadmap tools
  console.log('   Generating placeholder icons for roadmap tools...');
  const roadmapTools = [...IN_DEVELOPMENT, ...PLANNED];
  const placeholderIcons = [];
  for (const tool of roadmapTools) {
    const iconPath = path.join(WORKSPACE, `icon-${tool.initials.toLowerCase()}.png`);
    await createPlaceholderIcon(tool.initials, iconPath);
    placeholderIcons.push(iconPath);
    console.log(`   Created: ${tool.initials} -> icon-${tool.initials.toLowerCase()}.png`);
  }

  // Step 2: Generate HTML slides
  console.log('\n2. Generating HTML slides...');
  const slide1Html = generateSlide1HTML(releasedTools);
  const slide2Html = generateSlide2HTML(placeholderIcons);

  const slide1Path = path.join(WORKSPACE, 'slide1.html');
  const slide2Path = path.join(WORKSPACE, 'slide2.html');

  fs.writeFileSync(slide1Path, slide1Html);
  fs.writeFileSync(slide2Path, slide2Html);
  console.log(`   Slide 1: ${slide1Path}`);
  console.log(`   Slide 2: ${slide2Path}`);

  // Step 3: Create PowerPoint presentation
  console.log('\n3. Creating PowerPoint presentation...');
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.title = 'KPMG Transaction Services AI Tools';
  pptx.author = 'KPMG Transaction Services';

  // Convert HTML slides to PowerPoint
  console.log('   Converting Slide 1...');
  await html2pptx(slide1Path, pptx, { tmpDir: WORKSPACE });

  console.log('   Converting Slide 2...');
  await html2pptx(slide2Path, pptx, { tmpDir: WORKSPACE });

  // Step 4: Save presentation
  const outputPath = path.join(OUTPUT_DIR, 'ai-tools-showcase.pptx');
  await pptx.writeFile({ fileName: outputPath });
  console.log(`\n4. Presentation saved to: ${outputPath}`);

  console.log('\nDone! Open the file in PowerPoint or Keynote to view.');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
