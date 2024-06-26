const fs = require('fs').promises; // Use fs promises for async operations
const path = require('path');
const { extractFrame } = require('./videoProcessor'); // Ensure extractFrame is correctly imported

const { getAudioDuration } = require('./audioProcessor');
const { resizeVideo } = require('./resizeVideo');
const sharp = require('sharp');

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
    let additionalFilePath; // For ../src/assets

    let durationSuffix = '';
    newFilename = `${entryID}-${index + 1}${extension}`;
    newFilePath = path.join(basePath, '../public/attachments/', newFilename);
    additionalFilePath = path.join(basePath, '../src/assets/', newFilename); // New path for ../src/assets

    if (extension === '.heic') {
      // Convert to JPG or handle HEIC files here
      // The conversion logic is omitted for simplicity
      newFilename = `${entryID}-${index + 1}.jpg`;
      newFilePath = path.join(basePath, '../public/attachments/', newFilename);
      additionalFilePath = path.join(basePath, '../src/assets/', newFilename); // Update for converted file
      // Example of moving/renaming file, adjust according to actual conversion logic
      await fs.rename(sourceFilePath, newFilePath);
      await fs.copyFile(newFilePath, additionalFilePath); // Copy to ../src/assets
    }
    else if (['.m4a', '.opus', '.ogg', '.wav', '.mp3'].includes(extension)) {
      const durationInSeconds = await getAudioDuration(sourceFilePath);
      console.log(`Duration of ${file}: ${durationInSeconds.duration} seconds`);

      durationSuffix = `-${Math.round(durationInSeconds.duration)}s`;
      newFilename = `${entryID}-${index + 1}${durationSuffix}${extension}`;
      newFilePath = path.join(basePath, '../public/attachments/', newFilename);
      additionalFilePath = path.join(basePath, '../src/assets/', newFilename); // Update for audio files

      await fs.copyFile(sourceFilePath, newFilePath);
      await fs.copyFile(newFilePath, additionalFilePath); // Copy to ../src/assets
    }
    else if (extension === '.mp4' || extension === '.mov') {

      // Corrected path for postersDir using `basePath`
      const postersDir = path.join(basePath, '../public/images/posters/');
      try {
        // Check if the directory exists asynchronously
        await fs.access(postersDir);
      } catch (error) {
        if (error.code === 'ENOENT') {
          // If the directory doesn't exist, create it
          await fs.mkdir(postersDir, { recursive: true });
        } else {
          // If another error occurred, throw it to be caught by the calling function
          throw error;
        }
      }

      // Define videoPath here, pointing to the original video file location
      const videoPath = sourceFilePath; // Assuming sourceFilePath is the path to the video file
      const framePath = path.join(postersDir, `${newFilename}-poster.jpg`); // Naming the poster file with entryID and video file name

      try {
        await extractFrame(videoPath, framePath);
        console.log(`Poster created for video ${file} at ${framePath}`);
      } catch (error) {
        console.error(`Error extracting frame from video ${file}:`, error);
      }

      newFilePath = path.join(basePath, '../public/attachments/', newFilename);
      additionalFilePath = path.join(basePath, '../src/assets/', newFilename); // Path for video files

      // Example usage
      const outputFilePath = newFilePath;
      const maxWidth = 800; // For example, 800 pixels in width
      const quality = 23; // CRF value, where a lower number means better quality

      await resizeVideo(sourceFilePath, outputFilePath, maxWidth, quality)
        .then(resizedFilePath => {
          console.log(`Resized video saved to: ${resizedFilePath}`);
          fs.copyFile(resizedFilePath, additionalFilePath); // Copy resized video to ../src/assets
        })
        .catch(error => console.error(`Failed to resize video: ${error}`));

      // Note: No need to copy the original file again, it's already moved by resizeVideo
    }

    else if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(extension)) {
      // Resize images with sharp
      const maxWidth = 1000;
      const outputFilePath = path.join(basePath, '../public/attachments/', newFilename);
      const additionalOutputFilePath = path.join(basePath, '../src/assets/', newFilename);
    
      console.log('Resizing image: ' + newFilename);
    
      try {
        // Await the completion of the resizing operation
        await sharp(sourceFilePath)
          .resize(maxWidth, null, { withoutEnlargement: true }) // This ensures the image is not enlarged if it's smaller than maxWidth
          .toFile(outputFilePath);
    
        console.log(`Resized image saved to: ${outputFilePath}`);
    
        // Ensure the image has been saved and is accessible before copying
        await fs.access(outputFilePath);
    
        // Await the completion of the copy operation to ensure the file is fully copied
        await fs.copyFile(outputFilePath, additionalOutputFilePath);
        console.log(`Image successfully copied to: ${additionalOutputFilePath}`);
      } catch (error) {
        console.error(`Failed to process image ${newFilename}: ${error}`);
      }
    }
    
    else {
      // Existing logic for non-image files
      await fs.copyFile(sourceFilePath, newFilePath);
      await fs.copyFile(sourceFilePath, additionalFilePath); // Copy to ../src/assets
    }

    return newFilename;
  });

  // Wait for all promises to resolve
  const processedFiles = await Promise.all(processedFilesPromises);
  console.log('Processed files for WA:', processedFiles);

  return processedFiles;
}

module.exports = processWhatsAppAttachments;
