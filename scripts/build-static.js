#!/usr/bin/env node
// scripts/build-static.js

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execPromise = promisify(exec);

async function runCommand(command, options = {}) {
  console.log(`Running: ${command}`);
  try {
    const { stdout, stderr } = await execPromise(command, options);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    return { success: true };
  } catch (error) {
    console.error(`Error running command: ${command}`);
    console.error(error.message);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(error.stderr);
    return { success: false, error };
  }
}

async function buildStatic() {
  console.log('🚀 Starting static build process...');

  // Create the necessary directories
  const publicDir = path.join(process.cwd(), 'public', 'data');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Step 1: Generate static data files
  console.log('📊 Generating static data files...');
  const dataResult = await runCommand('node scripts/generate-static-data.js');
  if (!dataResult.success) {
    console.error('❌ Failed to generate static data files');
    process.exit(1);
  }

  // Step 2: Build the frontend with static mode enabled
  console.log('🏗️ Building the frontend in static mode...');
  const buildResult = await runCommand('VITE_STATIC_MODE=true vite build');
  if (!buildResult.success) {
    console.error('❌ Failed to build the frontend');
    process.exit(1);
  }

  console.log('✅ Static build completed successfully!');
  console.log('📂 Your static site is available in the dist/public directory');
  console.log('🌐 Deploy these files to any static hosting service');
}

buildStatic().catch(err => {
  console.error('❌ Build process failed:', err);
  process.exit(1);
});