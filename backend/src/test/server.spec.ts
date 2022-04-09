import fs from 'fs'
import http from 'http'
import { expect } from 'chai'
import socketIoClient, { Socket } from 'socket.io-client'
import { createServer } from '../server'
import { getFileName } from './get_file_name'
import { testService } from './resources/test_service'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { Actions, Data, Folder, FolderView, Service, ServiceList } from 'commons'

describe(getFileName(__filename), () => {
  let server: http.Server
  const portNumber = 7575

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

  const testFile = fs.readFileSync(__dirname + '/resources/test.osj')

  beforeEach(done => {
    server = createServer({ service: currentService })
    server.listen(portNumber, done)
  })

  afterEach(() => server.close())

  it('emits current service when websocket connects', async () => {
    // Arrange
    // Act
    const wsClient = createWebSocketClient()
    const message = await waitForNextServiceListMessage(wsClient)
    // Assert
    expect(message).to.eql([{
      type: 'lyric',
      title: 'Who You Say I Am',
    }, {
      type: 'scripture',
      title: 'Matthew 3:3 (NIV)',
    }])
  })

  it('emits updated service when new service is loaded', async () => {
    // Arrange
    const wsClient = createWebSocketClient()
    await waitForNextServiceListMessage(wsClient)
    // Act
    wsClient.emit(Actions.importService, testFile)
    const message = await waitForNextServiceListMessage(wsClient)
    // Assert
    expect(message).to.have.length(testService.length)
    testService.forEach((_, index) => expect(message[index]).to.eql(testService[index]))
  })

  it('emits updated service to all clients', async () => {
    // Arrange
    const wsClient1 = createWebSocketClient()
    const wsClient2 = createWebSocketClient()
    // We need to wait for all initial service list messages to be received
    await waitForNextServiceListMessage(wsClient1)
    await waitForNextServiceListMessage(wsClient2)
    // Act
    wsClient1.emit(Actions.importService, testFile)
    const message = await waitForNextServiceListMessage(wsClient2)
    // Assert
    expect(message).to.have.length(testService.length)
  })

  it('emits selected folder index when a folder is selected', async () => {
    // Arrange
    const wsClient1 = createWebSocketClient()
    const wsClient2 = createWebSocketClient()
    // Act
    wsClient1.emit(Actions.selectFolder, 1)
    const message = await waitForNext<FolderView>(wsClient1, Data.folder)
    // Assert
    expect(message).to.eql({
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

    await waitForNext<Folder>(wsClient2, Data.folder)
  })

  it('emits null folder when a folder is deselected', async () => {
    // Arrange
    const wsClient = createWebSocketClient()
    // Act
    wsClient.emit(Actions.selectFolder, 1)
    wsClient.emit(Actions.deselectFolder)
    await waitForNext<FolderView>(wsClient, Data.folder)
    const message = await waitForNext<FolderView>(wsClient, Data.folder)
    // Assert
    expect(message).to.eql(null)
  })

  it('emits null folder when a folder is deselected', async () => {
    // Arrange
    const wsClient = createWebSocketClient()
    // Act
    wsClient.emit(Actions.selectFolder, 1)
    wsClient.emit(Actions.deselectFolder)
    await waitForNext<FolderView>(wsClient, Data.folder)
    const message = await waitForNext<FolderView>(wsClient, Data.folder)
    // Assert
    expect(message).to.eql(null)
  })

  it('emits folder with shown slide when slide shown', async () => {
    // Arrange
    const wsClient = createWebSocketClient()
    // Act
    wsClient.emit(Actions.showSlide, { folderIndex: 1, slideIndex: 1 })
    const message = await waitForNext<FolderView>(wsClient, Data.folder)
    // Assert
    expect(message).to.eql({
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

  it('emits folder with shown slide when slide shown', async () => {
    // Arrange
    const wsClient = createWebSocketClient()
    // Act
    wsClient.emit(Actions.showSlide, { folderIndex: 1, slideIndex: 1 })
    wsClient.emit(Actions.hideSlide)
    await waitForNext<FolderView>(wsClient, Data.folder)
    const message = await waitForNext<FolderView>(wsClient, Data.folder)
    // Assert
    expect(message).to.eql({
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

  function createWebSocketClient() {
    return socketIoClient(`http://localhost:${portNumber}/`)
  }

  function waitForNext<T>(socket: Socket<DefaultEventsMap, DefaultEventsMap>, dataType: Data) {
    return new Promise<T>(resolve => socket.on(dataType, resolve))
  }

  function waitForNextServiceListMessage(socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
    return waitForNext<ServiceList>(socket, Data.serviceList)
  }
})
