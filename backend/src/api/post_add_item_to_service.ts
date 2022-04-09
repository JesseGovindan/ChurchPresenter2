// import { io as IO, option as O, task as T, taskEither as TE, either as E } from 'fp-ts'
// import express from 'express'
// import { pipe } from 'fp-ts/lib/function'
// import { SongInstance } from '../db/models/songs'

// import { Database, Service } from '../db/sqlite'
// import { getField, Request,
//   asNumber, respondWith2 } from '../router'

// const
// NO_TYPE_IN_SERVICE_ITEM_MESSAGE = `'id' body parameter invalid or missing from request body`

// const addSongToService = (service: Service) => (song: SongInstance): Service => {
//   const temp = service.slice()
//   temp.push({ type: 'lyric', title: song.title })
//   return temp
// }

// export function addItemToService (database: Database) {
//   return (request: any, response: any) => pipe(
//     TE.fromEither(getSongId(request, response)),
//     TE.chain(findSong(database, response)),
//     TE.map(addSongToService(database.service)),
//     TE.map(database.saveService),
//     TE.map(IO.map(respondWith2(response)(201)(database.service))),
//     TE.match(T.fromIO, T.fromIO),
//     T.flatten,
//   )
// }

// function getSongId(request: Request, response: express.Response): E.Either<IO.IO<void>, number> {
//   return pipe(
//     getField('id')(request.body),
//     O.chain(asNumber),
//     E.fromOption(() => respond(response)(makeError(400, NO_TYPE_IN_SERVICE_ITEM_MESSAGE)))
//   )
// }

// function findSong(
//   database: Database,
//   response: express.Response
// ): (s: number) => TE.TaskEither<IO.IO<void>, SongInstance> {
//   return songId => pipe(
//     database.getSong({ where: { id: songId } }),
//     TE.fromTaskOption(() => respond
//     (response)(makeError(404, `no song matches given id: '${songId}'`)))
//   )
// }

// interface ResponseData {
//   statusCode: number
//   body?: any
// }

// function makeError(statusCode: number, message: string): ResponseData {
//   return { statusCode, body: { message } }
// }

// function respond(response: express.Response) {
//   return (data: ResponseData) => respondWith2(response)(data.statusCode)(data.body)
// }
