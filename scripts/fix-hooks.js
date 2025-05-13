const fs = require('fs');
const path = require('path');

// Files with useEffect dependency issues
const filesToFix = [
  'pages/admin/shipments/[id]/edit.tsx',
  'pages/admin/shipments/[id]/index.tsx',
  'pages/admin/shipments/[id]/media.tsx',
  'pages/track-new.tsx',
  'components/DocumentUpload.tsx'
];

// Process each file
filesToFix.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Fix useEffect dependencies
  if (filePath.includes('[id]')) {
    // For pages with dynamic [id] parameter
    content = content.replace(
      /useEffect\(\s*\(\)\s*=>\s*{\s*(?:fetchShipment|fetchMedia|fetchDocuments)\(\);(?:\s*(?:fetchShipment|fetchMedia|fetchDocuments)\(\);)*\s*}\s*,\s*\[\s*\]\s*\)/g,
      'useEffect(() => {\n    if (id) {\n      fetchShipment();\n      fetchMedia && fetchMedia();\n      fetchDocuments && fetchDocuments();\n    }\n  }, [id])'
    );
  } else if (filePath.includes('DocumentUpload.tsx')) {
    // For DocumentUpload component
    content = content.replace(
      /useEffect\(\s*\(\)\s*=>\s*{\s*if\s*\(shipmentId\)\s*{\s*fetchDocuments\(\);\s*}\s*}\s*,\s*\[\s*shipmentId\s*\]\s*\)/g,
      'useEffect(() => {\n    if (shipmentId) {\n      fetchDocuments();\n    }\n  }, [shipmentId, fetchDocuments])'
    );
  }
  
  // Write the fixed content back to the file
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Fixed: ${filePath}`);
});

console.log('Finished fixing useEffect dependencies'); 