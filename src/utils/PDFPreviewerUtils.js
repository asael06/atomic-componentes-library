/**
 * PDF Previewer Utility Functions
 * Contains all utility functions for PDF text extraction, search, and highlighting
 */

/**
 * Extract text from all pages of a PDF document in parallel
 * @param {Object} pdfDoc - PDF.js document instance
 * @param {number} numPages - Total number of pages in the PDF
 * @returns {Promise<Object>} Object with page numbers as keys and text items as values
 */
export const extractAllPagesText = async (pdfDoc, numPages) => {
  if (!pdfDoc || !numPages) return {};

  const allText = {};
  const promises = [];

  // Extract text from all pages in parallel
  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    promises.push(
      (async () => {
        try {
          const page = await pdfDoc.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageTextItems = textContent.items.map((item) => {
            const transform = item.transform;
            return {
              x: transform[4],
              y: transform[5],
              width: item.width,
              height: item.height || 10,
              str: item.str,
              fontName: item.fontName || "sans-serif",
              pageNumber: pageNum,
            };
          });

          allText[pageNum] = pageTextItems;
        } catch (error) {
          console.error(`Error extracting text from page ${pageNum}:`, error);
          allText[pageNum] = []; // Fallback to empty array
        }
      })()
    );
  }

  await Promise.all(promises);
  return allText;
};

/**
 * Find matches in a page's text items
 * @param {Array} textItems - Array of text items from a page
 * @param {string} searchText - Text to search for
 * @param {number} targetPageNumber - Page number where these text items belong
 * @returns {Array} Array of match objects
 */
export const findMatchesInPage = (textItems, searchText, targetPageNumber) => {
  const lowerSearch = searchText.toLowerCase();

  return textItems.reduce((matches, item, itemIndex) => {
    const lowerStr = item.str.toLowerCase();
    let matchIndex = 0;

    // Find all occurrences in this text item
    while ((matchIndex = lowerStr.indexOf(lowerSearch, matchIndex)) !== -1) {
      matches.push({
        itemIndex,
        matchIndex,
        item: { ...item, pageNumber: targetPageNumber },
        text: item.str.substring(matchIndex, matchIndex + searchText.length),
        pageNumber: targetPageNumber,
      });
      matchIndex += 1;
    }
    return matches;
  }, []);
};

/**
 * Find all matches for a search term across all pages
 * @param {string} searchText - Text to search for
 * @param {Array} pdfText - Current page text items
 * @param {number} pageNumber - Current page number
 * @param {Object} allPagesText - All pages text data
 * @returns {Array} Array of all matches sorted by page and position
 */
export const findMatches = (searchText, pdfText, pageNumber, allPagesText) => {
  if (!searchText) return [];

  const foundMatches = [];

  // Search in current page text first (for immediate results)
  if (pdfText && pdfText.length > 0) {
    foundMatches.push(...findMatchesInPage(pdfText, searchText, pageNumber));
  }

  // Search in all other pages
  Object.entries(allPagesText).forEach(([pageNum, pageTextItems]) => {
    const targetPageNum = parseInt(pageNum);
    if (targetPageNum !== pageNumber) {
      foundMatches.push(
        ...findMatchesInPage(pageTextItems, searchText, targetPageNum)
      );
    }
  });

  // Sort matches by page number, then by position
  return foundMatches.sort((a, b) => {
    if (a.pageNumber !== b.pageNumber) {
      return a.pageNumber - b.pageNumber;
    }
    return b.item.y - a.item.y; // Higher y first (PDF coordinates are bottom-up)
  });
};

/**
 * Highlight matches on the current page
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @param {Array} matchesToHighlight - Array of matches to highlight
 * @param {number} pageNumber - Current page number
 * @param {number} zoom - Current zoom level
 * @param {string} searchText - Search text for measuring width
 * @param {number} currentMatchIndex - Index of the current selected match
 */
export const highlightMatches = (
  ctx,
  matchesToHighlight,
  pageNumber,
  zoom,
  searchText,
  currentMatchIndex
) => {
  if (!ctx || !matchesToHighlight.length) return;

  // Clear previous highlights
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Only highlight matches on the current page
  const currentPageMatches = matchesToHighlight.filter(
    (match) => match.pageNumber === pageNumber
  );

  if (currentPageMatches.length === 0) return;

  // Batch highlight operations for better performance
  currentPageMatches.forEach((match) => {
    const { item, matchIndex } = match;
    // Find the correct global index for this match
    const globalMatchIndex = matchesToHighlight.indexOf(match);

    // Set up font context to measure text properly
    ctx.font = `${item.height * zoom}px ${item.fontName}`;

    const previousText = item.str.substring(0, matchIndex);
    const matchText = item.str.substring(
      matchIndex,
      matchIndex + searchText.length
    );

    const previousTextWidth = ctx.measureText(previousText).width;
    const matchWidth = ctx.measureText(matchText).width;

    // Use different colors for current match vs other matches
    ctx.fillStyle =
      globalMatchIndex === currentMatchIndex
        ? "rgba(255, 165, 0, 0.6)" // Orange for current match
        : "rgba(255, 255, 0, 0.4)"; // Yellow for other matches

    ctx.fillRect(
      item.x * zoom + previousTextWidth,
      ctx.canvas.height - (item.y * zoom + item.height * zoom),
      matchWidth,
      item.height * zoom
    );
  });
};

