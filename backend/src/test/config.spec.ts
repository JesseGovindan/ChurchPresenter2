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
})
