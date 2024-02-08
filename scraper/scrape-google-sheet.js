const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

/* Import csvHandler module and set csvUrl */
const { fetchAndParseCSV } = require('./modules/csvHandler');
const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSo1JkBPpgo-jq5HbgZhdrWZ8lDGI8vF0C30gHPweWebwoKJbsmuKtED07jLqSDz3zpZMAfBpFl_Khv/pub?output=csv'; // Replace with your published CSV URL

const placeholderImageArray = [
  '../images/placeholder_images/puzzle-01.png',
  '../images/placeholder_images/puzzle-02.png',
  '../images/placeholder_images/puzzle-03.png',
  '../images/placeholder_images/puzzle-04.png',
  '../images/placeholder_images/puzzle-05.png',
  '../images/placeholder_images/puzzle-06.png',
  '../images/placeholder_images/puzzle-07.png',
  '../images/placeholder_images/puzzle-08.png',
  '../images/placeholder_images/puzzle-09.png',
  '../images/placeholder_images/puzzle-10.png',
  '../images/placeholder_images/puzzle-11.png',
  '../images/placeholder_images/puzzle-12.png',
  '../images/placeholder_images/puzzle-13.png',
  '../images/placeholder_images/puzzle-14.png',
  '../images/placeholder_images/puzzle-15.png',
  '../images/placeholder_images/puzzle-16.png',
  '../images/placeholder_images/puzzle-17.png',
  '../images/placeholder_images/puzzle-18.png',
  '../images/placeholder_images/puzzle-19.png',
  '../images/placeholder_images/puzzle-20.png',
  '../images/placeholder_images/puzzle-21.png',
  '../images/placeholder_images/puzzle-22.png',
  '../images/placeholder_images/puzzle-23.png',
  '../images/placeholder_images/puzzle-24.png',
  '../images/placeholder_images/puzzle-25.png',
  '../images/placeholder_images/puzzle-26.png',
  '../images/placeholder_images/puzzle-27.png',
  '../images/placeholder_images/puzzle-28.png',
  '../images/placeholder_images/puzzle-29.png',
  '../images/placeholder_images/puzzle-30.png',
  '../images/placeholder_images/puzzle-31.png',
  '../images/placeholder_images/puzzle-32.png',
]

async function createThumbnail(sourcePath, destinationPath) {
  try {
    await sharp(sourcePath)
      .resize(400, 400) // Resize the image to 400x400
      .toFile(destinationPath);
    console.log(`Thumbnail created: ${destinationPath}`);

    // Convert the full path to a relative path
    const relativePath = destinationPath.replace('/Users/marcfehr/Sites/tnh-storytelling-astro-yemen/public', '..');
    return relativePath;
  } catch (err) {
    console.error('Error creating thumbnail:', err);
    return null;
  }
}

function isImage(file) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.heic'];
  return imageExtensions.includes(path.extname(file).toLowerCase());
}

/* Fetch data */
fetchAndParseCSV(csvUrl)
  .then(data => {
    console.log('CSV Data:', data);
    processData(data)
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

function saveToJson(data) {
  fs.writeFile('output.json', JSON.stringify(data, null, 2), (err) => {
    if (err) return console.error('Error saving JSON:', err);
    console.log('Data saved to output.json');
  });
}

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
    let storyImage = placeholderImageArray[Math.floor(Math.random() * placeholderImageArray.length)];

    const imageAttachments = attachments.filter(isImage);

    if (entry['Method of submission'] === 'MachForm' && imageAttachments.length > 0) {
      const firstImage = imageAttachments[0];
      const sourceFilePath = path.join(__dirname, './assets/machform_assets/', firstImage);
      const thumbnailPath = path.join(__dirname, '../public/images/thumbnails/', `thumbnail-${entry.ID}.jpg`);
      // storyImage = `../images/thumbnails/thumbnail-${entry.ID}.jpg`
      const thumbnailResult = await createThumbnail(sourceFilePath, thumbnailPath);

      if (thumbnailResult) {
        // console.log('Thumbnail result:', thumbnailResult)
        storyImage = thumbnailResult; // Update storyImage to the thumbnail path
      }
    }

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

