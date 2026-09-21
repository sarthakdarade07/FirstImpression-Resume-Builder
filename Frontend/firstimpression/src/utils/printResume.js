/**
 * Custom Print Utility for Resume Document Printing
 * Extracts compiled CSSOM rules (Tailwind, template styles, fonts) + link elements,
 * strips screen-only zoom transformations, suppresses browser headers/footers (date, title, URL, page numbers),
 * and prints as a clean, high-resolution vector document inside an isolated iframe.
 *
 * @param {HTMLElement} resumeElement - The DOM node containing the rendered resume
 * @param {string} documentTitle - Title for the print document / PDF output
 */
export function printResumeHTML(resumeElement, documentTitle = '') {
  if (!resumeElement) {
    console.warn('printResumeHTML: No resume element provided.');
    return;
  }

  // 1. Collect all CSS rules from document.styleSheets
  let extractedCssText = '';
  const externalLinkTags = [];

  Array.from(document.styleSheets).forEach((sheet) => {
    try {
      if (sheet.cssRules) {
        Array.from(sheet.cssRules).forEach((rule) => {
          extractedCssText += rule.cssText + '\n';
        });
      }
    } catch (e) {
      // Cross-origin stylesheet (e.g. Google Fonts)
      if (sheet.href) {
        externalLinkTags.push(`<link rel="stylesheet" href="${sheet.href}">`);
      }
    }
  });

  // Include explicit link stylesheets from head
  Array.from(document.querySelectorAll('link[rel="stylesheet"]')).forEach((link) => {
    if (link.href && !externalLinkTags.some((tag) => tag.includes(link.href))) {
      externalLinkTags.push(link.outerHTML);
    }
  });

  // 2. Clone element & strip screen zoom inline transforms
  const clonedNode = resumeElement.cloneNode(true);
  clonedNode.style.transform = 'none';
  clonedNode.style.transformOrigin = 'initial';
  clonedNode.style.margin = '0 auto';
  clonedNode.style.boxShadow = 'none';
  clonedNode.style.border = 'none';

  // Strip inline scale transforms on any child zoom wrappers
  const zoomContainers = clonedNode.querySelectorAll('.resume-screen-zoom-wrapper');
  zoomContainers.forEach((el) => {
    el.style.transform = 'none';
    el.style.transformOrigin = 'initial';
    el.style.margin = '0 auto';
    el.style.boxShadow = 'none';
  });

  const resumeHTML = clonedNode.outerHTML || clonedNode.innerHTML;

  // 3. Create a hidden iframe for isolated vector printing
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);

  const iframeWin = iframe.contentWindow || iframe.contentDocument;
  const doc = iframeWin.document || iframeWin;

  // 4. Construct complete HTML with @page { margin: 0 } to suppress browser headers/footers
  const fullDocumentHTML = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title></title>
        ${externalLinkTags.join('\n')}
        <style>
          ${extractedCssText}

          @page {
            size: A4 portrait;
            margin: 0 !important; /* Suppresses browser date, title, URL, and page numbers */
          }
          *, *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm !important;
            height: auto !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
            text-rendering: optimizeLegibility !important;
            overflow: visible !important;
          }
          body {
            display: block !important;
            visibility: visible !important;
          }
          .resume-screen-zoom-wrapper {
            transform: none !important;
            zoom: 1 !important;
            margin: 0 auto !important;
            padding: 0 !important;
            width: 210mm !important;
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
          }
          .resume-page,
          .resume-viewport,
          [class*="template-"] {
            transform: none !important;
            zoom: 1 !important;
            margin: 0 auto !important;
            padding: 10mm 12mm !important; /* Document margins inside page */
            width: 210mm !important;
            max-width: 210mm !important;
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
            box-sizing: border-box !important;
          }
          .print-hide {
            display: none !important;
            visibility: hidden !important;
          }
          .timeline-item, .experience-item, .education-item, .project-item, .certification-item, .skill-group, .contact-item, .resume-item, .block-item {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          .block-section-title, .section-title, .candidate-name, .resume-heading, h1, h2, h3, h4 {
            break-after: avoid !important;
            page-break-after: avoid !important;
          }
        </style>
      </head>
      <body>
        ${resumeHTML}
      </body>
    </html>
  `;

  // 5. Write content into iframe document
  doc.open();
  doc.write(fullDocumentHTML);
  doc.close();

  // 6. Asynchronous check for fonts & images, then trigger print
  let printed = false;
  const triggerPrint = async () => {
    if (printed) return;
    printed = true;

    try {
      // Wait for custom web fonts to finish loading
      if (doc.fonts && doc.fonts.ready) {
        await doc.fonts.ready;
      }
      // Wait for all images inside iframe document to load
      const images = Array.from(doc.images || []);
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );
    } catch (e) {
      console.warn('Asset preloading warning prior to print:', e);
    }

    setTimeout(() => {
      try {
        iframeWin.focus();
        iframeWin.print();
      } catch (err) {
        console.error('Failed to trigger iframe print:', err);
      } finally {
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 1000);
      }
    }, 200);
  };

  if (doc.readyState === 'complete') {
    triggerPrint();
  } else {
    iframeWin.onload = triggerPrint;
    setTimeout(triggerPrint, 800);
  }
}

export default printResumeHTML;
