import { DataTypes, Model, Optional, Sequelize } from 'sequelize'

import { Song } from '../../songs'

interface SongCreationAttributes extends Optional<Song, 'id'> {}

export interface SongInstance
extends Model<Song, SongCreationAttributes>, Song {}

export function defineSongsModel(db: Sequelize) {
  return db.define<SongInstance>('songs', {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    alternate_title: { type: DataTypes.STRING },
    lyrics: { type: DataTypes.TEXT, allowNull: false },
    verse_order: { type: DataTypes.STRING(128) },
    copyright: { type: DataTypes.STRING },
    comments: { type: DataTypes.TEXT },
    ccli_number: { type: DataTypes.STRING(64) },
    theme_name: { type: DataTypes.STRING(128) },
    search_title: { type: DataTypes.STRING, allowNull: false },
    search_lyrics: { type: DataTypes.TEXT, allowNull: false },
    create_date: { type: DataTypes.DATE },
    last_modified: { type: DataTypes.DATE },
    temporary: { type: DataTypes.BOOLEAN }
  }, {
    timestamps: false,
    freezeTableName: true,
  })
}
