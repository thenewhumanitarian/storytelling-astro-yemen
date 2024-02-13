const { spawn } = require('child_process');

function extractFrame(videoPath, framePath) {
  return new Promise((resolve, reject) => {
    const ffmpegProcess = spawn('ffmpeg', ['-i', videoPath, '-ss', '00:00:01.000', '-frames:v', '1', framePath]);

    ffmpegProcess.on('error', (error) => {
      console.error(`Spawn error: ${error}`);
      reject(error);
    });

    ffmpegProcess.stderr.on('data', (data) => {
      console.error(`FFmpeg stderr: ${data}`);
    });

    ffmpegProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`FFmpeg exited with code ${code}`));
      } else {
        resolve(framePath);
      }
    });
  });
}

module.exports = {
  extractFrame
};
