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
      <div className='flex flex-col max-w-xl w-full px-8 mt-5 sm:mt-3'>
        <div onClick={() => toggleCollapsible()} className={'z-50 flex items-center justify-center cursor-pointer gap-x-2 opacity-50 hover:opacity-100 transition-opacity'}>
          <span className={'text-white w-5 h-5 inline-block'}>
            <svg width="100%" className={'fill-current w-full h-auto'} viewBox="0 0 97 97" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M94.6093 86.8334L65.724 57.9427C70.1666 52.1094 72.6666 44.6094 72.6666 36.552C72.6666 16.552 56.5573 0.442688 36.5573 0.442688C16.5573 0.442688 0.442627 16.5574 0.442627 36.5574C0.442627 56.5574 16.552 72.6667 36.552 72.6667C44.6093 72.6667 51.828 70.1667 57.9426 65.724L86.8333 94.6147C87.9427 95.7241 89.3333 96.2814 90.724 96.2814C92.1146 96.2814 93.5 95.7241 94.6146 94.6147C96.8334 92.3907 96.8333 89.0572 94.6093 86.8334ZM36.5573 61.5574C22.6666 61.5574 11.5573 50.448 11.5573 36.5574C11.5573 22.6667 22.6666 11.5574 36.5573 11.5574C50.448 11.5574 61.5573 22.6667 61.5573 36.5574C61.5573 50.4427 50.4428 61.5574 36.5573 61.5574Z" fill="current" />
            </svg>

          </span>
          {/* {lang === 'en' && <span className={'inline-block'}>{translations.searchStories[lang]}</span>} */}
          <span className={'inline-block'}>{translations.searchStories['en']}</span>
        </div>
        {isCollapsibleOpen && (
          <input
            type='text'
            className='bg-white text-black px-3 py-1 text-lg z-50 mt-3'
            placeholder={lang === 'en' ? 'Search' : null}
            // placeholder={'Search...'}
            id='searchInput'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
      </div>

      <div className={'py-8 flex flex-col gap-y-0 sm:gap-y-2 md:gap-y-3 max-w-2xl lg:max-w-5xl w-full'}>
        {filteredStories.map((story, index) => (
          <>
          <ReactStoryItem client:load story={story} lang={lang} key={index} showAll={showAll} />
          </>
        ))}
      </div>
    </div>
  );
};

export default StoryListReact;