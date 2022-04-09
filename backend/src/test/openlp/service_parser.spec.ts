import { expect } from 'chai'
import path from 'path'
import fs from 'fs'

import { parseServiceFromOpenLpService } from '../../openlp/service_parser'
import { getFileName } from '../get_file_name'
import { testService } from '../resources/test_service'
import { mightyToSaveSlides } from '../resources/mighty_to_save'
import { oneKingsNineteenTwoToThree } from '../resources/1_kings_19_2_3'

describe(getFileName(__filename), () => {
  const openLpServiceFile = fs.readFileSync(path.join(__dirname, '../resources/test.osj'))
  const openLpService = JSON.parse(openLpServiceFile.toString())

  it('parses all the folder titles and types', () => {
    // Arrange
    // Act
    const service = parseServiceFromOpenLpService(openLpService)
    // Assert
    expect(service).to.have.length(testService.length)
  })

  it('parses all lyric slides', () => {
    // Arrange
    // Act
    const service = parseServiceFromOpenLpService(openLpService)
    // Assert
    expect(service[0].slides).to.eql(mightyToSaveSlides)
  })

  it('parses all scripture slides', () => {
    // Arrange
    // Act
    const service = parseServiceFromOpenLpService(openLpService)
    // Assert
    expect(service[3].slides).to.eql(oneKingsNineteenTwoToThree)
  })
})
