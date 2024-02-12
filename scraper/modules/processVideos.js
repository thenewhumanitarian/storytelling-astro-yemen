const { exec } = require('child_process');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

function extractFrame(videoPath, framePath) {
  return new Promise((resolve, reject) => {
    // Adjust the '-ss' parameter as needed to choose the timestamp
    const command = `ffmpeg -i "${videoPath}" -ss 00:00:01.000 -frames:v 1 "${framePath}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error extracting frame: ${stderr}`);
        return reject(error);
      }
      resolve(framePath);
    });
  });
}

function resizeTo16by9(imagePath, outputImagePath) {
  return sharp(imagePath)
    .metadata()
    .then(metadata => {
      const originalWidth = metadata.width;
      const targetHeight = originalWidth * 9 / 16;
      return sharp(imagePath)
        .resize({ width: originalWidth, height: targetHeight, fit: 'cover' })
        .toFile(outputImagePath);
    })
    .catch(err => console.error('Error resizing image:', err));
}

module.exports = {
  extractFrame,
  resizeTo16by9
};
