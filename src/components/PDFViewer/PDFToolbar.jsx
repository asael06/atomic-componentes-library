import { Box, Button, Modal, Tooltip } from "@mui/material";
import { PDFPrewiewerStyles } from "../../styles";
import ResponsiveVisibility from "../../utils/ResponsiveVisibility";
import {
  Search as SearchIcon,
  ArrowDownward,
  ArrowUpward,
  ZoomOut,
  ZoomIn,
  Fullscreen,
  Download,
  FolderOpen,
  Print,
  RotateLeft,
  RotateRight,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

import PDFmenu from "./PDFmenu";
import { useState } from "react";
import { PDFSearch } from "./PDFSearch";

export const PDFViewerToolbar = ({
  zoomControls = true,
  pagesControl = true,
  fullScreen = true,
  download = true,
  openFile = false,
  print = true,
  rotate = true,
  search = true,
  setPageNumber,
  pageNumber,
  numPages,
  zoom,
  setZoom,
  canvasRef,
  pdfText,
  setPdfText,
  ctx,
  pdfDoc, // Add pdfDoc prop
  file, // Add file prop for download
  onFileOpen, // Add callback for file open
  rotation: externalRotation, // Add external rotation state
  setRotation: setExternalRotation, // Add external rotation setter
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [localRotation, setLocalRotation] = useState(0);

  // Use external rotation if provided, otherwise use local state
  const rotation =
    externalRotation !== undefined ? externalRotation : localRotation;
  const setRotation = setExternalRotation || setLocalRotation;

  const theme = useTheme();
  const styles = PDFPrewiewerStyles(theme);

  const handleClick = (event) => {
    setOpenModal(openModal ? null : event.currentTarget);
  };

  const handleFullScreen = () => {
    const container = document.getElementById("pdf-viewer-container");
    if (container) {
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch((err) => {
          console.error("Error attempting to enable fullscreen:", err);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  const handleDownload = () => {
    if (file) {
      const link = document.createElement("a");
      link.href = file;
      link.download = "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file && onFileOpen) {
        const url = URL.createObjectURL(file);
        onFileOpen(url);
      }
    };
    input.click();
  };

  const handlePrint = async () => {
    if (!pdfDoc || !canvasRef.current || !numPages) {
      console.warn(
        "PDF document, canvas, or page count not available for printing"
      );
      return;
    }

    // Inform user about optimizing print settings
    console.log(
      "💡 Tip: For best print results, disable 'Headers and footers' in your browser's print dialog to remove date/URL from printout."
    );
    console.log(`🖨️ Printing with scale: 2.0 (viewer scale: ${zoom})`);

    try {
      // Create print styles
      const printStyles = `
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

      // Add print styles if not already added
      let printStyleSheet = document.getElementById("printStyles");
      if (printStyleSheet) {
        printStyleSheet.remove(); // Remove old styles to prevent conflicts
      }

      printStyleSheet = document.createElement("style");
      printStyleSheet.id = "printStyles";
      printStyleSheet.textContent = printStyles;
      document.head.appendChild(printStyleSheet);

      // Create or get print area
      let printArea = document.getElementById("printableArea");
      if (printArea) {
        printArea.remove(); // Remove old print area to prevent duplicates
      }

      printArea = document.createElement("div");
      printArea.id = "printableArea";
      document.body.appendChild(printArea);

      // Clear previous content and add header
      printArea.innerHTML = "";

      // Render all pages
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        try {
          // Get the page
          const page = await pdfDoc.getPage(pageNum);
          // Use a higher scale for printing to ensure proper size (2.0 for high quality)
          const printScale = 2.0;
          const viewport = page.getViewport({
            scale: printScale,
            rotation: rotation,
          });

          // Create a temporary canvas for this page
          const tempCanvas = document.createElement("canvas");
          const tempCtx = tempCanvas.getContext("2d");
          tempCanvas.width = viewport.width;
          tempCanvas.height = viewport.height;

          // Render the page to the temporary canvas
          await page.render({
            canvasContext: tempCtx,
            viewport: viewport,
          }).promise;

          // Convert to image data
          const pageDataUrl = tempCanvas.toDataURL("image/png", 1.0);

          // Add page to print area
          const pageDiv = document.createElement("div");
          pageDiv.className = "print-page";
          pageDiv.innerHTML = `
            <img src="${pageDataUrl}" alt="PDF Page ${pageNum}" />
          `;
          printArea.appendChild(pageDiv);
        } catch (error) {
          console.error(`Error rendering page ${pageNum}:`, error);
          // Add error placeholder
          const errorDiv = document.createElement("div");
          errorDiv.className = "print-page";
          errorDiv.innerHTML = `
            <div style="padding: 50px; border: 1px solid #ccc; text-align: center; font-family: Arial, sans-serif;">
              Error loading page ${pageNum}
            </div>
          `;
          printArea.appendChild(errorDiv);
        }
      }

      console.log(
        `Print preparation complete. Total pages rendered: ${printArea.children.length}`
      );

      // Store original document title
      const originalTitle = document.title;

      // Set a clean title for printing (appears in browser headers)
      document.title = "PDF Document";

      // Add event listener for after print to clean up
      const handleAfterPrint = () => {
        // Restore original title
        document.title = originalTitle;

        // Clean up print area and styles
        const printAreaToRemove = document.getElementById("printableArea");
        const printStylesToRemove = document.getElementById("printStyles");
        if (printAreaToRemove) {
          printAreaToRemove.remove();
        }
        if (printStylesToRemove) {
          printStylesToRemove.remove();
        }

        // Remove event listener
        window.removeEventListener("afterprint", handleAfterPrint);
      };

      // Add event listener for cleanup after printing
      window.addEventListener("afterprint", handleAfterPrint);

      // Small delay to ensure all images are loaded, then print
      setTimeout(() => {
        window.print();
      }, 1000);
    } catch (error) {
      console.error("Error preparing document for printing:", error);
    }
  };

  const handleRotateBackward = async () => {
    const newRotation = (rotation - 90) % 360;
    console.log(`🔄 Rotating backward: ${rotation}° → ${newRotation}°`);
    setRotation(newRotation);

    // Re-render the current page with new rotation
    if (pdfDoc && canvasRef.current) {
      try {
        const page = await pdfDoc.getPage(pageNumber);
        const viewport = page.getViewport({
          scale: zoom,
          rotation: newRotation,
        });

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
        console.log(`✅ Page rotated to ${newRotation}°`);
      } catch (error) {
        console.error("Error rotating page:", error);
      }
    }
  };

  const handleRotateForward = async () => {
    const newRotation = (rotation + 90) % 360;
    console.log(`🔄 Rotating forward: ${rotation}° → ${newRotation}°`);
    setRotation(newRotation);

    // Re-render the current page with new rotation
    if (pdfDoc && canvasRef.current) {
      try {
        const page = await pdfDoc.getPage(pageNumber);
        const viewport = page.getViewport({
          scale: zoom,
          rotation: newRotation,
        });

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
        console.log(`✅ Page rotated to ${newRotation}°`);
      } catch (error) {
        console.error("Error rotating page:", error);
      }
    }
  };

  const open = Boolean(openModal);
  const id = open ? "simple-popper" : undefined;

  return (
    <Box style={styles.pdfToolbar}>
      <Box style={styles.navigationControls}>
        {search && (
          <ResponsiveVisibility showFrom="sm">
            <Button
              sx={styles.toolbarButton}
              onClick={(event) => handleClick(event)}
            >
              <SearchIcon />
            </Button>
          </ResponsiveVisibility>
        )}

        {pagesControl && (
          <>
            <Tooltip title="Página Anterior">
              <Button
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber((prev) => prev - 1)}
                sx={styles.toolbarButton}
              >
                <ArrowUpward />
              </Button>
            </Tooltip>
            <ResponsiveVisibility showFrom="sm">
              {pageNumber}/ {numPages}
            </ResponsiveVisibility>
            <Tooltip title="Página Siguiente">
              <Button
                disabled={pageNumber >= numPages}
                onClick={() => setPageNumber((prev) => prev + 1)}
                sx={styles.toolbarButton}
              >
                <ArrowDownward />
              </Button>
            </Tooltip>
          </>
        )}
      </Box>
      {zoomControls && (
        <Box style={styles.toolbarButton}>
          <Tooltip title="Aumentar Zoom">
            <Button
              onClick={() => setZoom((prev) => Math.min(prev + 0.1, 3))}
              disabled={zoom >= 3}
              sx={styles.toolbarButton}
            >
              <ZoomIn />
            </Button>
          </Tooltip>
          <Tooltip title="Ajustar Zoom">
            <Box>{Math.round(zoom * 100)}%</Box>
          </Tooltip>
          <Tooltip title="Disminuir Zoom">
            <Button
              onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.1))}
              disabled={zoom <= 0.1}
              sx={styles.toolbarButton}
            >
              <ZoomOut />
            </Button>
          </Tooltip>
        </Box>
      )}

      <Box style={styles.toolbarButton}>
        {fullScreen && (
          <ResponsiveVisibility showFrom="sm">
            <Tooltip title="Pantalla Completa">
              <Button onClick={handleFullScreen} sx={styles.toolbarButton}>
                <Fullscreen />
              </Button>
            </Tooltip>
          </ResponsiveVisibility>
        )}
        {download && (
          <ResponsiveVisibility showFrom="sm">
            <Tooltip title="Descargar PDF">
              <Button onClick={handleDownload} sx={styles.toolbarButton}>
                <Download />
              </Button>
            </Tooltip>
          </ResponsiveVisibility>
        )}

        {openFile && (
          <ResponsiveVisibility showFrom="sm">
            <Tooltip title="Abrir PDF">
              <Button onClick={handleOpenFile} sx={styles.toolbarButton}>
                <FolderOpen />
              </Button>
            </Tooltip>
          </ResponsiveVisibility>
        )}
        {print && (
          <ResponsiveVisibility showFrom="sm">
            <Tooltip title="Imprimir PDF (Tip: Desactiva 'Encabezados y pies de página' en el diálogo de impresión para un mejor resultado)">
              <Button onClick={handlePrint} sx={styles.toolbarButton}>
                <Print />
              </Button>
            </Tooltip>
          </ResponsiveVisibility>
        )}
        {rotate && (
          <ResponsiveVisibility showFrom="sm">
            <Tooltip title="Rotar PDF hacia atrás">
              <Button onClick={handleRotateBackward} sx={styles.toolbarButton}>
                <RotateLeft />
              </Button>
            </Tooltip>
            <Tooltip title="Rotar PDF hacia adelante">
              <Button onClick={handleRotateForward} sx={styles.toolbarButton}>
                <RotateRight />
              </Button>
            </Tooltip>
          </ResponsiveVisibility>
        )}
        <PDFmenu
          search={search}
          fullScreen={fullScreen}
          download={download}
          openFile={openFile}
          print={print}
          rotate={rotate}
          handleOnClick={handleClick}
          handleFullScreen={handleFullScreen}
          handleDownload={handleDownload}
          handleOpenFile={handleOpenFile}
          handlePrint={handlePrint}
          handleRotateBackward={handleRotateBackward}
          handleRotateForward={handleRotateForward}
          handleSearch={() => setOpenModal(true)}
          setPageNumber={setPageNumber}
          pageNumber={pageNumber}
          numPages={numPages}
        />
      </Box>
      <Modal
        id={id}
        open={openModal}
        onClose={() => setOpenModal(false)}
        container={document.getElementById("pdf-viewer-container") || undefined}
        sx={styles.modal}
        slotProps={{
          backdrop: {
            sx: { backgroundColor: "transparent", position: "absolute" },
          },
        }}
        className="fade-in"
      >
        <PDFSearch
          handleClick={handleClick}
          pdfText={pdfText}
          setPdfText={setPdfText}
          canvasRef={canvasRef}
          ctx={ctx}
          zoom={zoom}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          numPages={numPages}
          pdfDoc={pdfDoc}
        />
      </Modal>
    </Box>
  );
};
