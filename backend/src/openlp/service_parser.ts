import { Folder, Service, Slide } from 'commons'

export function parseServiceFromOpenLpService(openLpService: any[]): Service {
  return openLpService
    .filter(object => object.hasOwnProperty('serviceitem'))
    .map(item => item.serviceitem)
    .map(createFolderFromOpenLpServiceItemHeader)
}

function createFolderFromOpenLpServiceItemHeader(serviceitem: any): Folder {
  const type = serviceitem.header.name === 'songs' ? 'lyric' : 'scripture'

  return {
    type,
    title: serviceitem.header.title,
    slides: type === 'lyric'
      ? getLyricSlides(serviceitem.data) 
      : getScriptureSlides(serviceitem.data, serviceitem.header.title),
  }
}

function getLyricSlides(data: any[]): Slide[] {
  return data.map(slide => ({
    text: slide.raw_slide,
    sectionName: slide.verseTag,
  }))
}

const bracketTest = /{|}/
const verseTest = /.*:(\d+)/

function getScriptureSlides(data: any[], title: string): Slide[] {
  const chapter = title.substring(0, title.indexOf(':'))
  const version = title.substring(title.lastIndexOf(' ') + 1)

  return data.map(slide => {
    const parts = slide.raw_slide.split(bracketTest)
    parts[1] = `<${parts[1]}>`
    parts[3] = `<${parts[3]}>`

    const verseNumber = verseTest.exec(parts[2])?.at(1) || ''
    const raw_text = slide.raw_slide as string
    return {
      text: raw_text.substring(raw_text.indexOf('nbsp;') + 5),
      sectionName: verseNumber,
      caption: `${chapter}:${verseNumber} (${version})`
    }
  })
}
