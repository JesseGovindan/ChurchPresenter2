export type Service = Folder[]

export interface Folder {
  title: string
  type: ItemType
  slides: Slide[]
}

export interface FolderView {
  serviceIndex: number,
  title: string
  type: ItemType
  slides: SlideView[]
}

export interface Slide {
  text: string
  sectionName: string
  caption?: string
}

export interface SlideView {
  text: string
  sectionName: string
  caption?: string
  isShown: boolean;
}

export type ServiceList = ServiceItem[]

export interface ServiceItem {
  type: ItemType
  title: string
}

export type SearchResult = ServiceItem & { id: number }

export type SearchResults = SearchResult[]

export type ItemType = 'lyric' | 'scripture'

export type SelectedFolder = number

export interface SlideSpecifier {
  folderIndex: number
  slideIndex: number
}
