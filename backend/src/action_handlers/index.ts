import { Actions } from 'commons'
import { SlideSpecifier } from 'commons/interfaces'
import { parseServiceFromOpenLpService } from '../openlp/service_parser'
import { CpSocket } from '../server'
import { State } from '../state'
import { asFolderView, folderToServiceItem } from '../transformers'

export type ActionHandlers = Record<Actions, (t?: any) => void> 

export interface HandlerState {
  broadcaster: CpSocket
  client: CpSocket
  state: State
}

export function createActionHandler(handler: HandlerState): ActionHandlers {
  return {
    importService: (buffer: Buffer) => {
      const serviceFile: any[] = JSON.parse(buffer.toString())
      handler.state.service = parseServiceFromOpenLpService(serviceFile)
      handler.broadcaster.sendService(handler.state.service.map(folderToServiceItem))
    },

    selectFolder: (index: number) => {
      handler.state.selectedFolderIndex = index
      handler.broadcaster.sendFolder(asFolderView(index, handler.state.service[index]))
    },

    deselectFolder: () => {
      handler.state.selectedFolderIndex = undefined
      handler.broadcaster.sendFolder(null)
    },

    showSlide: (slide: SlideSpecifier) => {
      handler.state.selectedFolderIndex = slide.folderIndex
      handler.state.shownSlideIndex = slide.slideIndex
      handler.broadcaster.sendFolder(asFolderView(
        slide.folderIndex, handler.state.service[slide.folderIndex], slide.slideIndex))
    },

    hideSlide: () => {
      const folderIndex = handler.state.selectedFolderIndex || 0
      handler.state.shownSlideIndex = undefined
      handler.broadcaster.sendFolder(asFolderView(folderIndex, handler.state.service[folderIndex]))
    },
  }
}
