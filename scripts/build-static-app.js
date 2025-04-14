// scripts/build-static-app.js
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Configuration
const publicDir = path.join(process.cwd(), 'public');
const distDir = path.join(process.cwd(), 'dist', 'public');
const dataDir = path.join(publicDir, 'data');
const distDataDir = path.join(distDir, 'data');
const clientDir = path.join(process.cwd(), 'client');
const indexFile = path.join(distDir, 'index.html');

// Create necessary directories
function createDirectories() {
  console.log('📁 Creating necessary directories...');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  if (!fs.existsSync(distDataDir)) {
    fs.mkdirSync(distDataDir, { recursive: true });
  }
}

// Run the static data generation script
function generateStaticData() {
  console.log('📊 Generating static data files...');
  try {
    execSync('node scripts/generate-static-data.js', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to generate static data files');
    process.exit(1);
  }
}

// Create the environment configuration for static mode
function createEnvConfig() {
  console.log('📝 Creating environment configuration...');
  const envConfig = 'VITE_STATIC_MODE=true\n';
  fs.writeFileSync(path.join(clientDir, '.env.production'), envConfig);
}

// Build the frontend with specific options for static deployment
function buildFrontend() {
  console.log('🏗️ Building the frontend in static mode...');
  try {
    // Copy the special Tailwind config for static builds
    console.log('📄 Setting up special Tailwind config for static builds...');
    const staticTailwindConfigPath = path.join(clientDir, 'tailwind.config.static.ts');
    const tailwindConfigPath = path.join(clientDir, 'tailwind.config.js');
    
    if (fs.existsSync(staticTailwindConfigPath)) {
      // Create a simple CommonJS wrapper for the ESM Tailwind config
      const tailwindConfigWrapper = `
// This is a temporary wrapper created during the static build process
module.exports = require('./tailwind.config.static.ts').default;
      `.trim();
      
      fs.writeFileSync(tailwindConfigPath, tailwindConfigWrapper);
      console.log('✓ Created temporary Tailwind config wrapper');
    }
    
    // Use relative paths for all assets
    console.log('🔄 Building with relative asset paths...');
    execSync('cd client && npx vite build --base=./ --mode production', { 
      stdio: 'inherit',
      env: { ...process.env, VITE_STATIC_MODE: 'true' }
    });
    
    // Clean up temporary files
    if (fs.existsSync(tailwindConfigPath)) {
      fs.unlinkSync(tailwindConfigPath);
      console.log('✓ Cleaned up temporary Tailwind config');
    }
  } catch (error) {
    console.error('❌ Failed to build the frontend');
    process.exit(1);
  }
}

// Update index.html to ensure proper path resolution
function updateIndexHtml() {
  if (!fs.existsSync(indexFile)) {
    console.warn('⚠️ index.html not found, skipping update');
    return;
  }

  console.log('📝 Updating index.html for proper path resolution...');
  
  // Read the current index.html content
  let content = fs.readFileSync(indexFile, 'utf8');
  
  // Add base tag if not present
  if (!content.includes('<base href')) {
    content = content.replace(
      '<head>',
      '<head>\n    <base href="./">'
    );
  }
  
  // Ensure all script paths are relative
  content = content.replace(/src="\/assets\//g, 'src="./assets/');
  content = content.replace(/href="\/assets\//g, 'href="./assets/');
  
  // Ensure favicon path is relative and correct
  content = content.replace(/<link rel="icon" type="image\/x-icon" href="\/favicon.ico">/g, 
                          '<link rel="icon" type="image/x-icon" href="./favicon.ico">');
  
  // Write back the updated content
  fs.writeFileSync(indexFile, content);
  console.log('✓ Updated index.html');
}

// Copy the static data files to the build output
function copyStaticFiles() {
  console.log('📋 Copying static data files to build output...');
  
  // Copy all JSON files from public/data to dist/public/data
  const jsonFiles = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
  
  for (const file of jsonFiles) {
    const sourceFile = path.join(dataDir, file);
    const destFile = path.join(distDataDir, file);
    fs.copyFileSync(sourceFile, destFile);
    console.log(`✓ Copied ${file}`);
  }
  
  // Copy favicon.ico file
  const faviconSource = path.join(publicDir, 'favicon.ico');
  const faviconDest = path.join(distDir, 'favicon.ico');
  if (fs.existsSync(faviconSource)) {
    fs.copyFileSync(faviconSource, faviconDest);
    console.log('✓ Copied favicon.ico');
  } else {
    console.warn('⚠️ favicon.ico not found in public directory');
  }
  
  // Create .nojekyll file for GitHub Pages
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
  
  // Create a fallback replit.nix file to prevent deployment issues
  const replitNixContent = `{ pkgs }: {
    deps = [
      pkgs.nodejs
    ];
  }`;
  fs.writeFileSync(path.join(distDir, 'replit.nix'), replitNixContent);
}

// Create a deployment verification file
function createVerificationFile() {
  console.log('📝 Creating deployment verification file...');
  
  // Create a simple HTML file that can verify the static deployment works
  const verifyContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Static Deployment Verification</title>
  <style>
    body { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    .success { color: green; }
    .error { color: red; }
    pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow: auto; }
  </style>
</head>
<body>
  <h1>Static Deployment Verification</h1>
  <p>This file confirms your static site is deployed correctly.</p>
  <div id="status">Checking data files...</div>
  <div id="results"></div>

  <script>
    const status = document.getElementById('status');
    const results = document.getElementById('results');
    
    // Try to load the data files
    const checkFiles = async () => {
      try {
        const response = await fetch('./data/prompts.json');
        if (!response.ok) {
          throw new Error(\`Failed to load prompts.json: \${response.status}\`);
        }
        
        const data = await response.json();
        status.innerHTML = '<span class="success">✓ Success! Data files are accessible.</span>';
        results.innerHTML = \`<p>Found \${data.length} prompts:</p><pre>\${JSON.stringify(data.map(p => p.text), null, 2)}</pre>\`;
      } catch (error) {
        status.innerHTML = \`<span class="error">❌ Error: \${error.message}</span>\`;
        results.innerHTML = '<p>Troubleshooting tips:</p><ul>' +
          '<li>Check the browser console for more error details</li>' +
          '<li>Ensure data files were included in the deployment</li>' +
          '<li>Verify the deployment server is properly configured</li>' +
        '</ul>';
      }
    };
    
    checkFiles();
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(distDir, 'verify.html'), verifyContent);
}

// Main build process
async function main() {
  console.log('🚀 Starting static build process...');
  
  createDirectories();
  generateStaticData();
  createEnvConfig();
  buildFrontend();
  updateIndexHtml();
  copyStaticFiles();
  createVerificationFile();
  
  console.log('✅ Static build completed successfully!');
  console.log('📂 Your static site is available in the dist/public directory');
  console.log('🌐 Deploy these files to any static hosting service');
  console.log('🧪 After deployment, visit /verify.html to verify everything works correctly');
}

main().catch(error => {
  console.error('❌ Build process failed:', error);
  process.exit(1);
});