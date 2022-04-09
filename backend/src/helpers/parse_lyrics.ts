// import { XMLParser } from 'fast-xml-parser'
// import { pipe } from 'fp-ts/lib/function'
// import _ from 'lodash'

// import { Slide } from '../interfaces'

// export const parseLyrics = (lyrics: string, title: string): Slide[] => {
//   return pipe(
//     new XMLParser({ ignoreAttributes: false }),
//     p => p.parse(lyrics),
//     outer => _.get(outer, 'song.lyrics.verse'),
//     verses => Array.isArray(verses) ? verses : [verses],
//     verses => verses.map(
//       (verse: any) => ({
//         text: verse['#text'].split('\n').map((line: string) => line.trim()).join('\n'),
//         heading: verse['@_type'] + verse['@_label'],
//       } as { text: string, heading: string })),
//     verses =>
//       verses.map((verse: any) => ({ text: verse.text, caption: title, heading: verse.heading }))
//   )
// }