/**
 * Calculate navigation indices for next/previous match
 * @param {number} currentIndex - Current match index
 * @param {number} totalMatches - Total number of matches
 * @param {boolean} isNext - Whether navigating to next (true) or previous (false)
 * @returns {number} New match index
 */
export const calculateNavigationIndex = (
  currentIndex,
  totalMatches,
  isNext
) => {
  if (totalMatches === 0) return 0;

  if (isNext) {
    return (currentIndex + 1) % totalMatches;
  } else {
    return currentIndex === 0 ? totalMatches - 1 : currentIndex - 1;
  }
};

/**
 * Calculate match info for display
 * @param {Array} matches - Array of all matches
 * @param {number} currentMatchIndex - Current match index
 * @returns {Object} Match info object with current, total, and page number
 */
export const calculateMatchInfo = (matches, currentMatchIndex) => {
  if (matches.length === 0) {
    return { current: "0", total: "0", currentPageNumber: null };
  }

  return {
    current: (currentMatchIndex + 1).toString(),
    total: matches.length.toString(),
    currentPageNumber: matches[currentMatchIndex]?.pageNumber,
  };
};

/**
 * Clear canvas highlights
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 */
export const clearHighlights = (ctx) => {
  if (ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
};

/**
 * Debug logging for search operations
 * @param {string} operation - Type of operation (search, navigation, etc.)
 * @param {Object} data - Data to log
 */
export const debugLog = (operation, data) => {
  // Only log in development mode
  try {
    if (
      import.meta.env?.MODE === "development" ||
      (typeof window !== "undefined" &&
        window.location?.hostname === "localhost")
    ) {
      console.log(`[PDFSearch ${operation}]:`, data);
    }
  } catch {
    // Silently ignore errors in environments where these checks might fail
  }
};

/**
 * Print-related utility functions
 */

/**
 * Create print styles for PDF pages
 * @returns {string} CSS styles for printing
 */
export const createPrintStyles = () => {
  return `
    @media print {
      @page {
        size: auto;
        margin: 0.5in;
      }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        height: auto !important;
        background: white !important;
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      /* Hide all elements except our printable area */
      body * {
        visibility: hidden;
      }
      #printableArea, #printableArea * {
        visibility: visible;
      }
      #printableArea {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        height: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        background: white !important;
      }
      .print-page {
        margin: 0 0 15px 0;
        text-align: center;
        page-break-inside: avoid;
        background: white !important;
        orphans: 3;
        widows: 3;
      }
      .print-page:last-child {
        page-break-after: avoid !important;
        margin-bottom: 0;
      }
      .print-page img {
        max-width: 100% !important;
        width: auto !important;
        height: auto !important;
        margin: 0 auto;
        display: block;
        page-break-inside: avoid;
        background: white !important;
        border: none !important;
        box-shadow: none !important;
      }
      .page-header {
        font-family: Arial, sans-serif;
        font-size: 12px;
        margin-bottom: 5px;
        text-align: center;
        page-break-inside: avoid;
      }
      .document-header {
        page-break-inside: avoid;
        page-break-after: avoid;
        margin-bottom: 10px;
      }
    }
    @media screen {
      #printableArea {
        position: fixed;
        top: -9999px;
        left: -9999px;
        visibility: hidden;
      }
    }
  `;
};

/**
 * Add or update print styles in the document
 * @param {string} styles - CSS styles to add
 */
export const addPrintStyles = (styles) => {
  // Remove existing print styles to prevent conflicts
  let printStyleSheet = document.getElementById("printStyles");
  if (printStyleSheet) {
    printStyleSheet.remove();
  }

  // Add new print styles
  printStyleSheet = document.createElement("style");
  printStyleSheet.id = "printStyles";
  printStyleSheet.type = "text/css";
  printStyleSheet.innerHTML = styles;
  document.head.appendChild(printStyleSheet);
};

/**
 * Remove print styles from the document
 */
export const removePrintStyles = () => {
  const printStyleSheet = document.getElementById("printStyles");
  if (printStyleSheet) {
    printStyleSheet.remove();
  }
};

/**
 * Render a PDF page to canvas
 * @param {Object} pdfDoc - PDF.js document instance
 * @param {number} pageNumber - Page number to render
 * @param {number} scale - Scale factor for rendering
 * @param {number} rotation - Rotation angle in degrees
 * @returns {Promise<HTMLCanvasElement>} Canvas element with rendered page
 */
export const renderPageToCanvas = async (
  pdfDoc,
  pageNumber,
  scale = 2.0,
  rotation = 0
) => {
  const page = await pdfDoc.getPage(pageNumber);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // Get viewport with rotation
  const viewport = page.getViewport({ scale, rotation });
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  // Render page to canvas
  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };

  await page.render(renderContext).promise;
  return canvas;
};

