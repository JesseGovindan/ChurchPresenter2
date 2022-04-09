import { Sequelize, QueryTypes, DataTypes } from 'sequelize'
import fs from 'fs'
import { task as T, boolean as B, io as IO, array as A } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { getAllVersesFromSource, initialiseDatabase, OutputVerse, say, SourceVerse } from './common'

const bookMap = [ 
  10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 190, 220, 230, 240, 250,
  260, 290, 300, 310, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470,
  480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640, 650, 660, 
  670, 680, 690, 700, 710, 720, 730
]

const removeFile = (filename: string): T.Task<boolean> => () =>
  new Promise<boolean>(resolve => { fs.rm(filename, err => { resolve(!err) }) })

const createFile = (filename: string): T.Task<boolean> => () =>
  new Promise<boolean>(resolve => { 
    fs.open(filename, 'w', (err, fd) => { 
      if (!err) {
        fs.close(fd, closeError => resolve(!closeError))
      } else {
        resolve(false) 
      }
    }) 
  })

const outputFilename = 'GW.sqlite'
const outputPath = `../${outputFilename}`
const sourcePath = './openlp/data/bibles/GWN.SQLite3'

const logRemoveFileResult = (removeFileResult: boolean) => pipe(
  removeFileResult,
  B.match(
    say(`Unable to delete old ${outputFilename} database file`),
    say(`Old ${outputFilename} database file deleted`),
  )
)

const logCreateFileResult = (createFileResult: boolean) => pipe(
  createFileResult,
  B.match(
    say(`Unable to create new ${outputFilename} database file`),
    say(`${outputFilename} database file created`),
  )
)

const cleanUpFiles = pipe(
  removeFile(outputPath),
  T.map(logRemoveFileResult),
  T.chain(() => createFile(outputPath)),
  T.map(logCreateFileResult)
)

const createVerseTable = (outputDb: Sequelize) => (): Promise<void> => {
  return outputDb.getQueryInterface().createTable('verse', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    chapter: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    verse: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
    }
  })
}

const createDatabaseConnections = pipe(
  IO.Do,
  IO.bind('outputDb', () => initialiseDatabase(outputPath)),
  IO.bind('sourceDb', () => initialiseDatabase(sourcePath)),
  dbs => pipe(
    T.fromIO(dbs),
    T.chain(dbs => pipe(
      dbs.outputDb,
      createVerseTable,
      T.map(_ => dbs),
    ))
  )
)

const toOutputFormat = (sourceVerse: SourceVerse, index: number): OutputVerse => {
  return {
    id: index + 1,
    book_id: bookMap.indexOf(sourceVerse.book_number) + 1,
    chapter: sourceVerse.chapter,
    verse: sourceVerse.verse,
    text: sourceVerse.text,
  }
}

const insertIntoOutput = (outputDb: Sequelize) => (value: OutputVerse) => (): Promise<any> => {
  console.log(`Inserting ${value.book_id} ${value.chapter}:${value.verse}`)
  return outputDb.query(`INSERT INTO verse (book_id, chapter, verse, text) 
VALUES(:book_id, :chapter, :verse, :text)`, { 
    type: QueryTypes.INSERT,
    replacements: {
      book_id: value.book_id,
      chapter: value.chapter,
      verse: value.verse,
      text: value.text,
    }
  })
}

const main = pipe(
  cleanUpFiles,
  T.chain(() => createDatabaseConnections),
  T.chain(dbs => pipe(
    getAllVersesFromSource(dbs.sourceDb),
    T.map(sourceVerses => sourceVerses.map(toOutputFormat)),
    T.chain(outputVerses => pipe(
      A.map(insertIntoOutput(dbs.outputDb))(outputVerses),
      A.reduce(T.of({} as any), (current, next) => pipe(current, T.chain(_ => next))),
    )),
  )),
)

main()
