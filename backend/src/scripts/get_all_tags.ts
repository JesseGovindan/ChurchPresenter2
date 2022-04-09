import { pipe } from 'fp-ts/lib/function'
import { task as T, io as IO, array as A } from 'fp-ts'

import { getAllVersesFromSource, initialiseDatabase, SourceVerse } from './common'

const dbPath = './openlp/data/bibles/AMP/AMP.SQLite3'

const tagMap = new Map<string, SourceVerse>()

const addToMap = (verse: SourceVerse) => (tag:string): IO.IO<void> => () => {
  if (!tagMap.has(tag)) {
    tagMap.set(tag, verse)
  }
}

const getTagsFromVerse = (text: string) => {
  return text.split('<')
    .map(s => s.substring(0, s.indexOf('>')))
    .map(s => s.replace('/', ''))
    .filter(s => s.length > 0)
}

const processVerse = (verse: SourceVerse) => pipe(
  getTagsFromVerse(verse.text),
  A.map(addToMap(verse)),
  A.reduce(() => {}, (current, next) => pipe(current, IO.chain(_ => next))),
)

const processAllVerses = (verses: SourceVerse[]): T.Task<void> => pipe(
  A.map(processVerse)(verses),
  A.map(T.fromIO),
  A.reduce(T.fromIO(() => {}), (current, next) => pipe(current, T.chain(_ => next))),
)

const logAllTags = () => {
  tagMap.forEach((verse, key) => {
    console.log(`tag: ${key}, example '${verse.text}'`)
  })
}

const main = pipe(
  T.fromIO(initialiseDatabase(dbPath)),
  T.chain(getAllVersesFromSource),
  T.chain(processAllVerses),
  T.map(logAllTags) 
)

main()
