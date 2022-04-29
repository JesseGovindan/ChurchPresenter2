import { expect } from 'chai'
import { Service } from 'commons'
import * as sinon from 'sinon'
import request from 'supertest'

import { parseLyrics } from '../../helpers/parse_lyrics'
import { createServer } from '../../server'
import * as songs from '../../songs'
import { CpSocket } from '../../websocket_server'
import * as websocket_server from '../../websocket_server'
import { songBuilder } from '../builders/song_builder'
import { getFileName } from '../get_file_name'

describe(getFileName(__filename), () => {
  const A_SONG_ID_THAT_DOES_NOT_EXIST = 2
  const A_VALID_SONG_ID = 3
  const VALID_SONG = songBuilder().withId(A_VALID_SONG_ID).withTitle('Valid Song Title').build()

  let sandbox: sinon.SinonSandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    sandbox.stub(songs, 'getSongWithId')
      .withArgs(A_SONG_ID_THAT_DOES_NOT_EXIST)
      .resolves(null)
      .withArgs(A_VALID_SONG_ID)
      .resolves(VALID_SONG)
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('returns 404 when song id does NOT exist in the database', done => {
    // Arrange
    const server = createServer({ service: [], folder: {} })
    // Act
    request(server)
      .post(`/service/song/${A_SONG_ID_THAT_DOES_NOT_EXIST}`)
      // Assert
      .expect(404)
      .end(done)
  })

  describe('when song id exists in song database', () => {
    let broadcasterStub: sinon.SinonStubbedInstance<CpSocket>

    beforeEach(() => {
      broadcasterStub = {
        sendFolder: sandbox.stub(),
        sendSearchResults: sandbox.stub(),
        sendService: sandbox.stub(),
      }
      sandbox.stub(websocket_server, 'getBroadcaster').returns(broadcasterStub)
    })

    it('returns 200 when song id does exist in the database', done => {
      // Arrange
      const server = createServer({ service: [], folder: {} })
      // Act
      request(server)
        .post(`/service/song/${A_VALID_SONG_ID}`)
      // Assert
        .expect(200)
        .end(done)
    })

    it('adds song to service', async () => {
      // Arrange
      const service: Service = []
      const server = createServer({ service, folder: {} })
      // Act
      await request(server)
        .post(`/service/song/${A_VALID_SONG_ID}`)
      // Assert
      expect(service).to.have.length(1)
      expect(service).to.eql([{
        type: 'lyric', 
        title: VALID_SONG.title,
        slides: parseLyrics(VALID_SONG.lyrics),
      }])
    })

    it('broadcasts updated service', async () => {
      // Arrange
      const service: Service = []
      const server = createServer({ service, folder: {} })
      // Act
      await request(server)
        .post(`/service/song/${A_VALID_SONG_ID}`)
      // Assert
      expect(broadcasterStub.sendService).to.have.been.calledOnceWith([{
        type: 'lyric', 
        title: VALID_SONG.title,
      }])
    })
  })
})
