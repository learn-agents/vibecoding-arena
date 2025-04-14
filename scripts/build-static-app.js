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
    // Use the --base=./ flag to make all asset paths relative
    execSync('cd client && npx vite build --base=./ --mode production', { 
      stdio: 'inherit',
      env: { ...process.env, VITE_STATIC_MODE: 'true' }
    });
  } catch (error) {
    console.error('❌ Failed to build the frontend');
    process.exit(1);
  }
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
  
  // Create .nojekyll file for GitHub Pages
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
}

// Main build process
async function main() {
  console.log('🚀 Starting static build process...');
  
  createDirectories();
  generateStaticData();
  createEnvConfig();
  buildFrontend();
  copyStaticFiles();
  
  console.log('✅ Static build completed successfully!');
  console.log('📂 Your static site is available in the dist/public directory');
  console.log('🌐 Deploy these files to any static hosting service');
}

main().catch(error => {
  console.error('❌ Build process failed:', error);
  process.exit(1);
});