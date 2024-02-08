// processWhatsAppAttachments.js
const fs = require('fs');
const path = require('path');

/**
 * Processes WhatsApp attachments.
 * @param {string} entryID - The ID of the entry associated with the attachments.
 * @param {string[]} files - An array of filenames to be processed.
 * @param {string} basePath - The base directory path of the main scraper file.
 * @returns {string[]} An array of new filenames after processing.
 */
function processWhatsAppAttachments(entryID, files, basePath) {
  const processedFiles = files.map((file, index) => {
    const extension = path.extname(file).toLowerCase();
    let newFilename = `${entryID}-${index + 1}${extension}`;
    const sourceFilePath = path.join(basePath, `./assets/whatsapp_assets/${entryID}`, file);
    const newFilePath = path.join(basePath, './src/assets/', newFilename);

    if (extension === '.heic') {
      newFilename = `${entryID}-${index + 1}.jpg`;
      const jpgFilePath = path.join(basePath, './src/assets/', newFilename);
      try {
        fs.renameSync(sourceFilePath, jpgFilePath);
      } catch (err) {
        console.error('Error renaming HEIC to JPG:', err);
      }
    } else {
      try {
        fs.copyFileSync(sourceFilePath, newFilePath);
      } catch (err) {
        console.error('Error copying file:', err);
      }
    }

    return newFilename;
  });

  return processedFiles;
}

module.exports = processWhatsAppAttachments;
