import { expect } from 'chai'
import { database, initialiseSongsDatabase } from '../../db/sqlite'
import { findSongs, getSongWithId } from '../../songs'
import { songBuilder } from '../builders/song_builder'
import { getFileName } from '../get_file_name'

describe(getFileName(__filename), () => {
  beforeEach(async () => {
    initialiseSongsDatabase(':memory:')
    await database.sync()
  })

  it('finds song which has a matching search_title', async () => {
    // Arrange
    await database.models.songs.create(
      songBuilder().withTitle('A String With The Word Game In It').build()
    )
    await database.models.songs.create(
      songBuilder().withTitle('Test Title').withLyrics([{
        type: 'v',
        lyrics: 'Lyrics With The Word Start In It',
        label: '1',
      }]).build()
    )
    // Act
    const result = await findSongs('game')
    // Assert
    expect(result).to.have.length(1)
    expect(result[0].title).to.eql('A String With The Word Game In It')
  })

  it('finds song which has a matching search_lyrics', async () => {
    // Arrange
    await database.models.songs.create(
      songBuilder().withTitle('A String With The Word Game In It').build()
    )
    await database.models.songs.create(
      songBuilder().withTitle('Test Title').withLyrics([{
        type: 'v',
        lyrics: 'Lyrics With The Word Start In It',
        label: '1',
      }]).build()
    )
    // Act
    const result = await findSongs('start')
    // Assert
    expect(result).to.have.length(1)
    expect(result[0].title).to.eql('Test Title')
  })

  it('gets song which has a matching id', async () => {
    // Arrange
    await database.models.songs.create(
      songBuilder().withTitle('A Song Title').withId(99).build()
    )
    await database.models.songs.create(
      songBuilder().withTitle('Another Song Title').withId(87).build()
    )
    // Act
    const result = await getSongWithId(99)
    // Assert
    expect(result).to.be.ok
    expect(result?.id).to.eql(99)
  })
})
