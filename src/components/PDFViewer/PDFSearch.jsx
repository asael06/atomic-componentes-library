import { Box, Button, Typography, Tooltip } from "@mui/material";
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Close,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { PDFPrewiewerStyles } from "../../styles";
import {
  extractAllPagesText,
  findMatches,
  highlightMatches,
  calculateNavigationIndex,
  calculateMatchInfo,
  clearHighlights,
  debugLog,
} from "../../utils/PDFPreviewerUtils";

export const PDFSearch = ({
  handleClick,
  ctx,
  pdfText,
  zoom,
  pageNumber,
  setPageNumber,
  numPages,
  pdfDoc, // Add pdfDoc to search across all pages
}) => {
  const theme = useTheme();
  const styles = PDFPrewiewerStyles(theme);
  const [searchText, setSearchText] = useState("");
  const [matches, setMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [allPagesText, setAllPagesText] = useState({});
  const [isNavigating, setIsNavigating] = useState(false); // Flag to prevent search reset during navigation

  // Optimized text extraction with memoization
  const extractText = useCallback(async () => {
    if (!pdfDoc || !numPages) return;

    const allText = await extractAllPagesText(pdfDoc, numPages);
    setAllPagesText(allText);
  }, [pdfDoc, numPages]);

  // Extract all pages text when component mounts or pdfDoc changes
  useEffect(() => {
    if (pdfDoc && numPages) {
      extractText();
    }
  }, [pdfDoc, numPages, extractText]);

  // Optimized search function with memoization
  const searchMatches = useCallback(
    (text) => {
      return findMatches(text, pdfText, pageNumber, allPagesText);
    },
    [pdfText, allPagesText, pageNumber]
  );

  // Optimized highlighting function
  const highlight = useCallback(
    (matchesToHighlight = matches) => {
      highlightMatches(
        ctx,
        matchesToHighlight,
        pageNumber,
        zoom,
        searchText,
        currentMatchIndex
      );
    },
    [ctx, matches, pageNumber, zoom, searchText, currentMatchIndex]
  );

  // Optimized search handler with debouncing
  const handleSearch = useCallback(() => {
    if (!searchText || !ctx) {
      setMatches([]);
      setCurrentMatchIndex(0);
      clearHighlights(ctx);
      return;
    }

    const foundMatches = searchMatches(searchText);

    debugLog("search", {
      matches: foundMatches.length,
      isNavigating,
      currentIndex: currentMatchIndex,
    });

    setMatches(foundMatches);

    // Only reset currentMatchIndex if this is a new search (not navigation)
    // Check if the number of matches changed or if we're not navigating
    if (!isNavigating || foundMatches.length !== matches.length) {
      debugLog("search-reset-index", { from: currentMatchIndex, to: 0 });
      setCurrentMatchIndex(0);
    } else {
      debugLog("search-keep-index", { index: currentMatchIndex });
    }

    highlight(foundMatches);
  }, [
    searchText,
    ctx,
    searchMatches,
    isNavigating,
    matches.length,
    highlight,
    currentMatchIndex,
  ]);

  // Optimized clear handler
  const handleClear = useCallback(() => {
    clearHighlights(ctx);
    setSearchText("");
    setMatches([]);
    setCurrentMatchIndex(0);
    setIsNavigating(false);
  }, [ctx]);

  // Optimized navigation handlers
  const handleNextMatch = useCallback(() => {
    if (matches.length === 0) return;

    setIsNavigating(true);
    const nextIndex = calculateNavigationIndex(
      currentMatchIndex,
      matches.length,
      true
    );
    const nextMatch = matches[nextIndex];

    debugLog("next-match", {
      from: currentMatchIndex,
      to: nextIndex,
      total: matches.length,
    });

    setCurrentMatchIndex(nextIndex);

    // Navigate to the page containing the next match if needed
    if (nextMatch.pageNumber !== pageNumber) {
      setPageNumber(nextMatch.pageNumber);
    }

    // Clear navigation flag after a short delay
    setTimeout(() => setIsNavigating(false), 100);
  }, [matches, currentMatchIndex, pageNumber, setPageNumber]);

  const handlePrevMatch = useCallback(() => {
    if (matches.length === 0) return;

    setIsNavigating(true);
    const prevIndex = calculateNavigationIndex(
      currentMatchIndex,
      matches.length,
      false
    );
    const prevMatch = matches[prevIndex];

    debugLog("prev-match", {
      from: currentMatchIndex,
      to: prevIndex,
      total: matches.length,
    });

    setCurrentMatchIndex(prevIndex);

    // Navigate to the page containing the previous match if needed
    if (prevMatch.pageNumber !== pageNumber) {
      setPageNumber(prevMatch.pageNumber);
    }

    // Clear navigation flag after a short delay
    setTimeout(() => setIsNavigating(false), 100);
  }, [matches, currentMatchIndex, pageNumber, setPageNumber]);

  // Memoized computed values for better performance
  const matchInfo = useMemo(() => {
    const info = calculateMatchInfo(matches, currentMatchIndex);
    debugLog("match-info", info);
    return info;
  }, [matches, currentMatchIndex]);

  // Debounced auto-search effect - only for text changes, not navigation
  useEffect(() => {
    // Don't trigger search during navigation
    if (isNavigating) return;

    const timeoutId = setTimeout(() => {
      if (searchText) {
        handleSearch();
      } else {
        handleClear();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchText, handleSearch, handleClear, isNavigating]);

  // Separate effect for when PDF text is loaded - perform search but preserve navigation state
  useEffect(() => {
    if (searchText && Object.keys(allPagesText).length > 0 && !isNavigating) {
      // Re-search when all pages text becomes available
      const foundMatches = searchMatches(searchText);

      // Only update matches if they actually changed
      if (foundMatches.length !== matches.length) {
        setMatches(foundMatches);
        // Reset match index only if this is significantly different results
        setCurrentMatchIndex(0);
      } else {
        setMatches(foundMatches);
        // Keep current match index if similar number of results
      }

      highlight(foundMatches);
    }
  }, [
    allPagesText,
    searchText,
    isNavigating,
    searchMatches,
    highlight,
    matches.length,
  ]);

  // Optimized page change effect
  useEffect(() => {
    if (matches.length > 0 && searchText && ctx) {
      const timeoutId = setTimeout(() => {
        highlight();
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [pageNumber, ctx, matches.length, searchText, highlight]);

  // Optimized current match index change effect
  useEffect(() => {
    if (matches.length > 0 && searchText && ctx) {
      highlight();
    }
  }, [currentMatchIndex, matches.length, searchText, ctx, highlight]);

  // Clean up highlights when component unmounts
  useEffect(() => {
    return () => {
      clearHighlights(ctx);
    };
  }, [ctx]);

  return (
    <Box sx={styles.searchContainer}>
      <input
        style={styles.searchInput}
        autoFocus
        placeholder="Buscar en el documento"
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />

      <Box
        sx={{
          padding: "8px",
          gap: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Tooltip title="Anterior coincidencia">
          <Button
            onClick={handlePrevMatch}
            sx={styles.toolbarButton}
            disabled={matches.length === 0}
          >
            <KeyboardArrowLeft />
          </Button>
        </Tooltip>
        <Typography sx={{ minWidth: "80px", textAlign: "center" }}>
          {`${matchInfo.current}/${matchInfo.total}`}
        </Typography>
        {matchInfo.currentPageNumber && (
          <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
            Página {matchInfo.currentPageNumber}
          </Typography>
        )}
        <Tooltip title="Siguiente coincidencia">
          <Button
            onClick={handleNextMatch}
            sx={styles.toolbarButton}
            disabled={matches.length === 0}
          >
            <KeyboardArrowRight />
          </Button>
        </Tooltip>
        <Tooltip title="Buscar">
          <Button onClick={handleSearch} sx={styles.searchButton}>
            <Typography>Buscar</Typography>
          </Button>
        </Tooltip>
        <Tooltip title="Limpiar">
          <Button onClick={handleClear} sx={styles.searchButton}>
            <Typography>Limpiar</Typography>
          </Button>
        </Tooltip>
        <Tooltip title="Cerrar">
          <Button onClick={(e) => handleClick(e)} sx={styles.toolbarButton}>
            <Close />
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default PDFSearch;
