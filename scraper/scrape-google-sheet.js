const path = require('path');
const fs = require('fs');

// Import necessary modules
const { fetchAndParseCSV } = require('./modules/csvHandler');
const { createThumbnail, isImage } = require('./modules/imageProcessor');
const slugify = require('./modules/slugify'); // Adjust the path based on
const saveToJson = require('./modules/saveToJson'); // Adjust the path based on your directory structure
const placeholderImageArray = require('./data/placeholderImages');
const processWhatsAppAttachments = require('./modules/processWhatsAppAttachments'); // Adjust the path as necessary

const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSo1JkBPpgo-jq5HbgZhdrWZ8lDGI8vF0C30gHPweWebwoKJbsmuKtED07jLqSDz3zpZMAfBpFl_Khv/pub?output=csv'; // Replace with your published CSV URL

// Fetch data
fetchAndParseCSV(csvUrl)
  .then(data => {
    // Process data once fetched
    processData(data)
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });

async function processData(data) {
  const processedData = [];

  for (const entry of data) {
    // Slugify titles or use fallback pattern
    const enSlug = entry['EN\nTitle of story'].trim()
      ? slugify(entry['EN\nTitle of story'])
      : `en-story-${entry.ID}`;
    const arSlug = entry['AR \nTitle of story'].trim()
      ? slugify(entry['AR \nTitle of story'])
      : `ar-story-${entry.ID}`;

    let attachments = entry.Attachments && entry.Attachments.trim() && entry.Attachments.trim() !== '-'
      ? entry.Attachments.split(',').map(file => file.trim())
      : [];

    // Find and use the first image attachment as the story image
    let storyImage = placeholderImageArray[Math.floor(Math.random() * placeholderImageArray.length)];
    const imageAttachments = attachments.filter(isImage);

    // Process attachments that came through MachForm
    if (entry['Method of submission'] === 'MachForm' && imageAttachments.length > 0) {

      const firstImage = imageAttachments[0];
      const sourceFilePath = path.join(__dirname, './assets/machform_assets/', firstImage);
      const thumbnailPath = path.join(__dirname, '../public/images/thumbnails/', `thumbnail-${entry.ID}.jpg`);

      try {
        const thumbnailResult = await createThumbnail(sourceFilePath, thumbnailPath);
        if (thumbnailResult) {
          // Use `thumbnailResult` for further processing
          // For example, updating `storyImage` variable
          storyImage = thumbnailResult; // Assuming you're doing something with this variable next
        } else {
          console.log('Failed to create thumbnail.');
        }
      } catch (error) {
        console.error('An error occurred while creating a thumbnail:', error);
      }

      // Process all attachments for MachForm entry
      let attachmentCounter = 1;
      attachments = attachments.map(file => {
        let extension = path.extname(file).toLowerCase();
        let newFilename = `${entry.ID}-${attachmentCounter}${extension}`;
        const sourceFilePath = path.join(__dirname, './assets/machform_assets/', file);
        const newFilePath = path.join(__dirname, '../src/assets/', newFilename);

        if (extension === '.heic') {
          // Rename .heic to .jpg
          newFilename = `${entry.ID}-${attachmentCounter}.jpg`;
          const jpgFilePath = path.join(__dirname, '../src/assets/', newFilename);
          try {
            fs.renameSync(sourceFilePath, jpgFilePath);
          } catch (err) {
            console.error('Error renaming HEIC to JPG:', err);
          }
        } else {
          try {
            fs.copyFileSync(sourceFilePath, newFilePath);
          } catch (err) {
            console.error('Error copying file:', err);
          }
        }

        attachmentCounter++;
        return newFilename;
      });
    }



    // Process WhatsApp attachments
    if (entry['Method of submission'] === 'WhatsApp') {
      const entryID = entry.ID;
      const whatsappAssetsDir = path.join(__dirname, `./assets/whatsapp_assets/${entryID}`);
      let files = [];

      try {
        // Attempt to read the directory contents
        files = fs.readdirSync(whatsappAssetsDir);

        // If successful, files array is now populated with filenames
        if (files.length > 0) {
          // Proceed to process these files
          const processedFiles = processWhatsAppAttachments(entryID, files, __dirname);
          console.log(`Processed files for entry ${entryID}:`, processedFiles);
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          // Directory does not exist
          console.log(`No directory found for WhatsApp entry ${entryID}, proceeding with an empty array.`);
        } else {
          console.error(`Error accessing WhatsApp assets for entry ${entryID}:`, error);
        }
      }
    }
    processedData.push({
      id: entry.ID,
      slugs: {
        en: enSlug,
        ar: arSlug
      },
      storyImage: storyImage,
      personalInfo: {
        en: {
          name: entry['EN\nName'].trim(),
          surname: entry['EN\nSurname'].trim(),
          whereFrom: entry['EN\nWhere from'].trim(),
          livingIn: entry['EN\nLiving in'].trim(),
        },
        ar: {
          name: entry['AR\nName'].trim(),
          surname: entry['AR\nSurname'].trim(),
          whereFrom: entry['AR\nWhere from'].trim(),
          livingIn: entry['AR\nLiving in'].trim(),
        },
      },
      contact: {
        email: entry.Email,
        phone: entry.Phone,
        age: entry.Age
      },
      story: {
        en: {
          title: entry['EN\nTitle of story'],
          content: entry['EN\nYour story']
        },
        ar: {
          title: entry['AR \nTitle of story'],
          content: entry['AR\nYour story']
        }
      },
      attachments: entry['Method of submission'] === 'MachForm' ? attachments : [],
      notes: entry.Notes,
      highlighted: entry.Highlighted === 'x',
      languageOfSubmission: entry['Language of submission'],
      location: entry.Location,
      methodOfSubmission: entry['Method of submission'],
      followUpRequired: entry['Follow up required?'] === 'x',
      contacted: entry.Contacted === 'x',
      contactedBeforePublication: entry['Contacted before publication?'] === 'x',
      englishEdited: entry['English edited? Y/N (Annie)'] === 'Y',
    });
  }

  saveToJson(processedData);
}

