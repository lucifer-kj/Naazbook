// scripts/build-clean.js
const fs = require('fs/promises');
const path = require('path');

async function removeNextDir() {
  const nextDir = path.join(__dirname, '..', '.next');
  try {
    await fs.rm(nextDir, { recursive: true, force: true });
    console.log('.next directory deleted successfully.');
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('.next directory does not exist, nothing to delete.');
    } else {
      console.error('Error deleting .next directory:', err);
      process.exit(1);
    }
  }
}

async function removeDiagnosticsDir() {
  const diagnosticsDir = path.join(__dirname, '..', '.next', 'diagnostics');
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await fs.rm(diagnosticsDir, { recursive: true, force: true });
      console.log('.next/diagnostics directory deleted successfully.');
      break;
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log('.next/diagnostics directory does not exist, nothing to delete.');
        break;
      } else {
        console.error(`Attempt ${attempt}: Error deleting .next/diagnostics directory:`, err);
        if (attempt < 3) {
          await new Promise(res => setTimeout(res, 500)); // Wait 500ms before retry
        } else {
          process.exit(1);
        }
      }
    }
  }
}

(async () => {
  await removeDiagnosticsDir();
  await removeNextDir();
})(); 