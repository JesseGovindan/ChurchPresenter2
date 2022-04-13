import fs from 'fs'
import path from 'path'
import chai, { expect } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

import { Actions, Service } from 'commons'
import { getFileName } from '../get_file_name'
import { testService } from '../resources/test_service'
import { createActionHandler } from '../../action_handlers'

describe(getFileName(__filename), () => {
  function createSocketStub() {
    return {
      sendService: sinon.stub(),
      sendFolder: sinon.stub(),
    }
  }

  it('broadcasts updated service when new service is loaded', async () => {
    // Arrange
    const testFile = fs.readFileSync(path.join(__dirname, '../', 'resources/test.osj'))
    const handler = {
      broadcaster: createSocketStub(),
      client: createSocketStub(),
      state: { service: [] }
    }
    const handlers = createActionHandler(handler)
    // Act
    handlers[Actions.importService](testFile)
    // Assert
    expect(handler.broadcaster.sendService).to.have.been.calledWith(testService)
    expect(handler.state.service).to.have.length(testService.length)
  })

  const currentService: Service = [{
    type: 'lyric',
    title: 'Who You Say I Am',
    slides: [{
      text: 'Text 1',
      sectionName: 'C',
    }],
  }, {
    type: 'scripture',
    title: 'Matthew 3:3 (NIV)',
    slides: [{
      text: 'Scripture 1',
      sectionName: '3',
    }, {
      text: 'Scripture 2',
      sectionName: '4',
    }],
  }]

  it('broadcasts selected folder when a folder is selected', async () => {
    // Arrange
    const handler = {
      broadcaster: createSocketStub(),
      client: createSocketStub(),
      state: { service: currentService },
    }
    const handlers = createActionHandler(handler)
    // Act
    handlers[Actions.selectFolder](1)
    // Assert
    expect(handler.broadcaster.sendFolder).to.have.been.calledWith({
      serviceIndex: 1,
      type: 'scripture',
      title: 'Matthew 3:3 (NIV)',
      slides: [{
        text: 'Scripture 1',
        sectionName: '3',
        isShown: false,
      }, {
        text: 'Scripture 2',
        sectionName: '4',
        isShown: false,
      }],
    })
  })

  it('broadcasts null when a folder is deselected', async () => {
    // Arrange
    const handler = {
      broadcaster: createSocketStub(),
      client: createSocketStub(),
      state: { service: currentService },
    }
    const handlers = createActionHandler(handler)
    // Act
    handlers[Actions.deselectFolder]()
    // Assert
    expect(handler.broadcaster.sendFolder).to.have.been.calledWith(null)
  })

  it('broadcasts selected folder with shown slide when a slide is shown', async () => {
    // Arrange
    const handler = {
      broadcaster: createSocketStub(),
      client: createSocketStub(),
      state: { service: currentService },
    }
    const handlers = createActionHandler(handler)
    // Act
    handlers[Actions.showSlide]({ folderIndex: 1, slideIndex: 1 })
    // Assert
    expect(handler.broadcaster.sendFolder).to.have.been.calledWith({
      serviceIndex: 1,
      type: 'scripture',
      title: 'Matthew 3:3 (NIV)',
      slides: [{
        text: 'Scripture 1',
        sectionName: '3',
        isShown: false,
      }, {
        text: 'Scripture 2',
        sectionName: '4',
        isShown: true,
      }],
    })
  })

  it('broadcasts selected folder with no shown slide when a slide is hidden', async () => {
    // Arrange
    const handler = {
      broadcaster: createSocketStub(),
      client: createSocketStub(),
      state: { service: currentService },
    }
    const handlers = createActionHandler(handler)
    // Act
    handlers[Actions.selectFolder](1)
    handlers[Actions.showSlide]({ folderIndex: 1, slideIndex: 1 })
    handlers[Actions.hideSlide]()
    // Assert
    expect(handler.broadcaster.sendFolder).to.have.been.calledThrice
    expect(handler.broadcaster.sendFolder.lastCall).to.have.been.calledWith({
      serviceIndex: 1,
      type: 'scripture',
      title: 'Matthew 3:3 (NIV)',
      slides: [{
        text: 'Scripture 1',
        sectionName: '3',
        isShown: false,
      }, {
        text: 'Scripture 2',
        sectionName: '4',
        isShown: false,
      }],
    })
  })
})
