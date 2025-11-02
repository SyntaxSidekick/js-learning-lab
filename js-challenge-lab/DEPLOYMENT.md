# Deployment Guide for JS Challenge Lab

## Quick Deployment Options

### 1. Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts to connect your project
```

### 2. Netlify
```bash
# Build the project
npm run build

# Drag and drop the 'dist' folder to Netlify's deploy interface
# Or use Netlify CLI:
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### 3. GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"deploy": "gh-pages -d dist"

# Build and deploy
npm run build
npm run deploy
```

### 4. Traditional Hosting
```bash
# Build the project
npm run build

# Upload the contents of the 'dist' folder to your web server
```

## Environment Variables
No environment variables are required for basic deployment.

## Performance Optimization

### Bundle Analysis
```bash
# Install bundle analyzer
npm install --save-dev vite-bundle-analyzer

# Add to package.json scripts:
"analyze": "vite-bundle-analyzer"

# Run analysis
npm run analyze
```

### Production Optimizations
- Monaco Editor is loaded asynchronously
- Tailwind CSS is purged of unused styles
- Assets are automatically minified by Vite

## Domain Configuration
Update the `base` in `vite.config.js` if deploying to a subdirectory:

```javascript
export default defineConfig({
  base: '/your-subdirectory/',
  plugins: [react()],
})
```