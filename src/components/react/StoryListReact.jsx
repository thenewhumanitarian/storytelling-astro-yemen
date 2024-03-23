import React, { useState, useEffect } from 'react';

import ReactStoryItem from '@components/react/StoryListItemReact.jsx'

const StoryListReact = ({ stories, lang = 'en' }) => {
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Function to shuffle array (keep it the same)
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  function sortStoriesWithHighlights(stories) {
    const highlightedStories = stories.filter((story) => story.highlighted)
    const otherStories = stories.filter((story) => !story.highlighted)

    // Shuffle both arrays
    shuffleArray(highlightedStories)
    shuffleArray(otherStories)

    // Ensure there are always at least three items between highlighted stories
    const resultArray = []
    let otherIndex = 0

    highlightedStories.forEach((highlightedStory, index) => {
      // Add one highlighted story
      resultArray.push(highlightedStory)

      // Add three (or more if available) other stories
      for (let i = 0; i < 3; i++) {
        if (otherStories[otherIndex]) {
          resultArray.push(otherStories[otherIndex])
          otherIndex++
        }
      }
    })

    // Add any remaining other stories to the end of the result array
    resultArray.push(...otherStories.slice(otherIndex))

    return resultArray
  }

  useEffect(() => {
    // Filter stories by search term
    let newFilteredStories = stories;
    if (searchTerm && searchTerm !== '') {
      newFilteredStories = stories.filter((story) => {
        const title = story.story[lang].title.toLowerCase();
        const content = story.story[lang].content.toLowerCase();
        const name = story.personalInfo[lang].name.toLowerCase();
        const surname = story.personalInfo[lang].surname.toLowerCase();
        const searchableText = [title, content, name, surname].join(' ');
        return searchableText.includes(searchTerm.toLowerCase());
      });
    }

    const shuffledStories = sortStoriesWithHighlights(newFilteredStories);
    setFilteredStories(shuffledStories);
  }, [stories, searchTerm, lang]);

  return (
    <div className='text-white w-full flex items-center justify-center flex-col'>
      <div className='flex flex-col gap-y-3 max-w-lg w-full'>
        <h2 className='font-sans text-white text-2xl sm:text-3xl font-bold m-0 text-center'>Search stories</h2>
        <input type='text' className='bg-white text-black px-3 py-1 text-lg' placeholder='Search entries...' id='searchInput' onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className={'py-8 hidden flex-row gap-y-0 sm:gap-y-2 md:gap-y-3 max-w-2xl lg:max-w-5xl mx-auto'}>
        {filteredStories.map((story, index) => (
          <ReactStoryItem client:load story={story} lang={lang} key={index} />
        ))}
      </div>
    </div>
  );
};

export default StoryListReact;