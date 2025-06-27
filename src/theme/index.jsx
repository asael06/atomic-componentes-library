import { createTheme } from "@mui/material/styles";

// Create a theme instance for both light and dark mode
export const getTheme = (mode) => {
  const darkMode = mode === "dark";
  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#FCD535",
        light: "#818cf8",
        dark: "#FDDD66",
        contrastText: "#0A0F14",
      },
      secondary: {
        main: "#FFFFFF",
        light: "#FFFFFF",
        dark: "#FFFFFF",
        contrastText: "#0A0F14",
      },
      error: {
        main: "#ef4444",
        light: "#f87171",
        dark: "#dc2626",
      },
      warning: {
        main: "#f59e0b",
        light: "#fbbf24",
        dark: "#d97706",
      },
      info: {
        main: "#3b82f6",
        light: "#60a5fa",
        dark: "#2563eb",
      },
      success: {
        main: "#10b981",
        light: "#34d399",
        dark: "#059669",
      },
      text: {
        primary: darkMode ? "#f9fafb" : "#0A0F14",
        secondary: darkMode ? "#d1d5db" : "#6b7280",
        tertiary: darkMode ? "#f9fafb" : "#545454",
        disabled: darkMode ? "#6b7280" : "#9ca3af",
        hover: "#C99400",
        back: darkMode ? "#f9fafb" : "#161341",
        modalTitle: darkMode ? "#f9fafb" : "#060612",
        modalContent: darkMode ? "#FFFFFF" : "#000000",
        warning: darkMode ? "#D93025" : "#D93025",
      },
      color: {
        borderBtn: darkMode ? "#B7BDC6" : "#B7BDC6",
      },
      background: {
        default: darkMode ? "#1f2937" : "#FCFCFC",
        paper: darkMode ? "#171627" : "#ffffff",
        sidebar: darkMode ? "#000000" : "#F5F6FA",
      },
      divider: darkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
      sidebar: {
        text: darkMode ? "#929AA5" : "#5F6367",
        selected: darkMode ? "rgba(230, 235, 243, 0.20)" : "#E6EBF3",
        selectedText: darkMode ? "#FFFFFF" : "#0A0F14",
        hover: darkMode ? "#FCD535" : "#FCD535",
        hoverText: darkMode ? "#0A0F14" : "#0A0F14",
        disabledText: darkMode ? "#929AA5" : "#5F6367",
      },
      table: {
        title: darkMode ? "#FFFFFF" : "#0A0F14",
        subtitle: darkMode ? "#929AA5" : "#929AA5",
      },
      border: darkMode ? "rgba(255, 255, 255, 0.12)" : "#E0E4EC",
      goBack: {
        background: "#E5E8F4",
        icon: "#0A0F14",
      },
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: '"Binance Plex", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 700,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
      subtitle1: {
        fontWeight: 500,
      },
      subtitle2: {
        fontWeight: 500,
      },
      body1: {
        fontSize: "0.9375rem",
      },
      body2: {
        fontSize: "0.875rem",
      },
      button: {
        fontWeight: 600,
        textTransform: "none",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            boxShadow: "none",
            fontWeight: 600,
            padding: "8px 16px",
            "&:hover": {
              boxShadow: "none",
            },
          },
          outlined: {
            borderWidth: "1px",
            "&:hover": {
              borderWidth: "1px",
            },
          },
        },
        variants: [
          {
            props: { variant: "secondaryAction" },
            style: {
              display: "flex",
              height: "44px",
              padding: "8px 16px",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              borderRadius: "8px",
              // background: darkMode ? "#FFFFFF" : "#FFFFFF",
              // color: darkMode ? "#0A0F14" : "#0A0F14",
              color: "text.primary",
              textAlign: "center",
              fontFamily: "Binance Plex",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 400,
              "&:hover": {
                // backgroundColor: darkMode ? "#FFFFFF" : "#FFFFFF",
                color: darkMode ? "#C99400" : "#C99400",
              },
              "&.Mui-disabled": {
                // background: darkMode ? "#F5F6FA" : "#F5F6FA",
                color: darkMode ? "#929AA5" : "#929AA5",
              },
            },
          },
          {
            props: { variant: "linkButton" },
            style: {
              display: "flex",
              height: "44px",
              minHeight: "44px",
              padding: "0px 8px",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              borderRadius: "8px",
              background: "transparent",
              color: darkMode ? "#C99400" : "#C99400",
              textAlign: "center",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 400,
              "&:hover": {
                // backgroundColor: darkMode ? "#FFFFFF" : "#FFFFFF",
                color: darkMode ? "#FCD535" : "#FCD535",
              },
              "&.Mui-disabled": {
                // background: darkMode ? "#F5F6FA" : "#F5F6FA",
                color: darkMode ? "#929AA5" : "#929AA5",
              },
            },
          },
          {
            props: { variant: "exportButton" },
            style: {
              display: "flex",
              height: "44px",
              minHeight: "44px",
              padding: "0px 16px",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              borderRadius: "8px",
              background: "transparent",
              color: darkMode ? "#f9fafb" : "#0A0F14",
              textAlign: "center",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 400,
              "& svg > g > path, & svg > g > g > path": {
                fill: darkMode ? "#f9fafb" : "#0A0F14",
              },
              "&:hover": {
                backgroundColor: "#FCD535",
                color: darkMode ? "#0A0F14" : "#0A0F14",
                "& svg > g > path, & svg > g > g > path": {
                  fill: darkMode ? "#0A0F14" : "#0A0F14",
                },
              },
              "&.Mui-disabled": {
                color: darkMode ? "#929AA5" : "#929AA5",
              },
            },
          },
        ],
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom:
              mode === "light" ? "1px solid #EEE" : "1px solid #444",
            padding: "12px 16px",
          },
          head: {
            fontWeight: 600,
            backgroundColor: "#F5F6FA",
            overflow: "hidden",
            color: "#0A0F14",
            textOverflow: "ellipsis",
            fontFamily: "Binance Plex",
            fontSize: "12px",
            fontStyle: "normal",
            letterSpacing: "-0.18px",
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: "#f9fafb",
            "& .MuiTableCell-head": {
              color: "#0A0F14",
              "&:hover": {
                color: "#000B0F",
                cursor: "grab",
              },
            },
          },
        },
      },
      MuiTableSortLabel: {
        styleOverrides: {
          root: {
            "&:hover": {
              color: "#2C3E50",
            },
          },
          icon: {
            fill: "#2C3E50",
            opacity: "0.7",
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          head: {
            "&:hover": {
              backgroundColor: "#f9fafb",
            },
          },
          root: {
            "&:hover": {
              backgroundColor: mode === "light" ? "#F5F6FA" : "#2d3748",
              cursor: "grab",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            fontSize: "1rem",
            fontWeight: 600,
          },
        },
      },
    },
  });
};

// Export both light and dark themes
export const lightTheme = getTheme("light");
export const darkTheme = getTheme("dark");

// Default export (light theme for backwards compatibility)
export default lightTheme;
