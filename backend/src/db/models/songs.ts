// import { DataTypes, Model, Optional, Sequelize } from 'sequelize'

// interface SongAttributes {
//   id: number
//   title: string
//   alternate_title: string
//   lyrics: string
//   verse_order: string
//   copyright: string
//   comments: string
//   ccli_number: string
//   theme_name: string
//   search_title: string
//   search_lyrics: string
//   create_date: Date
//   last_modified: Date
//   temporary: boolean
// }

// interface SongCreationAttributes extends Optional<SongAttributes, 'id'> {}

// export interface SongInstance
// extends Model<SongAttributes, SongCreationAttributes>, SongAttributes {}

// export const defineSongsModel = (db: Sequelize) => {
//   return db.define<SongInstance>('Songs', {
//     id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
//     title: { type: DataTypes.STRING, allowNull: false },
//     alternate_title: { type: DataTypes.STRING },
//     lyrics: { type: DataTypes.TEXT, allowNull: false },
//     verse_order: { type: DataTypes.STRING(128) },
//     copyright: { type: DataTypes.STRING },
//     comments: { type: DataTypes.TEXT },
//     ccli_number: { type: DataTypes.STRING(64) },
//     theme_name: { type: DataTypes.STRING(128) },
//     search_title: { type: DataTypes.STRING, allowNull: false },
//     search_lyrics: { type: DataTypes.TEXT, allowNull: false },
//     create_date: { type: DataTypes.DATE },
//     last_modified: { type: DataTypes.DATE },
//     temporary: { type: DataTypes.BOOLEAN }
//   }, {
//     timestamps: false,
//   })
// }
