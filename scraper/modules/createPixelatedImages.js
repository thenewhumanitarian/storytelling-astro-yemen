const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Creates pixelated versions of images and saves them to a specified directory.
 * @param {Array<string>} imagePaths - Array of paths to the original images.
 * @param {string} outputDirectory - Directory where the pixelated images will be saved, relative to the script's execution context.
 * @param {string} baseImagePath - The base path to prepend to each imagePath to locate the images correctly, relative to the script's execution context.
 */
const createPixelatedImages = async (imagePaths, outputDirectory = '../../public/images/placeholder_images/pixelated', baseImagePath = '../../public/') => {
  // Ensure the output directory exists
  const absoluteOutputDirectory = path.resolve(__dirname, outputDirectory);
  if (!fs.existsSync(absoluteOutputDirectory)) {
    fs.mkdirSync(absoluteOutputDirectory, { recursive: true });
  }

  for (const imagePath of imagePaths) {
    try {
      const filename = path.basename(imagePath);
      // Adjust the path to correctly locate the image relative to the script's execution context
      // and considering the provided baseImagePath.
      const fullImagePath = path.resolve(__dirname, baseImagePath, imagePath.replace(/^\.\.\//, ''));
      const pixelatedImagePath = path.join(absoluteOutputDirectory, filename);

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
