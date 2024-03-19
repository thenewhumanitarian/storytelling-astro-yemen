const { exec } = require('child_process');

async function resizeVideo(sourceFilePath, outputFilePath, maxWidth, quality) {
  const command = `ffmpeg -y -i "${sourceFilePath}" -vf "scale='if(gt(a,1),min(800,iw),-2)':'if(gt(a,1),-2,min(800,ih))'" -crf ${quality} "${outputFilePath}"`;

  console.log(`Executing command: ${command}`); // Additional logging

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error resizing video: ${error}`);
        console.error(`FFmpeg stderr: ${stderr}`);
        reject(error);
        return;
      }
      console.log(`FFmpeg stdout: ${stdout}`); // More detailed output logging
      resolve(outputFilePath);
    });
  });
}

module.exports = {
  resizeVideo
}
