import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { getTheme } from "./index";
import PropTypes from "prop-types";

// Create theme context
const ThemeContext = createContext();

// Custom hook to use theme context
export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within a ThemeProvider");
  }
  return context;
};

// Theme Provider Component
export const ThemeProvider = ({
  children,
  defaultMode = "light",
  enableSystemPreference = true,
  storageKey = "atomic-ui-theme-mode",
}) => {
  const [mode, setMode] = useState(() => {
    // Try to get saved mode from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved && (saved === "light" || saved === "dark")) {
        return saved;
      }

      // Check system preference if enabled
      if (enableSystemPreference && window.matchMedia) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
    }

    return defaultMode;
  });

  // Listen for system preference changes
  useEffect(() => {
    if (!enableSystemPreference || typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      // Only update if no manual preference is stored
      const saved = localStorage.getItem(storageKey);
      if (!saved) {
        setMode(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [enableSystemPreference, storageKey]);

  // Save mode to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, mode);
    }
  }, [mode, storageKey]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const setThemeMode = (newMode) => {
    if (newMode === "light" || newMode === "dark") {
      setMode(newMode);
    }
  };

  const theme = getTheme(mode);

  const contextValue = {
    mode,
    toggleTheme,
    setThemeMode,
    isDark: mode === "dark",
    isLight: mode === "light",
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultMode: PropTypes.oneOf(["light", "dark"]),
  enableSystemPreference: PropTypes.bool,
  storageKey: PropTypes.string,
};

// Simple theme provider without context (for basic usage)
export const SimpleThemeProvider = ({ children, mode = "light" }) => {
  const theme = getTheme(mode);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

SimpleThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  mode: PropTypes.oneOf(["light", "dark"]),
};
