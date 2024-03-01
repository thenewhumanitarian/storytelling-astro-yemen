import { useStore } from '@nanostores/react';
import { isMenuOverlayVisible, firstTimeVisitor } from '@stores/globalState';

const ReactMenuOverlay = () => {
  const $showOverlay = useStore(isMenuOverlayVisible);

  const hideOverlay = () => {
    isMenuOverlayVisible.set(false);
  }

  const $firstTimeVisitor = useStore(firstTimeVisitor);

  if ($firstTimeVisitor) {
    firstTimeVisitor.set(false);
  }

  console.log($firstTimeVisitor)

  return (
    <>
      {$showOverlay && (
        <section className={'fixed top-0 left-0 w-full h-full'} style={{ zIndex: 9999 }}>
          <div className='flex flex-col top-0 left-0 w-full h-screen h-screen-ios bg-black items-center justify-center cursor-pointer p-5 sm:p-8 z-50 gap-y-5 sm:gap-y-8'>
            <div className="menu-overlay__content text-white">
              <h2>Menu</h2>
              <ul>
                <li>Home</li>
                <li>About</li>
                <li>Contact</li>
              </ul>
            </div>
            <button className={'text-white'} onClick={hideOverlay}>Close</button>
          </div>
        </section>
      )}
    </>
  );
}

export default ReactMenuOverlay