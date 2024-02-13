const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Creates a thumbnail and a pixelated version of an image.
 * @param {string} sourcePath - The path to the source image.
 * @param {string} destinationPath - The path where the main thumbnail should be saved.
 * @param {number} [width=400] - Optional width for the main thumbnail.
 * @param {number} [height=400] - Optional height for the main thumbnail.
 * @returns {Promise<Object>} A promise that resolves with the paths of the created thumbnails, or null if an error occurred.
 */
async function createThumbnail(sourcePath, destinationPath, width = 400, height = 400) {
  try {
    // Main thumbnail creation
    await sharp(sourcePath, { failOnError: false })
      .resize(width, height, { fit: 'cover', position: 'attention' })
      .toFile(destinationPath);
    console.log(`Main thumbnail created: ${destinationPath}`);

    // Pixelated thumbnail creation
    const pixelatedDir = path.join(path.dirname(destinationPath), 'pixelated');
    if (!fs.existsSync(pixelatedDir)) {
      fs.mkdirSync(pixelatedDir, { recursive: true });
    }
    const pixelatedFilename = path.basename(destinationPath);
    const pixelatedPath = path.join(pixelatedDir, pixelatedFilename);
    await sharp(sourcePath, { failOnError: false })
      .resize(25, 25, { fit: 'cover', position: 'attention' })
      .toFile(pixelatedPath);
    console.log(`Pixelated thumbnail created: ${pixelatedPath}`);

    // Adjust the paths to be relative if needed
    const relativeMainPath = destinationPath.replace('/Users/marcfehr/Sites/tnh-storytelling-astro-yemen/public', '..');
    const relativePixelatedPath = pixelatedPath.replace('/Users/marcfehr/Sites/tnh-storytelling-astro-yemen/public', '..');

    // Return both paths in an object
    return {
      mainImage: relativeMainPath,
      pixelatedImage: relativePixelatedPath
    };
  } catch (err) {
    console.error('Unexpected error in createThumbnail:', err);
    return null;
  }
}

/**
* Checks if a file is an image based on its extension.
* @param {string} file - The file name or path to check.
* @returns {boolean} True if the file is an image, false otherwise.
*/
function isImage(file) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.heic']; // Added '.gif' as an example
  return imageExtensions.includes(path.extname(file).toLowerCase());
}

module.exports = { createThumbnail, isImage };