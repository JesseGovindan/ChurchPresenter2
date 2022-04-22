import { Slide } from 'commons'
import { XMLParser } from 'fast-xml-parser'
import _ from 'lodash'

export function parseLyrics(lyrics: string): Slide[] {
  const parser = new XMLParser({ ignoreAttributes: false })
  const lyricsJson = parser.parse(lyrics)
  let versesJson = _.get(lyricsJson, 'song.lyrics.verse')
  versesJson = Array.isArray(versesJson) ? versesJson : [versesJson]
  const verses = versesJson.map(
    (verse: any) => ({
      text: verse['#text'].split('\n').map((line: string) => line.trim()).join('\n'),
      heading: verse['@_type'] + verse['@_label'],
    } as { text: string, heading: string }))
  return verses.map((verse: any) => ({
    text: verse.text,
    sectionName: verse.heading.toUpperCase()
  }))
}
