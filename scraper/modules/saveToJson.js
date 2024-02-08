const fs = require('fs');

/**
 * Saves data to a JSON file.
 * @param {Object|Array} data - The data to save.
 * @param {string} [filename='output.json'] - The name of the file to save the data to.
 */
function saveToJson(data, filename = 'output.json') {
  fs.writeFile(filename, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error(`Error saving JSON to ${filename}:`, err);
    } else {
      console.log(`Data saved to ${filename}`);
    }
  });
}

module.exports = saveToJson;