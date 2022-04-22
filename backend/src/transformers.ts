import { Actions, Folder, FolderView, ServiceItem } from 'commons'
import { SearchResult } from 'commons/interfaces'
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
  const folder = state.folder
  if (!_.isNil(folder.selectedFolderIndex)) {
    if (!_.isNil(folder.shownSlideIndex)) {
      return asFolderView(
        folder.selectedFolderIndex,
        state.service[folder.selectedFolderIndex],
        folder.shownSlideIndex,
      )
    } else {
      return asFolderView(
        folder.selectedFolderIndex,
        state.service[folder.selectedFolderIndex],
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

export function songToSearchResult(song: Song): SearchResult {
  return {
    id: song.id,
    type: 'lyric',
    title: song.title,
  }
}
