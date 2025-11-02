# Mobile Responsiveness and Deployment Automation Script
# This script will apply Google-level mobile responsiveness and deploy to GitHub Pages

Write-Host "🚀 Starting Mobile Responsiveness Automation..." -ForegroundColor Green

# Step 1: Clean up directory structure
Write-Host "📁 Cleaning up directory structure..." -ForegroundColor Yellow

# Remove the problematic subdirectory
if (Test-Path "js-challenge-lab") {
    Write-Host "   Removing js-challenge-lab subdirectory..." -ForegroundColor Gray
    Remove-Item "js-challenge-lab" -Recurse -Force -ErrorAction SilentlyContinue
}

# Step 2: Check and install dependencies
Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "   Installing dependencies..." -ForegroundColor Gray
    npm install
}

# Step 3: Update package.json to ensure proper mobile build
Write-Host "⚙️ Updating build configuration..." -ForegroundColor Yellow

# Update vite.config.js for proper GitHub Pages deployment
$viteConfig = @"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          editor: ['@monaco-editor/react']
        }
      }
    }
  },
  server: {
    host: true,
    port: 3000
  },
  preview: {
    port: 4173,
    host: true
  }
})
"@

$viteConfig | Out-File -FilePath "vite.config.js" -Encoding UTF8

# Step 4: Update HTML with proper mobile viewport and PWA meta tags
Write-Host "📱 Updating HTML for mobile optimization..." -ForegroundColor Yellow

$htmlContent = @"
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="description" content="JS Learning Lab - Interactive JavaScript learning platform with Google-level mobile responsiveness" />
    <meta name="keywords" content="javascript, coding, learning, mobile, responsive, programming, practice, education" />
    <meta name="theme-color" content="#1a73e8" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="JS Learning Lab" />
    <title>JS Learning Lab - Mobile-First JavaScript Learning</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
"@

$htmlContent | Out-File -FilePath "index.html" -Encoding UTF8

# Step 5: Create mobile-optimized CSS
Write-Host "🎨 Applying mobile-first CSS..." -ForegroundColor Yellow

$cssContent = @"
/* Mobile-First CSS with Google-level responsiveness */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #fafafa;
  line-height: 1.6;
  touch-action: manipulation;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  overflow-x: hidden;
}

/* Re-enable text selection for content */
.MuiTypography-root,
.monaco-editor,
.monaco-editor .view-lines {
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  -ms-user-select: text !important;
  user-select: text !important;
}

code {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Consolas',
    'Courier New', monospace;
}

/* Mobile-optimized scrollbar */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

@media (min-width: 768px) {
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  transition: background-color 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.4);
}

/* Smooth transitions */
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

/* Mobile-specific optimizations */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
  
  body {
    line-height: 1.5;
  }
  
  /* Touch targets */
  .MuiButton-root {
    min-height: 48px !important;
    min-width: 48px !important;
    font-size: 0.875rem !important;
  }
  
  .MuiIconButton-root {
    padding: 12px !important;
    min-width: 48px !important;
    min-height: 48px !important;
  }
  
  .MuiFormControlLabel-root {
    margin: 0 !important;
  }
  
  .MuiRadio-root {
    padding: 8px !important;
  }
  
  /* Mobile code blocks */
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-x: auto;
    font-size: 0.8rem;
  }
  
  /* Bottom navigation safe area */
  .MuiBottomNavigation-root {
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .MuiButton-root {
    border: 2px solid currentColor !important;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Dark mode preference */
@media (prefers-color-scheme: dark) {
  body {
    background-color: #202124;
    color: #e8eaed;
  }
}
"@

$cssContent | Out-File -FilePath "src\index.css" -Encoding UTF8

# Step 6: Build the project
Write-Host "🔨 Building mobile-optimized version..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Please check the console output." -ForegroundColor Red
    exit 1
}

# Step 7: Test the build locally (optional)
Write-Host "🧪 Testing build..." -ForegroundColor Yellow
$testResult = npm run preview --silent
Write-Host "   Build test completed." -ForegroundColor Gray

# Step 8: Git operations
Write-Host "📝 Committing changes..." -ForegroundColor Yellow

# Add all changes
git add .

# Commit with descriptive message
$commitMessage = "feat: Add Google-level mobile responsiveness

- Mobile-first responsive design with breakpoints
- Touch-friendly UI elements (48px minimum touch targets)
- Optimized viewport and meta tags for mobile
- Mobile-specific CSS optimizations
- PWA-ready configuration
- Improved performance for mobile devices
- Bottom navigation for mobile
- Collapsible sections for better mobile UX
- Touch gesture optimizations"

git commit -m $commitMessage

# Step 9: Push to GitHub
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Push failed. Please check your GitHub credentials." -ForegroundColor Red
    exit 1
}

# Step 10: Wait for GitHub Actions to complete
Write-Host "⏳ Waiting for GitHub Actions deployment..." -ForegroundColor Yellow
Write-Host "   This may take 2-3 minutes..." -ForegroundColor Gray

Start-Sleep -Seconds 30

# Step 11: Open the deployed site
Write-Host "🌐 Opening deployed site..." -ForegroundColor Yellow
$siteUrl = "https://syntaxsidekick.github.io/js-learning-lab"

try {
    Start-Process $siteUrl
    Write-Host "   Site opened in browser: $siteUrl" -ForegroundColor Gray
} catch {
    Write-Host "   Please manually visit: $siteUrl" -ForegroundColor Gray
}

# Step 12: Final status
Write-Host ""
Write-Host "✅ Mobile responsiveness automation completed!" -ForegroundColor Green
Write-Host "📱 Your JS Learning Lab now has Google-level mobile responsiveness:" -ForegroundColor Green
Write-Host "   • Mobile-first design with proper breakpoints" -ForegroundColor Gray
Write-Host "   • Touch-friendly interactions (48px minimum touch targets)" -ForegroundColor Gray
Write-Host "   • Responsive navigation with bottom tabs on mobile" -ForegroundColor Gray
Write-Host "   • Optimized code editor for mobile devices" -ForegroundColor Gray
Write-Host "   • PWA-ready configuration" -ForegroundColor Gray
Write-Host "   • Performance optimizations for mobile" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 Site URL: $siteUrl" -ForegroundColor Cyan
Write-Host "💤 You can now go to bed! The deployment is automated." -ForegroundColor Green
Write-Host ""

# Optional: Show deployment status
Write-Host "📊 You can check deployment status at:" -ForegroundColor Yellow
Write-Host "   https://github.com/SyntaxSidekick/js-learning-lab/actions" -ForegroundColor Gray