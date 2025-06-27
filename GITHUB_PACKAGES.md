# Publishing to GitHub Packages

This guide explains how to publish and use the Atomic Components Library via GitHub Packages.

## 📦 Publishing the Package

### Prerequisites

1. **GitHub Repository**: Create a repository on GitHub
2. **Personal Access Token**: Generate a token with `write:packages` permission
3. **Package Build**: Ensure the package builds successfully

### Setup Steps

1. **Configure npm for GitHub Packages**:

   ```bash
   # Login to GitHub Packages
   npm login --scope=@asaelmartinez --registry=https://npm.pkg.github.com
   ```

2. **Build the package**:

   ```bash
   npm run build
   ```

3. **Publish manually**:
   ```bash
   npm publish
   ```

### Automated Publishing

The package is configured for automated publishing via GitHub Actions:

- **CI Pipeline**: Runs on every push/PR to main branch
- **Publishing**: Automatically publishes when a GitHub release is created

## 📥 Installing the Package

### For End Users

1. **Configure npm** (one-time setup):

   ```bash
   # Create or update ~/.npmrc
   echo "@asaelmartinez:registry=https://npm.pkg.github.com" >> ~/.npmrc
   ```

2. **Authenticate with GitHub**:

   ```bash
   npm login --scope=@asaelmartinez --registry=https://npm.pkg.github.com
   ```

3. **Install the package**:
   ```bash
   npm install @asaelmartinez/atomic-components-library
   ```

### For Development Teams

Create a `.npmrc` file in your project:

```
@asaelmartinez:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then install:

```bash
npm install @asaelmartinez/atomic-components-library
```

## 🚀 Usage

```javascript
import {
  BackButton,
  PDFViewer,
  ThemeProvider,
  lightTheme,
} from "@asaelmartinez/atomic-components-library";

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <BackButton onClick={() => console.log("Back")} />
      <PDFViewer pdfUrl="/path/to/document.pdf" />
    </ThemeProvider>
  );
}
```

## 🔧 Version Management

- **Patch**: `npm version patch` - Bug fixes
- **Minor**: `npm version minor` - New features
- **Major**: `npm version major` - Breaking changes

After updating version, create a GitHub release to trigger automated publishing.

## 📋 Package Information

- **Name**: `@asaelmartinez/atomic-components-library`
- **Registry**: GitHub Packages
- **Repository**: https://github.com/asaelmartinez/atomic-components-library
- **Documentation**: Available in Storybook

## 🛠️ Troubleshooting

### Authentication Issues

```bash
# Clear npm cache
npm cache clean --force

# Re-login to GitHub Packages
npm login --scope=@asaelmartinez --registry=https://npm.pkg.github.com
```

### Publishing Issues

```bash
# Check authentication
npm whoami --registry=https://npm.pkg.github.com

# Verify package configuration
npm run build
npm publish --dry-run
```
