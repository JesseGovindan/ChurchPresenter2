import { Op } from 'sequelize'
import { database } from '../db/sqlite'

export interface Song {
  id: number
  title: string
  alternate_title?: string
  lyrics: string
  verse_order?: string
  copyright?: string
  comments?: string
  ccli_number?: string
  theme_name?: string
  search_title: string
  search_lyrics: string
  create_date?: Date
  last_modified?: Date
  temporary?: boolean
}

export async function findSongs(searchTerm: string): Promise<Song[]> {
  return database.models.songs.findAll({
    where: {
      [Op.or]: {
        search_title: {
          [Op.like]: `%${searchTerm}%`,
        },
        search_lyrics: {
          [Op.like]: `%${searchTerm}%`,
        },
      }
    }
  })
}
