// import { task as T, option as O } from 'fp-ts'
// import { pipe } from 'fp-ts/lib/function'
// import { FindOptions } from 'sequelize/types'
// import { Op, Model } from 'sequelize'
// import { Database } from '../db/sqlite'
// import { asJsonResponse, getField, RequestHandler } from '../router'
// import _ from 'lodash'

// const findAllSongsOptions: FindOptions = {
//   attributes: ['id', 'title'],
// }

// const getAllSongs = (database: Database) => () => database.getAllSongs(findAllSongsOptions)

// const getAllSongsMatchingSearchTerm =
//   (database: Database) =>
//     (searchTerm: string) => database.getAllSongs({ 
//       ...findAllSongsOptions,
//       where: {
//         [Op.or]: {
//           search_title: { [Op.like]: `%${searchTerm}%` },
//           search_lyrics: { [Op.like]: `%${searchTerm}%` },
//         } 
//       }
//     })

// export const getAllSongsHandler =
//   (database: Database): RequestHandler =>
//     (request, response) => pipe(
//       getField('search')(request.query),
//       O.match(
//         getAllSongs(database),
//         getAllSongsMatchingSearchTerm(database)
//       ),
//       T.map(songsToSongReferences),
//       T.chain(asJsonResponse(response)),
//     )

// const songsToSongReferences = (songs: Model<any, any>[]) => songs.map(
//   song => ({ id: song.get('id') as number, title: song.get('title') as string, type: 'song' }))
