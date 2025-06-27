# Atomic Components Library

A React component library focused on PDF viewing and interaction components, built with Material-UI and optimized for modern web applications.

## Features

- **PDFViewer**: Complete PDF viewing component with zoom, navigation, and toolbar
- **PDFSearch**: Advanced search functionality with highlighting and match navigation
- **PDFToolbar**: Comprehensive toolbar with print, download, rotation, and fullscreen features
- **Responsive Design**: Components adapt to different screen sizes
- **TypeScript Ready**: Full TypeScript support with proper type definitions
- **Storybook Integration**: Interactive component documentation and testing

## Development

### Available Scripts

- `npm run dev` - Start development server with Vite
- `npm run build` - Build the library for production
- `npm run lint` - Run ESLint on the codebase
- `npm run storybook` - Start Storybook for component development
- `npm run build-storybook` - Build Storybook for deployment

### Building the Library

The library is configured to build both ES modules and UMD bundles:

```bash
npm run build
```

This creates:

- `dist/atomic-components-library.es.js` - ES module build
- `dist/atomic-components-library.umd.js` - UMD build for browser usage

## Library Structure

```
src/
├── components/
│   └── PDFViewer/          # PDF viewing components
├── utils/
│   └── PDFPreviewerUtils.js # Utility functions
├── styles/                 # Styling definitions
└── stories/               # Storybook stories
```

## Dependencies

### Peer Dependencies (required by consuming app):

- React 19+
- Material-UI 7+
- Emotion (React styling)

### Direct Dependencies:

- PDF.js for PDF rendering
- Fontsource for Material Design fonts

## Components

### BackButton

A reusable back button component with Material-UI styling and customizable props.

**Features:**

- Multiple variants (text, outlined, contained)
- Customizable colors following Material-UI color palette
- Built-in chevron left icon
- Accessible and responsive design
- TypeScript ready with PropTypes validation

**Usage:**

```javascript
import { BackButton } from 'atomic-components-library';

// Basic usage
<BackButton onClick={() => console.log('Back clicked')} />

// Customized
<BackButton
  onClick={handleBack}
  label="Return to Dashboard"
  variant="contained"
  color="secondary"
/>
```

**Props:**

- `onClick` (function, required): Callback function when button is clicked
- `label` (string, default: "Back"): Text to display on the button
- `variant` (string, default: "outlined"): Material-UI button variant
- `color` (string, default: "primary"): Material-UI color palette
- `disabled` (boolean, default: false): Whether the button is disabled
- `sx` (object, default: {}): Additional styling object

## Theme System

The library includes a comprehensive theme system built on Material-UI with custom color palettes, typography, and component variants.

### Quick Start

```javascript
import { ThemeProvider, lightTheme } from "atomic-components-library";

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <YourComponents />
    </ThemeProvider>
  );
}
```

### Advanced Theme Usage

```javascript
import {
  ThemeProvider,
  useThemeMode,
  getTheme,
} from "atomic-components-library";

// With theme switching capability
function App() {
  return (
    <ThemeProvider
      defaultMode="light"
      enableSystemPreference={true}
      storageKey="my-app-theme"
    >
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { toggleTheme, mode, isDark } = useThemeMode();

  return (
    <div>
      <button onClick={toggleTheme}>
        Switch to {isDark ? "light" : "dark"} mode
      </button>
      <p>Current theme: {mode}</p>
    </div>
  );
}

// Custom theme configuration
const customTheme = getTheme("dark");
```

### Theme Features

- 🎨 **Custom Color Palette**: Primary yellow (#FCD535) with semantic colors
- 🌙 **Dark Mode Support**: Built-in light/dark mode switching
- 📝 **Typography**: Custom Binance Plex font family with defined scales
- 🎯 **Extended Palette**: Custom tokens for sidebar, tables, navigation, etc.
- 🧩 **Component Variants**: Custom button variants (secondaryAction, linkButton, exportButton)
- 📱 **Responsive**: Adaptive design tokens for different screen sizes
- ♿ **Accessibility**: WCAG compliant color contrasts

### Available Exports

```javascript
// Theme functions and presets
import {
  getTheme, // Function to create theme with mode
  lightTheme, // Pre-configured light theme
  darkTheme, // Pre-configured dark theme
} from "atomic-components-library";

// Theme providers and hooks
import {
  ThemeProvider, // Full-featured provider with context
  SimpleThemeProvider, // Basic provider without context
  useThemeMode, // Hook for theme switching
} from "atomic-components-library";
```

### Custom Theme Colors

The theme includes extended color tokens:

```javascript
// Access custom colors in your components
const theme = useTheme();

// Custom text colors
theme.palette.text.tertiary;
theme.palette.text.hover;
theme.palette.text.back;
theme.palette.text.modalTitle;

// Custom background colors
theme.palette.background.sidebar;

// Custom semantic colors
theme.palette.sidebar.selected;
theme.palette.sidebar.hover;
theme.palette.table.title;
theme.palette.goBack.background;
```
