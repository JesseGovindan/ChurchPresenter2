import { Open } from 'unzipper'
import { Actions } from 'commons'
import { SlideSpecifier } from 'commons/interfaces'
import { parseServiceFromOpenLpService } from '../openlp/service_parser'
import { CpSocket } from '../server'
import { State } from '../state'
import { 
  folderToServiceItem,
  songToServiceItem,
  stateToFolderView,
} from '../transformers'
import { findSongs } from '../songs'

export type ActionHandlers = Record<Actions, (t?: any) => Promise<void>> 

export interface HandlerState {
  broadcaster: CpSocket
  client: CpSocket
  state: State
}

export function createActionHandler(handler: HandlerState): ActionHandlers {
  handler.client.sendService(handler.state.service.map(folderToServiceItem))
  handler.client.sendFolder(stateToFolderView(handler.state))

  return {
    importService: async (zipBuffer: Buffer) => {
      const dir = await Open.buffer(zipBuffer)
      const osjBuffer = await dir.files[0].buffer()
      const serviceFile: any[] = JSON.parse(osjBuffer.toString())
      handler.state.service = parseServiceFromOpenLpService(serviceFile)
      handler.broadcaster.sendService(handler.state.service.map(folderToServiceItem))
    },

    selectFolder: async (index: number) => {
      handler.state.selectedFolderIndex = index
      handler.state.shownSlideIndex = undefined
      handler.broadcaster.sendFolder(stateToFolderView(handler.state))
    },

    deselectFolder: async () => {
      handler.state.selectedFolderIndex = undefined
      handler.broadcaster.sendFolder(null)
    },

    showSlide: async (slide: SlideSpecifier) => {
      handler.state.selectedFolderIndex = slide.folderIndex
      handler.state.shownSlideIndex = slide.slideIndex
      handler.broadcaster.sendFolder(stateToFolderView(handler.state))
    },

    hideSlide: async () => {
      handler.state.shownSlideIndex = undefined
      handler.broadcaster.sendFolder(stateToFolderView(handler.state))
    },

    findFolder: async (searchTerm: string) => {
      const foundSongs = await findSongs(searchTerm)
      handler.client.sendSearchResults(foundSongs.map(songToServiceItem))
    },
  }
}
