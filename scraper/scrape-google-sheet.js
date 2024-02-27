const path = require('path');
const fs = require('fs');

// Import necessary modules
const { fetchAndParseCSV } = require('./modules/csvHandler');
const { createThumbnail, isImage } = require('./modules/imageProcessor');
const slugify = require('./modules/slugify');
const saveToJson = require('./modules/saveToJson');
const processWhatsAppAttachments = require('./modules/processWhatsAppAttachments');
const { extractFrame } = require('./modules/videoProcessor');

// const createPixelatedImages = require('./modules/createPixelatedImages');

// Set CSV URL
const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSo1JkBPpgo-jq5HbgZhdrWZ8lDGI8vF0C30gHPweWebwoKJbsmuKtED07jLqSDz3zpZMAfBpFl_Khv/pub?output=csv';

// Define the output directory for preview images and pixelated images, relative to the main script
const placeholderImageOutputDirectory = path.join(__dirname, '../public/images/placeholder_images');

// Fetch data
fetchAndParseCSV(csvUrl)
  .then(data => {
    // Filter out unpublished stories
    const filteredData = data.filter(item => item['Publish'] === 'x');

    // Process data once fetched
    processData(filteredData)
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });

const placeholderImagesDir = path.join(__dirname, './assets/placeholder_images');
let placeholderImageArray = [];

try {
  placeholderImageArray = fs.readdirSync(placeholderImagesDir)
    .filter(file => isImage(file))
    .map(file => path.join(placeholderImagesDir, file));
} catch (err) {
  console.error("Error reading placeholder images directory:", err);
}

async function processAllPlaceholderImages() {
  for (const sourceImagePath of placeholderImageArray) {
    const filename = path.basename(sourceImagePath);
    const destinationPath = path.join(placeholderImageOutputDirectory, filename);

    // Create main and pixelated thumbnails
    try {
      const result = await createThumbnail(sourceImagePath, destinationPath);
      if (result) {
        // console.log(`Thumbnail and pixelated image created for: ${filename}`);
      } else {
        console.log(`Failed to create thumbnail for: ${filename}`);
      }
    } catch (error) {
      console.error(`Error processing ${filename}:`, error);
    }
  }
}

