import { Sequelize, ModelStatic } from 'sequelize'
import { defineSongsModel, SongInstance } from './models/songs'

export interface Database extends Sequelize {
  models: {
    songs: ModelStatic<SongInstance>
  }
}

export let database: Database

export function initialiseSongsDatabase(databaseLocation: string) {
  database = new Sequelize({
    dialect: 'sqlite',
    storage: databaseLocation,
    logging: false,
  }) as Database

  database.models.songs = defineSongsModel(database)
}
