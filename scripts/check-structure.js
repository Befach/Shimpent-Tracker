const fs = require('fs');
const path = require('path');

// Check if pages directory exists
const pagesDir = path.join(process.cwd(), 'pages');
console.log(`Checking if pages directory exists at: ${pagesDir}`);
console.log(`Pages directory exists: ${fs.existsSync(pagesDir)}`);

// List files in pages directory if it exists
if (fs.existsSync(pagesDir)) {
  console.log('Files in pages directory:');
  fs.readdirSync(pagesDir).forEach(file => {
    console.log(`- ${file}`);
  });
}

// Check if package.json exists and has correct scripts
const packageJsonPath = path.join(process.cwd(), 'package.json');
console.log(`\nChecking package.json at: ${packageJsonPath}`);
if (fs.existsSync(packageJsonPath)) {
  const packageJson = require(packageJsonPath);
  console.log('Build script:', packageJson.scripts?.build);
} else {
  console.log('package.json not found');
} 