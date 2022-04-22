export interface LyricSlide {
  lyrics: string
  type: string
  label: string
}

export function formatLyrics(slides: LyricSlide[]): { xml: string, searchLyrics: string } {
  const xmlSlides = slides.map(slide => {
    const startTag = `<verse label="${slide.label}" type="${slide.type}">`
    const endTag = `</verse>`
    const inner = `<![CDATA[${slide.lyrics}]]>`
    return startTag + inner + endTag
  })

  const header = `<?xml version='1.0' encoding='UTF-8'?><song version="1.0"><lyrics>`
  const footer = `</lyrics></song>`

  return { 
    xml: header + xmlSlides.join('') + footer,
    searchLyrics: slides.map(slide =>
      slide.lyrics.toLowerCase().replace(/\n/g, ' ').replace(/[,\.!\@#\$%\^&\*]/g, '')
    ).join(' '),
  }
}
