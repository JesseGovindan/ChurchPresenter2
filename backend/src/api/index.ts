// import { pipe } from 'fp-ts/lib/function'
// import { addToRouter, createRouter } from '../router'
// import { getAllSongsHandler } from './get_all_songs'
// import { getSongFolderHandler } from './get_song_folder'
// import { io as IO } from 'fp-ts'
// import express from 'express'
// import { Database } from '../db/sqlite'
// import { addItemToService } from './post_add_item_to_service'

// export const createApi = (database: Database): IO.IO<express.Express> => pipe(
//   createRouter,
//   IO.chain(addToRouter('get')('/api/songs')(getAllSongsHandler(database))),
//   IO.chain(addToRouter('get')('/api/songs/:id')(getSongFolderHandler(database))),

//   IO.chain(addToRouter('post')('/api/service')(addItemToService(database))),
// )
