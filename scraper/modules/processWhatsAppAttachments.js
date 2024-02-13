// processWhatsAppAttachments.js
const fs = require('fs');
const path = require('path');
const { extractFrame } = require('./videoProcessor'); // Adjust the path as necessary

async function processWhatsAppAttachments(entryID, files, basePath) {
  // Exclude .txt files
  const filteredFiles = files.filter(file => !file.endsWith('.txt'));

  const processedFiles = [];

  for (const file of filteredFiles) {
    const extension = path.extname(file).toLowerCase();
    let newFilename = `${entryID}-${processedFiles.length + 1}${extension}`;
    const sourceFilePath = path.join(basePath, `./assets/whatsapp_assets/${entryID}`, file);
    const targetFilePath = path.join(basePath, '../src/assets/', newFilename);

    if (extension === '.heic') {
      newFilename = `${entryID}-${processedFiles.length + 1}.jpg`;
      const jpgFilePath = path.join(basePath, '../src/assets/', newFilename);
      try {
        fs.renameSync(sourceFilePath, jpgFilePath);
        processedFiles.push(newFilename);
      } catch (err) {
        console.error('Error renaming HEIC to JPG:', err);
      }
    } 
    // else if (extension === '.mp4') {
    //   console.log('Processing WhatsApp video file:', newFilename);
    //   // Define the path for the video thumbnail
    //   const thumbnailPath = path.join(basePath, '../src/assets/thumbnails/', `${entryID}-${processedFiles.length + 1}.jpg`);
    //   try {
    //     // Create a thumbnail for the video
    //     await extractFrame(sourceFilePath, thumbnailPath);
    //     processedFiles.push(newFilename); // Optionally, adjust if you want to track thumbnails differently
    //   } catch (error) {
    //     console.error(`Error creating thumbnail for ${file}:`, error);
    //   }
    // } 
    else {
      try {
        fs.copyFileSync(sourceFilePath, targetFilePath);
        processedFiles.push(newFilename);
      } catch (err) {
        console.error('Error copying file:', err);
      }
    }
  }

  return processedFiles;
}

module.exports = processWhatsAppAttachments;
