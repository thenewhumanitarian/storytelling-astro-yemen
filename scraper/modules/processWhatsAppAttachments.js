const fs = require('fs').promises; // Use fs promises for async operations
const path = require('path');
const { getAudioDuration } = require('./audioProcessor');

/**
 * Processes WhatsApp attachments.
 * @param {string} entryID - The ID of the entry associated with the attachments.
 * @param {string[]} files - An array of filenames to be processed.
 * @param {string} basePath - The base directory path of the main scraper file.
 * @returns {Promise<string[]>} An array of new filenames after processing.
 */
async function processWhatsAppAttachments(entryID, files, basePath) {
  // Exclude .txt files
  const filteredFiles = files.filter(file => !file.endsWith('.txt'));

  const processedFilesPromises = filteredFiles.map(async (file, index) => {
    const extension = path.extname(file).toLowerCase();
    const sourceFilePath = path.join(basePath, `./assets/whatsapp_assets/${entryID}`, file);
    let newFilename;
    let newFilePath;

    let durationSuffix = '';
    newFilename = `${entryID}-${index + 1}${extension}`;
    newFilePath = path.join(basePath, '../public/attachments/', newFilename);

    if (extension === '.heic') {
      // Convert to JPG or handle HEIC files here
      // The conversion logic is omitted for simplicity
      newFilename = `${entryID}-${index + 1}.jpg`;
      newFilePath = path.join(basePath, '../public/attachments/', newFilename);
      // Example of moving/renaming file, adjust according to actual conversion logic
      await fs.rename(sourceFilePath, newFilePath);
    }
    else if (['.m4a', '.opus', '.ogg', '.wav', '.mp3'].includes(extension)) {
      const durationInSeconds = await getAudioDuration(sourceFilePath);
      console.log(`Duration of ${file}: ${durationInSeconds.duration} seconds`);

      durationSuffix = `-${Math.round(durationInSeconds.duration)}s`;
      newFilename = `${entryID}-${index + 1}${durationSuffix}${extension}`;
      newFilePath = path.join(basePath, '../public/attachments/', newFilename);

      await fs.copyFile(sourceFilePath, newFilePath);
    }
    else if (extension === '.mp4') {
      newFilePath = path.join(basePath, '../public/attachments/', newFilename);
      await fs.copyFile(sourceFilePath, newFilePath);
    }
    else {
      await fs.copyFile(sourceFilePath, newFilePath);
    }

    return newFilename;
  });

  // Wait for all promises to resolve
  const processedFiles = await Promise.all(processedFilesPromises);
  console.log('Processed files:', processedFiles);

  return processedFiles;
}

module.exports = processWhatsAppAttachments;
