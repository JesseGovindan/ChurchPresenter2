import { QueryTypes, Sequelize } from 'sequelize'

export interface SourceVerse {
  book_number: number
  chapter: number
  verse: number
  text: string
}

export interface OutputVerse {
  id: number
  book_id: number
  chapter: number
  verse: number
  text: string
}

export const say = (message: string) => () => console.log(message)

export const initialiseDatabase = (storage: string) => () => new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: false
})

export const getAllVersesFromSource = (sourceDb: Sequelize) => (): Promise<SourceVerse[]> => {
  return sourceDb.query('SELECT * from verses', { type: QueryTypes.SELECT })
}
