import fs from 'fs'
import path from 'path'
import chai, { expect } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

import { Actions, Service } from 'commons'
import { getFileName } from '../get_file_name'
import { testService } from '../resources/test_service'
import { ActionHandlers, createActionHandler } from '../../action_handlers'
import { CpSocket } from '../../server'
import * as songs from '../../songs'
import { State } from '../../state'
import { songBuilder } from '../builders/song_builder'

describe(getFileName(__filename), () => {
  let sandbox: sinon.SinonSandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('when created', () => {
    const testService: Service = [{
      title: 'Song',
      type: 'lyric',
      slides: []
    },{
      title: 'Verse',
      type: 'scripture',
      slides: [{
        text: 'In the beginning',
        sectionName: '1',
        caption: 'Perry 1:1',
      }, {
        text: 'At the end',
        sectionName: '2',
        caption: 'Perry 1:2',
      }],
    }]

    it('emits current service', async () => {
      // Arrange
      const handler = {
        broadcaster: createSocketStub(),
        client: createSocketStub(),
        state: { service: testService, folder: {} }
      }
      // Act
      createActionHandler(handler)
      // Assert
      expect(handler.client.sendService).to.have.been.calledOnceWith([
        { title: 'Song', type: 'lyric' },
        { title: 'Verse', type: 'scripture' },
      ])
    })

    it('emits null folder when created and no folder currently selected', async () => {
      // Arrange
      const handler = {
        broadcaster: createSocketStub(),
        client: createSocketStub(),
        state: { service: testService, folder: {} }
      }
      // Act
      createActionHandler(handler)
      // Assert
      expect(handler.client.sendFolder).to.have.been.calledOnceWith(null)
    })

    it('emits folder when created and folder currently selected', async () => {
      // Arrange
      const handler = {
        broadcaster: createSocketStub(),
        client: createSocketStub(),
        state: {
          service: testService,
          folder: {
            selectedFolderIndex: 1,
          }
        }
      }
      // Act
      createActionHandler(handler)
      // Assert
      expect(handler.client.sendFolder).to.have.been.calledOnceWith({
        serviceIndex: 1,
        title: 'Verse',
        type: 'scripture',
        slides: [{
          text: 'In the beginning',
          sectionName: '1',
          caption: 'Perry 1:1',
          isShown: false,
        }, {
          text: 'At the end',
          sectionName: '2',
          caption: 'Perry 1:2',
          isShown: false,
        }]
      })
    })

    it('emits folder with shown slide when created and slide currently shown', async () => {
      // Arrange
      const handler = {
        broadcaster: createSocketStub(),
        client: createSocketStub(),
        state: { 
          service: testService,
          folder: {
            selectedFolderIndex: 1,
            shownSlideIndex: 1,
          }
        }
      }
      // Act
      createActionHandler(handler)
      // Assert
      expect(handler.client.sendFolder).to.have.been.calledOnceWith({
        serviceIndex: 1,
        title: 'Verse',
        type: 'scripture',
        slides: [{
          text: 'In the beginning',
          sectionName: '1',
          caption: 'Perry 1:1',
          isShown: false,
        }, {
          text: 'At the end',
          sectionName: '2',
          caption: 'Perry 1:2',
          isShown: true,
        }]
      })
    })
  })

  describe('after created', () => {
    let actions: ActionHandlers
    let handler: {
      state: State,
      broadcaster: sinon.SinonStubbedInstance<CpSocket>,
      client: sinon.SinonStubbedInstance<CpSocket>
    }
    const currentService: Service = [{
      type: 'lyric',
      title: 'Who You Say I Am',
      slides: [{
        text: 'Verse 1',
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
    }, {
      title: 'Verse 2',
      type: 'scripture',
      slides: [{
        text: 'I am the Alpha',
        sectionName: '4',
        caption: 'Perry 3:3',
      }, {
        text: 'And the Omega',
        sectionName: '5',
        caption: 'Perry 3:4',
      }],
    }]

    beforeEach(() => {
      handler = {
        broadcaster: createSocketStub(),
        client: createSocketStub(),
        state: { service: currentService, folder: {} },
      }
      actions = createActionHandler(handler)

      const resetStubSocket = (stub: sinon.SinonStubbedInstance<CpSocket>) => {
        stub.sendService.reset()
        stub.sendFolder.reset()
        stub.sendSearchResults.reset()
      }

      resetStubSocket(handler.broadcaster)
      resetStubSocket(handler.client)
    })

    it('broadcasts updated service when new service is loaded', async () => {
      // Arrange
      const testFile = fs.readFileSync(path.join(__dirname, '../', 'resources/test.osz'))
      // Act
      await actions[Actions.importService](testFile)
      // Assert
      expect(handler.broadcaster.sendService).to.have.been.calledWith(testService)
      expect(handler.state.service).to.have.length(testService.length)
    })

    it('broadcasts selected folder when a folder is selected', async () => {
      // Arrange
      // Act
      await actions[Actions.selectFolder](1)
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

    it('broadcasts selected folder with no shown slides when a new folder is selected',
      async () => {
      // Arrange
        await actions[Actions.showSlide]({ folderIndex: 0, slideIndex: 0 })
        // Act
        await actions[Actions.selectFolder](2)
        // Assert
        expect(handler.state.folder).to.eql({ selectedFolderIndex: 2 })
      })

    it('broadcasts null when a folder is deselected', async () => {
      // Arrange
      // Act
      await actions[Actions.deselectFolder]()
      // Assert
      expect(handler.broadcaster.sendFolder).to.have.been.calledWith(null)
    })

    it('broadcasts selected folder with shown slide when a slide is shown', async () => {
      // Arrange
      // Act
      await actions[Actions.showSlide]({ folderIndex: 2, slideIndex: 1 })
      // Assert
      expect(handler.broadcaster.sendFolder).to.have.been.calledWith({
        serviceIndex: 2,
        title: 'Verse 2',
        type: 'scripture',
        slides: [{
          text: 'I am the Alpha',
          sectionName: '4',
          caption: 'Perry 3:3',
          isShown: false,
        }, {
          text: 'And the Omega',
          sectionName: '5',
          caption: 'Perry 3:4',
          isShown: true,
        }],
      })
    })

    it('broadcasts selected folder with no shown slide when a slide is hidden', async () => {
      // Arrange
      // Act
      await actions[Actions.showSlide]({ folderIndex: 2, slideIndex: 1 })
      await actions[Actions.hideSlide]()
      // Assert
      expect(handler.broadcaster.sendFolder).to.have.been.calledTwice
      expect(handler.broadcaster.sendFolder.lastCall).to.have.been.calledWith({
        serviceIndex: 2,
        title: 'Verse 2',
        type: 'scripture',
        slides: [{
          text: 'I am the Alpha',
          sectionName: '4',
          caption: 'Perry 3:3',
          isShown: false,
        }, {
          text: 'And the Omega',
          sectionName: '5',
          caption: 'Perry 3:4',
          isShown: false,
        }],
      })
    })

    it('emits found songs when searched for', async () => {
      // Arrange
      sandbox.stub(songs, 'findSongs').resolves([
        songBuilder().withTitle('Song Title 1').build(),
        songBuilder().withTitle('Song Title 2').build(),
      ])
      // Act
      await actions[Actions.findFolder]('search term')
      // Assert
      expect(handler.client.sendSearchResults).to.have.been.calledOnceWith([{
        type: 'lyric',
        title: 'Song Title 1',
      }, {
        type: 'lyric',
        title: 'Song Title 2',
      }])
    })

    it('searches for songs using the given search term', async () => {
      // Arrange
      const findSongsStub = sandbox.stub(songs, 'findSongs').resolves([])
      // Act
      await actions[Actions.findFolder]('search term')
      // Assert
      expect(findSongsStub).to.have.been.calledOnceWith('search term')
    })
  })

  function createSocketStub(): sinon.SinonStubbedInstance<CpSocket> {
    return {
      sendService: sandbox.stub(),
      sendFolder: sandbox.stub(),
      sendSearchResults: sandbox.stub(),
    }
  }
})
