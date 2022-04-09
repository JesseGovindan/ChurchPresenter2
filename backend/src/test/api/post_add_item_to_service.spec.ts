// import express from 'express'
// import { expect } from 'chai'
// import supertest from 'supertest'

// import { createApi } from '../../api'
// import { createDatabase, Database } from '../../db/sqlite'
// import { songBuilder } from '../builders/song_builder'

// describe('postAddItemToService', () => {
//   let api: express.Express
//   let database: Database
//   const testSongId = 3
//   const invalidSongId = 99
//   const testSongTitle = 'A Title'

//   beforeEach(async () => {
//     database = createDatabase({ dbLocation: ':memory:' })()
//     await database.instance.sync({ force: true })

//     const song = songBuilder().withId(testSongId).withTitle(testSongTitle).build()
//     await database.instance.models.Songs.build(song).save()

//     api = createApi(database)()
//   })

//   it('adds item to service and returns current service', async () => {
//     // Arange
//     const response = await supertest(api)
//     // Act
//       .post(`/api/service`)
//       .send({ type: 'lyric', id: testSongId })
//     // Assert
//     expect(response.status).to.eql(201)
//     expect(response.body).to.eql([{ type: 'lyric', title: testSongTitle }])
//     expect(database.service).to.have.length(1)
//     expect(database.service[0]).to.eql({ type: 'lyric', title: testSongTitle })
//   })

//   it('returns 400 when request body does not contain "id" field', async () => {
//     // Arange
//     const response = await supertest(api)
//     // Act
//       .post(`/api/service`)
//       .send({ type: 'lyric' })
//     // Assert
//     expect(response.status).to.eql(400)
//     expect(response.body).to.eql({ 
//       message: `'id' body parameter invalid or missing from request body` 
//     })
//     expect(database.service).to.have.length(0)
//   })

//   it('returns 400 when request body "id" field is not a number', async () => {
//     // Arange
//     const response = await supertest(api)
//     // Act
//       .post(`/api/service`)
//       .send({ type: 'lyric', id: 'a' })
//     // Assert
//     expect(response.status).to.eql(400)
//     expect(response.body).to.eql({ 
//       message: `'id' body parameter invalid or missing from request body` 
//     })
//     expect(database.service).to.have.length(0)
//   })

//   it('returns 404 when no song matches given id', async () => {
//     // Arange
//     const response = await supertest(api)
//     // Act
//       .post(`/api/service`)
//       .send({ type: 'lyric', id: invalidSongId })
//     // Assert
//     expect(response.status).to.eql(404)
//     expect(response.body).to.eql({ 
//       message: `no song matches given id: '99'` 
//     })
//     expect(database.service).to.have.length(0)
//   })
// })
