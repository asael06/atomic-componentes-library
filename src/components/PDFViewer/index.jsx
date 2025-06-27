// src/components/PDFViewer.jsx
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { useTheme } from "@mui/material/styles";
import "pdfjs-dist/build/pdf.worker.mjs"; // Import for bundling (used internally)
import { Box } from "@mui/material";
import { PDFPrewiewerStyles } from "../../styles";
import { PDFViewerToolbar } from "./PDFToolbar";
GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export const PDFViewer = ({
  file,
  zoomControls = true,
  pagesControl = true,
  fullScreen = true,
  download = true,
  openFile = false,
  print = true,
  rotate = true,
  search = true,
  negativeHeight = 32,
  onFileChange, // Add callback for when file changes
}) => {
  const canvasRef = useRef(null);
  const canvasHighLightsRef = useRef(null);
  const [ctx, setCtx] = useState({});
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pdfText, setPdfText] = useState([]);
  const [pdfDoc, setPdfDoc] = useState(null); // Add pdfDoc state
  const [currentFile, setCurrentFile] = useState(file); // Track current file
  const theme = useTheme();

  const styles = PDFPrewiewerStyles(theme);
  styles.pdfPreviewer.height = `calc(100vh - ${negativeHeight}px)`;

  const handleFileOpen = (newFile) => {
    setCurrentFile(newFile);
    setPageNumber(1); // Reset to first page
    if (onFileChange) {
      onFileChange(newFile);
    }
  };

  useEffect(() => {
    const renderPage = async () => {
      const fileToLoad = currentFile || file;
      if (!fileToLoad) return;

      const loadingTask = getDocument(fileToLoad);
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf); // Store the PDF document
      setNumPages(pdf.numPages);

      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: zoom });
      const canvas = canvasRef.current;
      const canvasHighLights = canvasHighLightsRef.current;
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvasHighLights.width = viewport.width;
      canvasHighLights.height = viewport.height;
      const pdfText = (await page.getTextContent()) || {};
      const pdfTextItems = [];
      pdfText?.items.forEach((item) => {
        const transform = item.transform; // [a, b, c, d, e, f]
        const x = transform[4];
        const y = transform[5];
        const width = item.width;
        const height = item.height || 10; // Fallback if not provided
        pdfTextItems.push({
          x,
          y,
          width,
          height,
          str: item.str,
          fontName: item.fontName || "sans-serif",
        });
      });

      setCtx(canvasHighLights.getContext("2d"));
      setPdfText(pdfTextItems);

      await page.render({ canvasContext: context, viewport }).promise;
    };

    renderPage();
  }, [currentFile, file, pageNumber, zoom]);

  return (
    <Box sx={styles.pdfPreviewer}>
      <PDFViewerToolbar
        styles={styles}
        setPageNumber={setPageNumber}
        pageNumber={pageNumber}
        numPages={numPages}
        zoomControls={zoomControls}
        pagesControl={pagesControl}
        fullScreen={fullScreen}
        download={download}
        openFile={openFile}
        print={print}
        rotate={rotate}
        search={search}
        pdfText={pdfText}
        setPdfText={setPdfText}
        zoom={zoom}
        setZoom={setZoom}
        canvasRef={canvasRef}
        ctx={ctx}
        pdfDoc={pdfDoc}
        file={currentFile || file}
        onFileOpen={handleFileOpen}
      />
      <Box sx={styles.canvasContainer} id="pdf-viewer-container">
        <canvas ref={canvasRef} />
        <canvas
          ref={canvasHighLightsRef}
          style={{
            position: "absolute",
            top: canvasRef.current?.offsetTop || 0,
            left: canvasRef.current?.offsetLeft || 0,
            right: 0,
            bottom: 0,
          }}
        />
      </Box>
    </Box>
  );
};

PDFViewer.propTypes = {
  /** The PDF file to be displayed */
  file: PropTypes.string.isRequired,
  /** Whether to show zoom controls */
  zoomControls: PropTypes.bool,
  /** Whether to show page navigation controls */
  pagesControl: PropTypes.bool,
  /** Whether to show full screen control */
  fullScreen: PropTypes.bool,
  /** Whether to show download button */
  download: PropTypes.bool,
  /** Whether to show open file button */
  openFile: PropTypes.bool,
  /** Whether to show print button */
  print: PropTypes.bool,
  /** Whether to show rotate button */
  rotate: PropTypes.bool,
  /** Whether to show search functionality */
  search: PropTypes.bool,
  /** Height adjustment for the viewer */
  negativeHeight: PropTypes.number,
  /** Callback function when file changes */
  onFileChange: PropTypes.func,
};
