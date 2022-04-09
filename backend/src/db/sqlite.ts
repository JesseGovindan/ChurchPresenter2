// import { Sequelize, FindOptions, Model } from 'sequelize'
// import { task as T, option as O, io as IO, taskOption as TO } from 'fp-ts'
// import { pipe } from 'fp-ts/lib/function'
// import { defineSongsModel, SongInstance } from './models/songs'
// import { DatabaseConfig } from '../config'

// export interface ServiceItem {
//   type: 'lyric' | 'scripture'
//   title: string
// }

// export interface Database {
//   instance: Sequelize
//   getAllSongs: (options:FindOptions) => T.Task<Model<any, any>[]>
//   getSong: (options:FindOptions) => TO.TaskOption<SongInstance>
//   service: Service
//   saveService: (newService: Service) => IO.IO<void>
// }

// export const createDatabase = (config: DatabaseConfig) => pipe(
//   (): Database => {
//     const instance = new Sequelize({
//       dialect: 'sqlite',
//       storage: config.dbLocation,
//       logging: false,
//     })

//     const service: Service = []

//     return {
//       instance,
//       getAllSongs: getAllSongs(instance),
//       getSong: getSong(instance),
//       service,
//       saveService: saveService(service),
//     }
//   },
//   IO.chainFirst(db => () => defineSongsModel(db.instance)),
// )

// const getAllSongs = (db: Sequelize) => (options: FindOptions = {}): T.Task<Model<any, any>[]> => {
//   return () => db.models.Songs.findAll(options)
// }

// const getSong = (db: Sequelize) => (options: FindOptions): T.Task<O.Option<SongInstance>> => {
//   return pipe(
//     () => db.models.Songs.findOne(options),
//     T.map(song => O.fromNullable(song as SongInstance)),
//   )
// }

// function saveService(currentService: Service): (newService: Service) => IO.IO<void> {
//   return (newService: Service) => () => {
//     currentService.length = 0
//     currentService.push(...newService) 
//   }
// }
