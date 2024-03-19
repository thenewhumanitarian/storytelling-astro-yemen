# Yemen Listening Project Notes
## Call with Annie on 19 September 2023

* We won't have images for everything so we'll try to use the YLP main image and slice it up into "stamps"
* Highlighting certain stories because the "whole" thing might not be attracting that many people * how many would actually click through stories?
* "Share this story" at the top of every story detauil page to make it more appealing to share stories
* A possibility to create individual share texts for stories in both languages (fallback if a story doesn't have individual share text)
* Within two weeks have it look more like we think it's going to look
* Using the same fonts, background images for tiles
* Dataset from Annie with 10 people to try out with by end of week 18 September
* More thoughts into mobile and how to not make it overwhelming
* A way to present the content in a "map mode"?
* Some way to tag "themes" at the bottom or story etc. (/tags/love or /tags/displacement or /tags/region)
* Landing page to introduce the project / Opener modal page or something

## Call with Annie on 6 February 2023

* DONE Modal box in the beginning explaining the project, also add info button
* DONE Title Yemen Listening Project somewhere on the main page, maybe in top nav?
* DONE Next button additionally to Back button on entry detail page
* DONE Create bespoke logo that combines TNH with Yemen Listening Project
* DONE Video ones should take still from the video as teaser tile image
---
* Little icons for video/audio/image/document on the tiles
* Highlighting style needs to be adjusted, ideally they should be bigger
* Highlighted ones maybe even using 2/4 fields, would that be possible?
* Fallback (for highlighted stories) is to have them stand out with transform and drop shadow
* Remove stars on mobile and reduce number of stars on mobile to save computing power
---

## Call with Annie on 14 February 2023

* Audio: Can should we turn these all into videos with subtitles?
* Sofia should help us turn the audios into videos
* Once videos ready pls to Google Drive structure with ID folders
* The static pages need to be designed (Marc) and written (Annie)
---
* DONE White border under header
* DONE Intro modal inside hamburger menu and remove (i) icon
* DONE Button to change language on the detail page
* DONE Send UI translations to Annie
* DONE "Share this story" buttons on detail pages with social media card
* DONE Tidy up header make sure it's looking good everywhere
* DONE Check titles and encoding etc. in scraper
* DONE Icons such as "world" and "filter" can go?
* DONE Detail page title big  then name age and location
* DONE Make a cooler grid for the Attachments component with lightbox
* DONE Pergament doesn't look like part of identity, maybe change?
---
* Grid and list views on desktop but only list view on mobile?




## Call with Annie on 27 February 2024

### Questions
* DONE What are we doing with "documents" such as Word/PDF attachments? Make them open in new tab/download them?
  * Annie is removing those and will eventually add photos for them by adding the new media file names to the spreadsheet and sending the files to Marc
* DONE Audios will be videos so didn't build a view for them to play in lightbox
  * Some audios will be soundcites...
* DONE SEO for grid/list views but also detail views to be done
* Optimise image sizes further (detail pages, list view)
* DONE Highlighted entries in the list view are now spread out
* DONE Family names? Do we show them?
* Who is going to do testing?
* Content for intro slides and static pages
* Infinite grid highlighted entries shouldn't touch each other

### The big and ugly to do list
* DONE Adjust scraper to only use entries that have 'x' in Published column
* DONE Adjust scraper to also get the tags from every entry
* DONE Categorising or tagging the entries? Using colour schemes for this?
* DONE Share/meta for SEO: Title is Yemen Listening Project (and Arabic) and description: Title of story
* DONE Detail page if 2 or fewer attachments then on left side of text, above each other
* DONE Detail page if 3 or more attachements then keep as is now with flowing left-to-right
* Highlighted for the grid
* Alternative for "All stories"?
* DONE Make a plan for the soundcite embeds
* Create embeddable for Spotlight on homepage? Or use Spotlight for individual stories?
* Stub article to be done

# Deadline is end of next week / 9 March 2024

# Last week to do list

## Grid

* DONE Grid with scroll?
* DONE What are the red stars for?
* DONE Is it possible to move around the grid with keyboard arrows?
* DONE Try to not have too many highlighted items next to each other in the grid view
* DONE At the moment there seem to be a lot of duplicates, often right next to each other?
* DONE Debounce scroll on Grid, reduce speed
* DONE Not all stories loading?

## Static content / introduction slides

* DONE In English, “introduction text” needs to be cut after this:
* DONE The New Humanitarian cannot independently verify the details of each individual story. They have been edited for style, length, and clarity.
* DONE In Arabic, it needs to be cut after this:
* DONE لا تستطيع وكالة «ذا نيو هيومانيترين» التحقق بشكلٍ مستقل من تفاصيل كل قصة على حدة، وقد تم تحرير الأسلوب والطول ومستوى الوضوح في تلك القصص.
* DONE When I try to click on the about or credits in Arabic, I cannot. I am just stuck on the Arabic introduction. Same problem in English. I can only get to about or credits from the hamburger.
* DONE The about and credits page will need to be checked for links and everything, but I can’t get to them
* DONE Clicking on Arabic button from the English introduction does not switch to the Arabic introduction, but just to the grid
* DONE “About” in Arabic seem to be a mix of Arabic and English, and it includes start of English credits at the bottom
* Block body scroll when static pages visible
* Links should not always go to /lang/grid instead stay on same side when changing language inside of overlay
* Links and logo should not move!

## Detail pages

* DONE Can we put in from and lives in? Right now I just see “from.” I may need to delete in spreadsheet they are the same.
* DONE Some photos are not showing up? Not sure if that is because you have not taken latest from WhatsApp folder (noticed this on 1064)
* Check if all videos and photos are loading...
* The Soundcite works in English but seems to be only for the first paragraph? Looking at 1038 as an example
* Soundcite in Arabic works too, same issue. is it possible for the movement to be right to left on Arabic? That would make more logical sense

## Scraper

* DONE Check if those with bespoke teaser/preview images do actually work when scraping the data

## Social share

* Meta data in Arabic showing weird characters in description...