async function processData(data) {
  /* CREATE PLACEHOLDER IMAGES FROM PUZZLE PIECES */
  processAllPlaceholderImages()
    .then(() => console.log('Finished processing all placeholder images.'))
    .catch(error => console.error('An error occurred:', error));

  const processedData = [];

  // Process the data found in the Google Document
  for (const entry of data) {
    // CREATE A SLUG FOR EVERY ENTRY IN ENGLISH AND ARABIC
    const enSlug = entry['EN\nTitle of story'].trim()
      ? slugify(entry['EN\nTitle of story'])
      : `en-story-${entry.ID}`;
    const arSlug = entry['AR \nTitle of story'].trim()
      ? slugify(entry['AR \nTitle of story'])
      : `ar-story-${entry.ID}`;

    // Assuming placeholderImageArray is populated with filenames of the original images
    const randomIndex = Math.floor(Math.random() * placeholderImageArray.length);
    const selectedImageFilename = path.basename(placeholderImageArray[randomIndex]);

    // Construct paths for the processed images
    let storyImage = {
      main: `/images/placeholder_images/${selectedImageFilename}`,
      pixelated: `/images/placeholder_images/pixelated/${selectedImageFilename}`
    };

    // Find MachForm attachments
    let machformAttachments = entry.Attachments && entry.Attachments.trim() && entry.Attachments.trim() !== '-'
      ? entry.Attachments.split(',').map(file => file.trim())
      : [];

    const machFormImageAttachments = machformAttachments.filter(isImage);

    // Process attachments that came through MachForm
    if (entry['Method of submission'] === 'MachForm' && machFormImageAttachments.length > 0) {
      // Pick first image attachment
      const firstImage = machFormImageAttachments[0];
      const sourceFilePath = path.join(__dirname, './assets/machform_assets/', firstImage);
      const thumbnailPath = path.join(__dirname, '../public/images/thumbnails/', `thumbnail-${entry.ID}.jpg`);

      try {
        const thumbnailResult = await createThumbnail(sourceFilePath, thumbnailPath);
        if (thumbnailResult) {
          // Create a normal and a pixelated version of the main/first image
          storyImage = {
            main: thumbnailResult.mainImage,
            pixelated: thumbnailResult.pixelatedImage
          };
        } else {
          console.log('Failed to create thumbnail.');
        }
      } catch (error) {
        console.error('An error occurred while creating a thumbnail:', error);
      }

      // Process all attachments for MachForm entry and name incrementally, starting at -1
      let attachmentCounter = 1;

      // Save attachments in the src/assets folder
      machformAttachments = machformAttachments.map(file => {
        let extension = path.extname(file).toLowerCase();
        let newFilename = `${entry.ID}-${attachmentCounter}${extension}`;
        const sourceFilePath = path.join(__dirname, './assets/machform_assets/', file);
        const newFilePath = path.join(__dirname, '../src/assets/', newFilename);
        const newPublicFilePath = path.join(__dirname, '../public/attachments/', newFilename);

        if (extension === '.heic') {
          // Rename .heic to .jpg
          newFilename = `${entry.ID}-${attachmentCounter}.jpg`;
          const jpgFilePath = path.join(__dirname, '../src/assets/', newFilename);
          const jpgPublicFilePath = path.join(__dirname, '../public/attachments/', newFilename);
          // src/assets
          try {
            fs.renameSync(sourceFilePath, jpgFilePath);
          } catch (err) {
            console.error('Error renaming HEIC to JPG:', err);
          }
          // public/attachments
          try {
            fs.copyFileSync(jpgFilePath, jpgPublicFilePath);
          } catch (err) {
            console.error('Error copying file:', err);
          }
        }
        // else if (extension === '.mp4') {
        //   console.log('MachForm video file:', newFilename);
        //   // Create thumbnails for these video files
        //   // TODO: leave open because no MachForm video files (so far)
        // }
        else {
          // src/assets
          try {
            fs.copyFileSync(sourceFilePath, newFilePath);
          } catch (err) {
            console.error('Error copying file:', err);
          }
          // public/attachments
          try {
            fs.copyFileSync(sourceFilePath, newPublicFilePath);
          } catch (err) {
            console.error('Error copying file:', err);
          }
        }

        attachmentCounter++;
        return newFilename;
      });
    }

    let whatsAppAttachments = [];

    // Process WhatsApp attachments
    if (entry['Method of submission'] === 'WhatsApp') {
      const entryID = entry.ID;
      const whatsappAssetsDir = path.join(__dirname, `./assets/whatsapp_assets/${entryID}`);
      let files = [];

      try {
        // Attempt to read the directory contents for every WhatsApp-submitted entry
        files = fs.readdirSync(whatsappAssetsDir);

        // If successful, files array is now populated with filenames
        if (files.length > 0) {
          // Proceed to process these files
          const processedFiles = processWhatsAppAttachments(entryID, files, __dirname);
          // console.log(`Processed files for entry ${entryID}:`, processedFiles);
          whatsAppAttachments = processedFiles;

          // Find the first video file
          const firstVideoFile = files.find(file => file.toLowerCase().endsWith('.mp4'));
          if (firstVideoFile) {
            // console.log(`📹 First video file found for entry ${entryID}: ${firstVideoFile}`);

            // Define paths for the frame extraction and thumbnail creation
            const videoPath = path.join(whatsappAssetsDir, firstVideoFile);
            const framePath = path.join(whatsappAssetsDir, `${entryID}-frame.jpg`); // Temporary frame
            const thumbnailPath = path.join(__dirname, '../public/images/thumbnails/', `${entryID}-thumbnail.jpg`); // Thumbnail destination

            try {
              // Extract the first frame of the video
              await extractFrame(videoPath, framePath);

              try {
                const thumbnailResult = await createThumbnail(framePath, thumbnailPath);
                console.log(`📹 🖼️ Thumbnail created for video: ${firstVideoFile}`);
                storyImage = {
                  main: thumbnailResult.mainImage,
                  pixelated: thumbnailResult.pixelatedImage || thumbnailResult.mainImage
                };
              } catch (error) {
                console.error(`Error creating thumbnail for video file ${firstVideoFile}:`, error);
              }

              // Optionally, remove the extracted frame if no longer needed
              fs.unlinkSync(framePath);

            } catch (error) {
              console.error(`Error processing video file ${firstVideoFile}:`, error);
            }
          } else {
            console.log(`No video files found for WhatsApp entry ${entryID}`);
          }

          // Find the first image file for thumbnail creation
          const firstImageFile = files.find(file => isImage(file));
          if (firstImageFile) {
            const sourceFilePath = path.join(whatsappAssetsDir, firstImageFile);
            const thumbnailPath = path.join(__dirname, '../public/images/thumbnails/', `thumbnail-${entryID}.jpg`);
            // Create a thumbnail for the first image file found in the entry's assets folder
            try {
              const thumbnailResult = await createThumbnail(sourceFilePath, thumbnailPath);
              console.log(`🖼️ Thumbnail created for entry ${entryID}:`, thumbnailResult);
              // Use the WhatsApp image as thumbnail
              storyImage = {
                main: thumbnailResult.mainImage,
                pixelated: thumbnailResult.pixelatedImage || thumbnailResult.mainImage
              }
            } catch (error) {
              console.error(`Error creating thumbnail for entry ${entryID}:`, error);
            }
          }

        } else {
          // No image files or directory is empty
          console.log(`No image files found for WhatsApp entry ${entryID}`);
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          // Directory does not exist
          console.log(`No directory found for WhatsApp entry ${entryID}, proceeding with an empty array.`);
        } else {
          // No assets
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
      tags: entry.Tags !== "" ? entry.Tags.split(',').map(tag => tag.trim()) : [],
      attachments: entry['Method of submission'] === 'MachForm' ? machformAttachments : whatsAppAttachments,
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

