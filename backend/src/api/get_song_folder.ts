// import { flow, pipe } from 'fp-ts/lib/function'
// import { identity as I, task as T, option as O } from 'fp-ts'
// import _ from 'lodash'

// import { Database } from '../db/sqlite'
// import { 
//   asErrorResponse,
//   asNumber,
//   getField,
//   RequestHandler,
//   asJsonResponse 
// } from '../router'
// import { Folder } from '../interfaces'
// import { parseLyrics } from '../helpers/parse_lyrics'

// const stringNotANumberError = `'id' query parameter could not be converted to a number`

// export const getSongFolderHandler =
//   (database: Database): RequestHandler =>
//     (request, response) => pipe(
//       getField('id')(request.params),
//       O.match(
//         () => asErrorResponse(400)(response)(`Request did not contain 'id' query parameter`),
//         idString => pipe(
//           asNumber(idString),
//           O.match(
//             () => asErrorResponse(400)(response)(stringNotANumberError),
//             id => pipe(
//               database.getSong({ where: { id } }),
//               T.chain(flow(
//                 O.match(
//                   () => asErrorResponse(404)(response)(`Unable to find song with ID '${id}'`),
//                   flow(
//   
//   (song: any) => ({ type: 'song', slides: parseLyrics(song.lyrics, song.title) }),
//                     I.map(asJsonResponse<Folder>(response)),
//                   ),
//                 ),
//               ))
//             )
//           )
//         )
//       )
//     )
