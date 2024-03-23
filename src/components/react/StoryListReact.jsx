import React, { useState, useEffect } from 'react';

import ReactStoryItem from '@components/react/StoryListItemReact.jsx'

import { translations } from '@data/translations.js';

const StoryListReact = ({ stories, lang = 'en' }) => {
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  // Initialize showAll using a state initialization function
  const [showAll, setShowAll] = useState(() => {
    // This ensures the code is executed only on the client-side
    if (typeof window !== 'undefined') {
      return localStorage.getItem('showAll') !== 'false';
    }
    return true;
  });
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);

  // Function to shuffle array (keep it the same)
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  // Toggle the visibility of the collapsible section
  const toggleCollapsible = () => {
    setIsCollapsibleOpen(!isCollapsibleOpen);
  };

  useEffect(() => {
    const handleShowAllChange = (event) => {
      // Directly use setShowAll here
      setShowAll(event.detail.showAll);
    };

    // Make sure we're on the client-side before adding the event listener
    if (typeof window !== 'undefined') {
      window.addEventListener('showAllChanged', handleShowAllChange);

      // Return a cleanup function to remove the event listener
      return () => {
        window.removeEventListener('showAllChanged', handleShowAllChange);
      };
    }
  }, []);

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
    // Initialize searchTerm from localStorage on component mount
    const storedSearchTerm = localStorage.getItem('searchTerm');
    if (storedSearchTerm) {
      setSearchTerm(storedSearchTerm);
    }
  }, []);

  useEffect(() => {
    // No dependencies array means this runs on mount only
    return () => {
      // Cleanup function runs on component unmount
      localStorage.setItem('searchTerm', ''); // Optionally reset searchTerm in localStorage
      setSearchTerm(''); // Reset searchTerm when leaving the component
    };
  }, []);

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
    <div className='text-white flex items-center justify-center flex-col'>
      <div className='flex flex-col gap-y-3 max-w-xl w-full px-8 mt-5 sm:mt-3'>
        <div onClick={() => toggleCollapsible()} className={'z-50 flex items-center justify-center cursor-pointer gap-x-2 opacity-70 hover:opacity-100 transition-opacity'}>
          <span className={'text-white w-5 h-5 inline-block'}>
            <svg width="100%" viewBox="0 0 117 118" fill="none" xmlns="http://www.w3.org/2000/svg" className={'w-full h-full'}>
              <path d="M4.49999 0.333332C1.37492 0.333332 -0.708278 3.87493 0.958388 6.58333L46.1664 66.9993V112.833C46.1664 115.958 49.4997 118.041 52.208 116.583L68.8747 108.249C70.3331 107.624 71.1664 106.166 71.1664 104.499V66.9993L116.374 6.58333C118.041 3.87507 115.958 0.333332 112.833 0.333332H4.49999Z" fill="current" className={'fill-current'} />
            </svg>
          </span>
          <span className={'inline-block'}>{translations.filterStories[lang]}</span>
        </div>
        {isCollapsibleOpen && (
          <input
            type='text'
            className='bg-white text-black px-3 py-1 text-lg z-50'
            placeholder='Search entries...'
            id='searchInput'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
      </div>

      <div className={'py-8 flex flex-col gap-y-0 sm:gap-y-2 md:gap-y-3 max-w-2xl lg:max-w-5xl w-full'}>
        {filteredStories.map((story, index) => (
          <ReactStoryItem client:load story={story} lang={lang} key={index} showAll={showAll} />
        ))}
      </div>
    </div>
  );
};

export default StoryListReact;