import { useStore } from '@nanostores/react';
import { isMenuOverlayVisible } from '../../stores/globalState';

const ReactHeader = () => {
  const $showOverlay = useStore(isMenuOverlayVisible);

  const toggleOverlay = () => {
    isMenuOverlayVisible.set(!$showOverlay);
  }

  return (
    <div className={`text-white fill-current flex gap-3 items-center justify-start`}>
      <button title='Open menu' onClick={toggleOverlay}>
        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' className='fill-current text-white cursor-pointer' id='menu-button'>
          <path d='M0 2v2h24V2Zm0 9v2h24v-2Zm0 9v2h24v-2Z'></path>
        </svg>
      </button>
    </div>
  )
}

export default ReactHeader