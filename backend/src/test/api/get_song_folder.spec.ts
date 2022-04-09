// import express from 'express'
// import { expect } from 'chai'
// import Sinon from 'sinon'
// import supertest from 'supertest'

// import { parseLyrics } from '../../helpers/parse_lyrics'
// import { createApi } from '../../api'
// import { createDatabase, Database } from '../../db/sqlite'

// describe('getFolderForSong', () => {
//   const lyrics = `<?xml version='1.0' encoding='UTF-8'?>
//   <song version="1.0"><lyrics><verse label="1" type="v"><![CDATA[You came to the world You created  
// Trading Your crown for a cross ]]></verse><verse label="1" type="v"><![CDATA[You willingly died  
// Your innocent life paid the cost]]></verse><verse label="2" type="v">
// <![CDATA[Counting Your status as nothing  
//     The King of all kings came to serve  ]]></verse></lyrics></song>`

//   let sandbox: Sinon.SinonSandbox
//   const testSongId = 3
//   const nonExistentSongId = 999
//   let api: express.Express
//   let database: Database

//   beforeEach(async () => {
//     sandbox = Sinon.createSandbox()

//     database = createDatabase({ dbLocation: ':memory:' })()
//     await database.instance.sync({ force: true })
//     await database.instance.models.Songs.build({ 
//       id: testSongId,
//       title: 'test',
//       lyrics,
//       search_title: 'test',
//       search_lyrics: '',
//     }).save()
//     api = createApi(database)()
//   })

//   afterEach(() => {
//     sandbox.restore()
//   })

//   it('gets the folder', async () => {
//     // Arange
//     const response = await supertest(api)
//     // Act
//       .get(`/api/songs/${testSongId}`)
//     // Assert
//     expect(response.status).to.eql(200)
//     expect(response.body).to.eql({ type: 'song', slides: parseLyrics(lyrics, 'test') })
//   })

//   it('returns 404 when song is not found', async () => {
//     // Arange
//     const res = await supertest(api)
//     // Act
//       .get(`/api/songs/${nonExistentSongId}`)
//     // Assert
//     expect(res.status).to.eql(404)
//     expect(res.body).to.eql({ message: `Unable to find song with ID '999'` })
//   })

//   it('returns 400 when song not on path', async () => {
//     // Arange
//     const res = await supertest(api)
//     // Act
//       .get(`/api/songs/abc`)
//     // Assert
//     expect(res.status).to.eql(400)
//     expect(res.body).to.eql({ 
//       message: `'id' query parameter could not be converted to a number` 
//     })
//   })
// })
