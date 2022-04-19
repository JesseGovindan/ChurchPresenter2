import { Service } from 'commons'

export interface State {
  service: Service
  folder: FolderState
}

export interface FolderState {
  selectedFolderIndex?: number | undefined
  shownSlideIndex?: number | undefined
}
