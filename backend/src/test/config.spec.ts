import { expect } from 'chai'
import { getConfig } from '../config'
import { getFileName } from './get_file_name'

describe(getFileName(__filename), () => {
  it('parses serverPort from args', () => {
    // Arrange
    const args = ['--serverPort', '2999']
    // Act
    const config = getConfig(args)
    // Assert
    expect(config.serverPort).to.eql(2999)
  })

  it('sets serverPort to 3000 if not set', () => {
    // Arrange
    // Act
    const config = getConfig([])
    // Assert
    expect(config.serverPort).to.eql(3000)
  })

  it('parses onlyApi from args', () => {
    // Arrange
    const args = ['--onlyApi', 'true']
    // Act
    const config = getConfig(args)
    // Assert
    expect(config.onlyApi).to.eql(true)
  })

  it('sets onlyApi to false if not set', () => {
    // Arrange
    // Act
    const config = getConfig([])
    // Assert
    expect(config.onlyApi).to.eql(false)
  })

  it('gets songDatabaseLocation from args', () => {
    // Arrange
    const args = ['--songDb', '/home/songs/test.sqlite']
    // Act
    const config = getConfig(args)
    // Assert
    expect(config.songDatabaseLocation).to.eql('/home/songs/test.sqlite')
  })

  it('gets songDatabaseLocation from APPDATA', () => {
    // Arrange
    delete process.env.HOME
    process.env.APPDATA = '/home'
    // Act
    const config = getConfig([])
    // Assert
    expect(config.songDatabaseLocation).to.eql('/home/openlp/data/songs/songs.sqlite')
  })

  it('gets songDatabaseLocation from HOME', () => {
    // Arrange
    delete process.env.APPDATA
    process.env.HOME = '/home'
    // Act
    const config = getConfig([])
    // Assert
    expect(config.songDatabaseLocation).to.eql('/home/.local/share/openlp/songs/songs.sqlite')
  })

  it('uses in memory database if HOME and APPDATA locations are nonexistent', () => {
    // Arrange
    delete process.env.APPDATA
    delete process.env.HOME
    // Act
    const config = getConfig([])
    // Assert
    expect(config.songDatabaseLocation).to.eql(':memory:')
  })
})
