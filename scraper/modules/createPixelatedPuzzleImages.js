const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Creates pixelated versions of images and saves them to a specified directory.
 * @param {Array<string>} imagePaths - Array of paths to the original images.
 * @param {string} outputDirectory - Directory where the pixelated images will be saved.
 * @param {string} baseImagePath - The base path to prepend to each imagePath to locate the images correctly.
 */
const createPixelatedImages = async (imagePaths, outputDirectory = './pixelated', baseImagePath = '../public/') => {
  for (const imagePath of imagePaths) {
    try {
      const filename = path.basename(imagePath);
      const fullImagePath = path.resolve(baseImagePath, imagePath.replace(/^\.\.\//, '')); // Adjust the path relative to the baseImagePath
      const pixelatedImagePath = path.join(outputDirectory, filename);

      // Ensure the output directory exists
      if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true });
      }

      // Use sharp to resize the image to 25x25px and save it
      await sharp(fullImagePath)
        .resize(25, 25)
        .toFile(pixelatedImagePath);

      console.log(`Pixelated image created: ${pixelatedImagePath}`);
    } catch (error) {
      console.error(`Error creating pixelated image for ${imagePath}:`, error);
    }
  }
};

module.exports = createPixelatedImages;
