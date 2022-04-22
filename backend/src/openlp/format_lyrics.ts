export interface LyricSlide {
  lyrics: string
  type: string
  label: string
}

export function formatLyrics(slides: LyricSlide[]): { xml: string, searchLyrics: string } {
  return { 
    xml: createXmlLyrics(slides),
    searchLyrics: createSearchLyrics(slides),
  }
}

const XML_LYRIC_HEADER = `<?xml version='1.0' encoding='UTF-8'?><song version="1.0"><lyrics>`
const XML_LYRIC_FOOTER = `</lyrics></song>`

function createXmlLyrics(slides: LyricSlide[]): string {
  const xmlLyrics = slides.map(slide => {
    const startTag = `<verse label="${slide.label}" type="${slide.type}">`
    const innerData = `<![CDATA[${slide.lyrics}]]>`
    const endTag = `</verse>`
    return startTag + innerData + endTag
  }).join('')

  return XML_LYRIC_HEADER + xmlLyrics + XML_LYRIC_FOOTER
}

function createSearchLyrics(slides: LyricSlide[]): string {
  return slides.map(slide =>
    slide.lyrics.toLowerCase().replace(/\n/g, ' ').replace(/[,\.!\@#\$%\^&\*]/g, '')
  ).join(' ')
}
