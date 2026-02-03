const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8765;

// Simple static file server
function createServer() {
  return http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

    // Security check - prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.ttf': 'font/ttf',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
    };

    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404);
          res.end('Not found');
        } else {
          res.writeHead(500);
          res.end('Server error');
        }
        return;
      }

      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(content);
    });
  });
}

async function generatePDF() {
  console.log('Starting local server...');
  const server = createServer();

  await new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      resolve();
    });
  });

  console.log('Launching browser...');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Loading page...');
  await page.goto(`http://localhost:${PORT}`, {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  // Wait for fonts to load
  await page.waitForTimeout(2000);

  // Inject custom print styles for better PDF layout
  await page.addStyleTag({
    content: `
      @media print {
        /* Hide interactive elements */
        body::before,
        .progress-bar,
        .nav,
        .overview-panel,
        .shortcuts-hint,
        .scroll-hint {
          display: none !important;
        }

        /* Reset body */
        body {
          background: white !important;
          color: #1a1a1a !important;
          overflow: visible !important;
        }

        /* Reset container */
        .slides-container {
          position: static !important;
          overflow: visible !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        /* Each slide becomes a page */
        .slide {
          page-break-after: always !important;
          page-break-inside: avoid !important;
          min-height: auto !important;
          height: auto !important;
          padding: 40px 50px !important;
          border: none !important;
          background: white !important;
          display: block !important;
        }

        .slide:last-child {
          page-break-after: auto !important;
        }

        /* Title slide styling */
        .slide-title {
          background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%) !important;
          min-height: 100vh !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        /* Section divider styling */
        .slide-section {
          background: linear-gradient(135deg, #00338D 0%, #483698 100%) !important;
          color: white !important;
          min-height: 100vh !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .slide-section h1,
        .slide-section .section-label,
        .slide-section .section-subtitle,
        .slide-section .topic-pill {
          color: white !important;
        }

        /* Content styling for print */
        .slide-content {
          max-width: 100% !important;
        }

        .slide h1, .slide h2, .slide h3 {
          color: #1a1a1a !important;
        }

        .slide-intro, .card ul li, .comparison-body ul li,
        .arch-box ul li, .pattern-body > p, .callout-content,
        .panel-content p, .spec-section p {
          color: #333 !important;
        }

        /* Cards for print */
        .card, .pattern-card, .comparison-card, .split-panel,
        .antipattern-card, .checklist-section, .guardrail-card,
        .spec-example, .arch-box {
          box-shadow: none !important;
          border: 1px solid #ddd !important;
          background: #fafafa !important;
        }

        .card-stat {
          background: #e3f2fd !important;
          border-color: #90caf9 !important;
          color: #1565c0 !important;
        }

        /* Code blocks for print */
        .code-block, .mini-code, .pattern-code {
          background: #f5f5f5 !important;
          border: 1px solid #ddd !important;
        }

        .code-block code, .mini-code code, .pattern-code code {
          color: #333 !important;
        }

        /* Callouts for print */
        .callout {
          background: #f8f9fa !important;
          border: 1px solid #ddd !important;
        }

        /* Grid layouts - stack on narrow pages */
        .card-grid.three-col,
        .pattern-grid,
        .antipattern-grid {
          grid-template-columns: 1fr 1fr !important;
          gap: 1rem !important;
        }

        .checklist-grid,
        .remember-grid {
          grid-template-columns: 1fr !important;
        }

        /* Comparison grid */
        .comparison-grid {
          grid-template-columns: 1fr 1fr !important;
        }

        .comparison-divider {
          display: none !important;
        }

        /* Architecture diagram */
        .architecture-diagram {
          flex-direction: column !important;
          gap: 1rem !important;
        }

        .arch-arrow {
          transform: rotate(90deg) !important;
        }

        /* Context window viz */
        .context-segment {
          font-size: 9px !important;
        }

        /* Remember hero for print */
        .remember-hero {
          background: linear-gradient(135deg, #00338D 0%, #483698 100%) !important;
        }

        .remember-card {
          background: rgba(255, 255, 255, 0.95) !important;
          color: #1a1a1a !important;
        }

        .remember-content strong,
        .remember-content p {
          color: #1a1a1a !important;
        }

        /* Better break handling for complex sections */
        .slide-full-example,
        .slide-antipatterns,
        .slide-checklist {
          page-break-inside: auto !important;
        }

        .two-col-example {
          grid-template-columns: 1fr !important;
        }

        /* Ensure tables don't break */
        table {
          page-break-inside: avoid !important;
        }
      }
    `
  });

  console.log('Generating PDF...');

  // Generate PDF with custom settings for better output
  await page.pdf({
    path: 'building-effective-custom-gpts.pdf',
    format: 'Letter',
    printBackground: true,
    margin: {
      top: '0.5in',
      right: '0.5in',
      bottom: '0.5in',
      left: '0.5in'
    },
    scale: 0.72,
    preferCSSPageSize: false
  });

  console.log('PDF generated: building-effective-custom-gpts.pdf');

  await browser.close();
  server.close();

  console.log('Done!');
}

generatePDF().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
