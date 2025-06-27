// Example: Using the Atomic Components Library with Theme

import React from "react";
import {
  ThemeProvider,
  useThemeMode,
  BackButton,
  PDFViewer,
} from "atomic-components-library";

// App with theme provider
function App() {
  return (
    <ThemeProvider defaultMode="light" enableSystemPreference={true}>
      <MainContent />
    </ThemeProvider>
  );
}

// Main content with theme switching
function MainContent() {
  const { toggleTheme, mode, isDark } = useThemeMode();

  return (
    <div style={{ padding: "20px" }}>
      {/* Theme toggle button */}
      <button
        onClick={toggleTheme}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: isDark ? "#FCD535" : "#0A0F14",
          color: isDark ? "#0A0F14" : "#FCD535",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Switch to {isDark ? "Light" : "Dark"} Mode
      </button>

      <h1>Atomic Components Library Demo</h1>
      <p>
        Current theme: <strong>{mode}</strong>
      </p>

      {/* Component examples */}
      <div style={{ marginTop: "30px" }}>
        <h2>BackButton Examples</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <BackButton
            onClick={() => console.log("Default back")}
            label="Default"
          />
          <BackButton
            onClick={() => console.log("Contained back")}
            label="Contained"
            variant="contained"
          />
          <BackButton
            onClick={() => console.log("Theme colors back")}
            label="Theme Colors"
            useThemeColors={true}
          />
          <BackButton
            onClick={() => console.log("Secondary back")}
            label="Secondary"
            color="secondary"
          />
        </div>
      </div>

      {/* PDF Viewer example */}
      <div style={{ marginTop: "30px" }}>
        <h2>PDF Viewer Example</h2>
        <div
          style={{
            height: "500px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <PDFViewer
            pdfUrl="/path/to/your/document.pdf"
            enableSearch={true}
            enableToolbar={true}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
