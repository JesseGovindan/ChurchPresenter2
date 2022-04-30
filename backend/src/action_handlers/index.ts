import { Actions } from 'commons'
import { SlideSpecifier } from 'commons/interfaces'
import { Open } from 'unzipper'

import { parseServiceFromOpenLpService } from '../openlp/service_parser'
import { findSongs } from '../songs'
import { FolderState, State } from '../state'
import { folderToServiceItem, songToSearchResult, stateToFolderView } from '../transformers'
import { CpSocket } from '../websocket_server'

export type ActionHandlers = Record<Actions, (t?: any) => Promise<void>> 

export interface HandlerProperties {
  broadcaster: CpSocket
  client: CpSocket
  state: State
}

export function initialiseActionHandlers(properties: HandlerProperties): ActionHandlers {
  properties.client.sendService(properties.state.service.map(folderToServiceItem))
  properties.client.sendFolder(stateToFolderView(properties.state))

  return {
    importService: async (zipBuffer: Buffer) => {
      const dir = await Open.buffer(zipBuffer)
      const osjBuffer = await dir.files[0].buffer()
      const serviceFile: any[] = JSON.parse(osjBuffer.toString())
      properties.state.service = parseServiceFromOpenLpService(serviceFile)
      properties.broadcaster.sendService(properties.state.service.map(folderToServiceItem))
    },

    selectFolder: async (index: number) => {
      changeFolderStateAndBroadcast(properties, { selectedFolderIndex: index })
    },

    deselectFolder: async () => {
      changeFolderStateAndBroadcast(properties, {})
    },

    showSlide: async (slide: SlideSpecifier) => {
      changeFolderStateAndBroadcast(properties, {
        selectedFolderIndex: slide.folderIndex,
        shownSlideIndex: slide.slideIndex 
      })
    },

    hideSlide: async () => {
      changeFolderStateAndBroadcast(properties, {
        selectedFolderIndex: properties.state.folder.selectedFolderIndex
      })
    },

    findSong: async (searchTerm: string) => {
      const foundSongs = await findSongs(searchTerm)
      properties.client.sendSearchResults(foundSongs.map(songToSearchResult))
    },
  }
}

function changeFolderStateAndBroadcast(properties: HandlerProperties, folder: FolderState) {
  properties.state.folder = folder
  properties.broadcaster.sendFolder(stateToFolderView(properties.state))
}
