import { Service } from 'commons'

export interface State {
  service: Service
  selectedFolderIndex?: number
  shownSlideIndex?: number
}
