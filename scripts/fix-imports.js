// scripts/fix-imports.js
// Script to find and fix all @/ imports in UI components

import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'client', 'src');
const componentsDir = path.join(srcDir, 'components');

// Function to recursively get all .tsx and .ts files
function getFiles(dir, extensions = ['.tsx', '.ts']) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = [...files, ...getFiles(fullPath, extensions)];
    } else if (
      entry.isFile() && 
      extensions.some(ext => entry.name.endsWith(ext))
    ) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to fix imports in a file
function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let fileDir = path.dirname(filePath);
  
  // Only process files with @/ imports
  if (!content.includes('@/')) {
    return false;
  }
  
  // Find all import statements with @/ paths
  const importRegex = /import\s+(?:(?:{[^}]*})|(?:[^{}\s,]+))\s+from\s+["']@\/([^"']+)["']/g;
  let match;
  let hasChanges = false;
  
  // Store matches to process after finding all of them
  const matches = [];
  while ((match = importRegex.exec(content)) !== null) {
    matches.push(match);
  }
  
  // Process matches in reverse order to avoid position issues
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    const fullMatch = match[0];
    const importPath = match[1];
    
    // Calculate relative path from file to import
    const targetPath = path.join(srcDir, importPath);
    const relativeDir = path.relative(fileDir, path.dirname(targetPath));
    const relativePath = path.join(
      relativeDir === '' ? '.' : relativeDir,
      path.basename(targetPath)
    );
    
    // Handle different OS path separators
    const normalizedPath = relativePath.replace(/\\/g, '/');
    
    // Create new import statement
    const newImport = fullMatch.replace(
      `@/${importPath}`, 
      normalizedPath
    );
    
    // Replace in content
    content = content.substring(0, match.index) + 
              newImport + 
              content.substring(match.index + fullMatch.length);
    
    hasChanges = true;
  }
  
  if (hasChanges) {
    console.log(`✓ Fixed imports in ${path.relative(process.cwd(), filePath)}`);
    fs.writeFileSync(filePath, content);
    return true;
  }
  
  return false;
}

// Main function
function main() {
  console.log('🔍 Finding files with @/ imports...');
  
  // Get all TypeScript and TSX files in the src directory
  const files = getFiles(srcDir);
  
  // Process each file
  let fixedCount = 0;
  for (const file of files) {
    if (fixImports(file)) {
      fixedCount++;
    }
  }
  
  console.log(`✅ Fixed imports in ${fixedCount} files`);
}

main();