const axios = require('axios');
const Papa = require('papaparse');
const fs = require('fs');

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

axios.get(csvUrl)
    .then(response => {
        const csvData = response.data;
        parseCsv(csvData);
    })
    .catch(error => {
        console.error('Error fetching the CSV:', error);
    });

function parseCsv(csvData) {
    Papa.parse(csvData, {
        header: true, // Set to true if your CSV has a header row
        complete: (result) => {
            processData(result.data);
        },
        error: (error) => {
            console.error('Error parsing CSV:', error);
        }
    });
}

function processData(data) {
    const processedData = data.map((entry, index) => {
        // Slugify titles or use fallback pattern
        const enSlug = entry['EN\nTitle of story'].trim()
            ? slugify(entry['EN\nTitle of story'])
            : `en-story-${index}`;
        const arSlug = entry['AR \nTitle of story'].trim()
            ? slugify(entry['AR \nTitle of story'])
            : `ar-story-${index}`;

        // Process attachments, treating '-' or empty as no attachment
        let attachments = entry.Attachments && entry.Attachments.trim() && entry.Attachments.trim() !== '-'
            ? entry.Attachments.split(',')
            : [];

        const randomImage = placeholderImageArray[Math.floor(Math.random() * placeholderImageArray.length)];

        if (entry['Method of submission'] === 'WhatsApp') {
            attachments = attachments.map(file => `ID/${entry.ID}/${file.trim()}`);
        }

        return {
            id: entry.ID,
            slugs: {
                en: enSlug,
                ar: arSlug
            },
            storyImage: randomImage,
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
                    title: entry['AR \nTitle of story'], // Adjusted for the space before the line break
                    content: entry['AR\nYour story']
                }
            },
            attachments: attachments,
            notes: entry.Notes,
            highlighted: entry.Highlighted === 'x',
            languageOfSubmission: entry['Language of submission'],
            location: entry.Location,
            methodOfSubmission: entry['Method of submission'],
            followUpRequired: entry['Follow up required?'] === 'x',
            contacted: entry.Contacted === 'x',
            contactedBeforePublication: entry['Contacted before publication?'] === 'x',
            englishEdited: entry['English edited? Y/N (Annie)'] === 'Y',
        };
    });

    saveToJson(processedData);
}

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