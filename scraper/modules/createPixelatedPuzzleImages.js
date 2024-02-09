const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Creates pixelated versions of images and saves them to a specified directory.
 * @param {Array<string>} imagePaths - Array of paths to the original images.
 * @param {string} outputDirectory - Directory where the pixelated images will be saved, relative to the script's execution context.
 * @param {string} baseImagePath - The base path to prepend to each imagePath to locate the images correctly, relative to the script's execution context.
 */
const createPixelatedImages = async (imagePaths, outputDirectory = './public/images/placeholder_images/pixelated', baseImagePath = '../public/') => {
  for (const imagePath of imagePaths) {
    try {
      const filename = path.basename(imagePath);
      // Here, the imagePath is assumed to be relative from the baseImagePath.
      // Ensure fullImagePath is correctly resolved from the base to the specific image.
      const fullImagePath = path.resolve(baseImagePath, imagePath);
      const pixelatedImagePath = path.resolve(outputDirectory, filename);

      console.log(pixelatedImagePath);

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
