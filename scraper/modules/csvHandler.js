const axios = require('axios');
const Papa = require('papaparse');

/**
 * Fetches CSV data from a given URL and returns the parsed data.
 * @param {string} csvUrl - The URL of the CSV file to download and parse.
 * @returns {Promise<Object[]>} - A promise that resolves with the parsed CSV data as an array of objects.
 */
async function fetchAndParseCSV(csvUrl) {
  try {
    const response = await axios.get(csvUrl);
    const csvData = response.data;
    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true, // Assumes CSV has a header row
        complete: (result) => {
          resolve(result.data);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching the CSV:', error);
    throw error; // Rethrow to allow the caller to handle it
  }
}

module.exports = { fetchAndParseCSV };
