const sharp = require('sharp');
const path = require('path');

/**
 * Creates a thumbnail for an image.
 * @param {string} sourcePath - The path to the source image.
 * @param {string} destinationPath - The path where the thumbnail should be saved.
 * @returns {Promise<string>} A promise that resolves with the relative path of the created thumbnail, or null if an error occurred.
 */
async function createThumbnail(sourcePath, destinationPath) {
  try {
    await sharp(sourcePath)
      .resize(400, 400) // Resize the image to 400x400 pixels
      .toFile(destinationPath);
    console.log(`Thumbnail created: ${destinationPath}`);
    // Assuming the destination is within a specific base directory for the project
    const relativePath = destinationPath.replace('/Users/marcfehr/Sites/tnh-storytelling-astro-yemen/public', '..');
    return relativePath;
  } catch (err) {
    console.error('Error creating thumbnail:', err);
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