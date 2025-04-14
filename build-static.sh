#!/bin/bash

# build-static.sh - Script to build a static version of the site

echo "🚀 Starting static build process..."

# Create the public/data directory if it doesn't exist
mkdir -p public/data

# Step 1: Generate static data files
echo "📊 Generating static data files..."
node scripts/generate-static-data.js

# Check if the data generation was successful
if [ $? -ne 0 ]; then
  echo "❌ Failed to generate static data files"
  exit 1
fi

# Step 2: Build the frontend with static mode enabled
echo "🏗️ Building the frontend in static mode..."
export VITE_STATIC_MODE=true
npx vite build

# Check if the build was successful
if [ $? -ne 0 ]; then
  echo "❌ Failed to build the frontend"
  exit 1
fi

echo "✅ Static build completed successfully!"
echo "📂 Your static site is available in the dist/public directory"
echo "🌐 Deploy these files to any static hosting service"