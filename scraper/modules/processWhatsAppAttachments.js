// processWhatsAppAttachments.js
const fs = require('fs');
const path = require('path');
const { getAudioDuration } = require('./audioProcessor');


/**
 * Processes WhatsApp attachments.
 * @param {string} entryID - The ID of the entry associated with the attachments.
 * @param {string[]} files - An array of filenames to be processed.
 * @param {string} basePath - The base directory path of the main scraper file.
 * @returns {string[]} An array of new filenames after processing.
 */
function processWhatsAppAttachments(entryID, files, basePath) {
  // Exclude .txt files
  const filteredFiles = files.filter(file => !file.endsWith('.txt'));

  const processedFiles = filteredFiles.map((file, index) => {
    const extension = path.extname(file).toLowerCase();
    let newFilename = `${entryID}-${index + 1}${extension}`;
    const sourceFilePath = path.join(basePath, `./assets/whatsapp_assets/${entryID}`, file);
    let newFilePath = path.join(basePath, '../src/assets/', newFilename);

    if (extension === '.heic') {
      newFilename = `${entryID}-${index + 1}.jpg`;
      const jpgFilePath = path.join(basePath, '../src/assets/', newFilename);
      const jpgPublicFilePath = path.join(basePath, '../public/attachments/', newFilename);
      // src/assets
      try {
        fs.renameSync(sourceFilePath, jpgFilePath);
      } catch (err) {
        console.error('Error renaming HEIC to JPG:', err);
      }
      // public/attachments
      try {
        fs.renameSync(sourceFilePath, jpgPublicFilePath);
      } catch (err) {
        console.error('Error renaming HEIC to JPG:', err);
      }
    }
    else if (extension === '.mp4') {
      newFilePath = path.join(basePath, '../public/attachments/', newFilename);
      try {
        fs.copyFileSync(sourceFilePath, newFilePath);
      } catch (err) {
        console.error('Error copying file:', err);
      }
    } else if (extension === '.m4a' || extension === '.opus' || extension === '.ogg' || extension === '.wav' || extension === '.mp3') {
      // Get length of audio file

      newFilePath = path.join(basePath, '../public/attachments/', newFilename);
      try {
        fs.copyFileSync(sourceFilePath, newFilePath);
      } catch (err) {
        console.error('Error copying file:', err);
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
