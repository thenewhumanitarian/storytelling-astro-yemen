import React, { useEffect, useState } from 'react';

const StoryListItem = ({ story, lang, showAll }) => {
  const [isRead, setIsRead] = useState(false);

  useEffect(() => {
    const handleShowAllChange = (event) => {
      const { showAll } = event.detail;
      // Update component state or trigger re-render based on `showAll`
      console.log(showAll); // Example action
    };

    window.addEventListener('showAllChanged', handleShowAllChange);

    return () => {
      window.removeEventListener('showAllChanged', handleShowAllChange);
    };
  }, []);

  useEffect(() => {
    // Check the showAll status from localStorage
    const showAllSetting = localStorage.getItem('showAll');
    setShowAll(showAllSetting !== 'false'); // If showAll is 'false', setShowAll to false; otherwise, true

    // Read from local storage to check if the story has been read
    const readArticles = JSON.parse(localStorage.getItem('readArticles')) || [];
    const readArticle = readArticles.find(article => article.slug === story.slugs[lang]);
    setIsRead(!!readArticle); // Sets to true if readArticle is found, false otherwise
  }, [story, lang]);

  // Adjust the logic to apply readClass based on both isRead and showAll status
  const opacityClass = isRead && !showAll ? 'opacity-30' : 'opacity-100';

  // Use `opacityClass` for elements you want to conditionally style
  const storyClass = `flex group border-t sm:border-2 border-zinc-200 ${story.highlighted ? 'w-full pt-6 pb-3 sm:py-0 bg-black gap-x-2' : 'bg-black flex-row-reverse pb-0 pt-3 lg:max-w-3xl mx-auto'} px-3 sm:pt-3 w-full hover:bg-zinc-800 hover:border-white`;

  return (
    <a className='z-40 block w-full' href={`/stories/${lang}/${story.slugs[lang]}`} id={`story-tile--${story.id}`}>
      <div className={storyClass}>
        <div className={`relative mb-3 aspect-square ${story.highlighted ? 'w-64 lg:w-96' : 'w-32 lg:w-56'} overflow-hidden self-center ${opacityClass}`}>
          <img src={story.storyImage.main} alt={story.story[lang].title} className='absolute top-0 left-0 w-full h-full object-cover aspect-square' />
        </div>
        <div className={`flex flex-col w-full p-3 ${story.highlighted ? 'pb-0 bg-black group-hover:bg-zinc-800 hover:border-white' : ''}`}>
          <h3
            className={`text-white leading-tight font-title ${story.highlighted ? 'text-2xl lg:text-3xl xl:text-4xl' : 'text-xl lg:text-2xl line-clamp-3 mb-0'} ${opacityClass}`}
          >
            {story.story[lang].title || 'Title not available'}
          </h3>
          <p className={`text-zinc-200 m-0 ${story.highlighted ? 'text-base sm:text-lg' : 'text-sm sm:text-base'} ${opacityClass}`}>
            {story.personalInfo[lang].name} {story.personalInfo[lang].surname}
          </p>
        </div>
      </div>
    </a>
  );
};

export default StoryListItem;
