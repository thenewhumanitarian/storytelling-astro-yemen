const ffmpeg = require('fluent-ffmpeg');

/**
 * Get the duration of an audio file.
 * @param {string} filePath - The path to the audio file.
 * @returns {Promise<{filename: string, duration: number}>} An object containing the file name and its duration in seconds.
 */
function getAudioDuration(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const duration = metadata.format.duration;
        resolve({
          filename: filePath,
          duration
        });
      }
    });
  });
}

module.exports = { getAudioDuration };