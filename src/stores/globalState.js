import { atom } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent'


export const isMenuOverlayVisible = atom(false)

export const locale = persistentAtom('locale', 'en')
export const firstTimeVisitor = persistentAtom('hideIntro', true)