/**
 * Convert canvas to image data URL
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {string} format - Image format (default: 'image/png')
 * @param {number} quality - Image quality (0-1, for JPEG)
 * @returns {string} Data URL of the image
 */
export const canvasToDataURL = (
  canvas,
  format = "image/png",
  quality = 1.0
) => {
  return canvas.toDataURL(format, quality);
};

/**
 * Rotation utility functions
 */

/**
 * Normalize rotation angle to 0-270 degrees
 * @param {number} rotation - Rotation angle in degrees
 * @returns {number} Normalized rotation angle
 */
export const normalizeRotation = (rotation) => {
  return ((rotation % 360) + 360) % 360;
};

/**
 * Get next rotation angle (clockwise)
 * @param {number} currentRotation - Current rotation angle
 * @returns {number} Next rotation angle
 */
export const getNextRotation = (currentRotation) => {
  return normalizeRotation(currentRotation + 90);
};

/**
 * Get previous rotation angle (counter-clockwise)
 * @param {number} currentRotation - Current rotation angle
 * @returns {number} Previous rotation angle
 */
export const getPreviousRotation = (currentRotation) => {
  return normalizeRotation(currentRotation - 90);
};

/**
 * File handling utility functions
 */

/**
 * Trigger file download with given data
 * @param {string} data - Data to download (URL or data URL)
 * @param {string} filename - Filename for the download
 */
export const downloadFile = (data, filename) => {
  const link = document.createElement("a");
  link.href = data;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Open file picker dialog
 * @param {string} accept - File types to accept (e.g., '.pdf')
 * @param {boolean} multiple - Allow multiple file selection
 * @returns {Promise<FileList>} Selected files
 */
export const openFilePicker = (accept = ".pdf", multiple = false) => {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.multiple = multiple;

    input.onchange = (event) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        resolve(files);
      } else {
        reject(new Error("No files selected"));
      }
    };

    input.oncancel = () => {
      reject(new Error("File selection cancelled"));
    };

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  });
};

/**
 * Zoom utility functions
 */

/**
 * Calculate zoom level based on fit-to-width
 * @param {number} pageWidth - Width of the PDF page
 * @param {number} containerWidth - Width of the container
 * @param {number} padding - Padding to account for (default: 40px)
 * @returns {number} Zoom level
 */
export const calculateFitToWidthZoom = (
  pageWidth,
  containerWidth,
  padding = 40
) => {
  return (containerWidth - padding) / pageWidth;
};

/**
 * Calculate zoom level based on fit-to-height
 * @param {number} pageHeight - Height of the PDF page
 * @param {number} containerHeight - Height of the container
 * @param {number} padding - Padding to account for (default: 40px)
 * @returns {number} Zoom level
 */
export const calculateFitToHeightZoom = (
  pageHeight,
  containerHeight,
  padding = 40
) => {
  return (containerHeight - padding) / pageHeight;
};

/**
 * Get zoom presets
 * @returns {Array<{label: string, value: number}>} Array of zoom presets
 */
export const getZoomPresets = () => [
  { label: "25%", value: 0.25 },
  { label: "50%", value: 0.5 },
  { label: "75%", value: 0.75 },
  { label: "100%", value: 1.0 },
  { label: "125%", value: 1.25 },
  { label: "150%", value: 1.5 },
  { label: "200%", value: 2.0 },
  { label: "300%", value: 3.0 },
  { label: "400%", value: 4.0 },
];

/**
 * Performance monitoring utilities
 */

/**
 * Measure execution time of a function
 * @param {Function} fn - Function to measure
 * @param {string} label - Label for the measurement
 * @returns {Promise<any>} Result of the function
 */
export const measureTime = async (fn, label = "Operation") => {
  const startTime = performance.now();
  const result = await fn();
  const endTime = performance.now();

  debugLog("performance", {
    label,
    duration: `${(endTime - startTime).toFixed(2)}ms`,
  });

  return result;
};
