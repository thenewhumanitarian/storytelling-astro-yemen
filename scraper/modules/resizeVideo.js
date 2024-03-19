const { exec } = require('child_process');
const fs = require('fs').promises;

/**
 * Resize a video file to a maximum width and adjust quality.
 * 
 * @param {string} sourceFilePath - The path to the source video file.
 * @param {string} outputFilePath - The path where the resized video will be saved.
 * @param {number} maxWidth - The maximum width of the video in pixels.
 * @param {number} quality - The CRF value for quality (0-51, where lower is better quality and higher is lower quality).
 * @returns {Promise<string>} The path to the resized video file.
 */
async function resizeVideo(sourceFilePath, outputFilePath, maxWidth, quality) {
  // Build the FFmpeg command for resizing and adjusting video quality
  const command = `ffmpeg -i "${sourceFilePath}" -vf "scale='min(${maxWidth},iw)':-2" -crf ${quality} "${outputFilePath}"`;

  // Execute the FFmpeg command
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error resizing video: ${stderr}`);
        reject(error);
        return;
      }
      console.log(`Video resized successfully: ${stdout}`);
      resolve(outputFilePath);
    });
  });
}

module.exports = {
  resizeVideo
};
