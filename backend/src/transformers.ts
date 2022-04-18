import { Actions, Folder, FolderView, ServiceItem } from 'commons'
import _ from 'lodash'
import { Song } from './songs'

import { State } from './state'

export function allActions(): Actions[] {
  const result: Actions[] = []
  for (const action in Actions) {
    result.push(Actions[action as Actions])
  }
  return result
}

export function folderToServiceItem(folder: Folder): ServiceItem {
  return {
    type: folder.type,
    title: folder.title,
  }
}

export function stateToFolderView(state: State): FolderView | null {
  if (!_.isNil(state.selectedFolderIndex)) {
    if (!_.isNil(state.shownSlideIndex)) {
      return asFolderView(
        state.selectedFolderIndex,
        state.service[state.selectedFolderIndex],
        state.shownSlideIndex,
      )
    } else {
      return asFolderView(
        state.selectedFolderIndex,
        state.service[state.selectedFolderIndex],
      )
    }
  } else {
    return null
  }
}

function asFolderView(
  index: number,
  folder: Folder,
  showingSlideIndex?: number
): FolderView {
  return {
    serviceIndex: index,
    ...folder,
    slides: folder.slides.map((slide, index) => { 
      return {
        ...slide,
        isShown: index === showingSlideIndex,
      }
    })
  }
}

export function songToServiceItem(song: Song): ServiceItem {
  return {
    type: 'lyric',
    title: song.title,
  }
}
