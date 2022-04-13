import http from 'http'
import chai, { expect } from 'chai'
import { Actions, Data, Folder, FolderView, Service, ServiceList } from 'commons'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

chai.use(sinonChai)

import socketIoClient, { Socket } from 'socket.io-client'
import { createServer } from '../server'
import { getFileName } from './get_file_name'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { State } from '../state'
import * as actionHandlers from '../action_handlers'
import { allActions, folderToServiceItem } from '../transformers'

describe(getFileName(__filename), () => {
  let server: http.Server
  const portNumber = 7575
  let sandbox: sinon.SinonSandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
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


  afterEach(() => {
    if (server) {
      server.close()
    }
  })

  async function startServerWithState(state: State) {
    server = createServer(state)
    await new Promise<void>(res => server.listen(portNumber, res))
  }

  it('emits current service when websocket connects', async () => {
    // Arrange
    await startServerWithState({ service: currentService })
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

  it('emits null folder when no folder and slide are selected', async () => {
    // Arrange
    await startServerWithState({
      service: currentService,
      selectedFolderIndex: undefined,
      shownSlideIndex: undefined,
    })
    // Act
    const wsClient = createWebSocketClient()
    const folder = await waitForNext<Folder>(wsClient, Data.folder)
    // Assert
    expect(folder).to.eql(null)
  })

  it('emits selected folder when folder selected with no shows slides', async () => {
    // Arrange
    await startServerWithState({
      service: currentService,
      selectedFolderIndex: 1,
      shownSlideIndex: undefined,
    })
    const expected: FolderView = {
      title: 'Matthew 3:3 (NIV)',
      type: 'scripture',
      serviceIndex: 1,
      slides: [{
        text: 'Scripture 1',
        sectionName: '3',
        isShown: false,
      }, {
        text: 'Scripture 2',
        sectionName: '4',
        isShown: false,
      }]
    }

    // Act
    const wsClient = createWebSocketClient()
    const folder = await waitForNext<FolderView>(wsClient, Data.folder)
    // Assert
    expect(folder).to.eql(expected)
  })

  it('emits selected folder with shown slide when slide selected', async () => {
    // Arrange
    await startServerWithState({
      service: currentService,
      selectedFolderIndex: 1,
      shownSlideIndex: 1,
    })
    const expected: FolderView = {
      title: 'Matthew 3:3 (NIV)',
      type: 'scripture',
      serviceIndex: 1,
      slides: [{
        text: 'Scripture 1',
        sectionName: '3',
        isShown: false,
      }, {
        text: 'Scripture 2',
        sectionName: '4',
        isShown: true,
      }]
    }

    // Act
    const wsClient = createWebSocketClient()
    const folder = await waitForNext<FolderView>(wsClient, Data.folder)
    // Assert
    expect(folder).to.eql(expected)
  })

  it('emits current service when websocket connects', async () => {
    // Arrange
    await startServerWithState({ service: currentService })
    // Act
    const wsClient = createWebSocketClient()
    const message = await waitForNext<ServiceList>(wsClient, Data.serviceList)
    // Assert
    expect(message).to.eql([{
      type: 'lyric',
      title: 'Who You Say I Am',
    }, {
      type: 'scripture',
      title: 'Matthew 3:3 (NIV)',
    }])
  })

  it('invokes createActionHandler with a correct broadcaster', async () => {
    // Arrange
    await startServerWithState({ service: currentService })
    const createActionHandlerStub = sandbox.stub(actionHandlers, 'createActionHandler')
      .returns(createHandlerStubs())

    const wsClient1 = createWebSocketClient()
    const wsClient2 = createWebSocketClient()
    await Promise.all([
      waitForNext<ServiceList>(wsClient1, Data.serviceList),
      waitForNext<ServiceList>(wsClient2, Data.serviceList),
    ])
    const broadcaster = createActionHandlerStub.getCalls()[1].args[0].broadcaster
    const stub1 = sandbox.stub()
    const stub2 = sandbox.stub()
    wsClient1.on(Data.serviceList, stub1)
    wsClient2.on(Data.serviceList, stub2)
    // Act
    broadcaster.sendService(currentService.map(folderToServiceItem))
    await waitForNext<ServiceList>(wsClient1, Data.serviceList)
    await waitForNext<ServiceList>(wsClient2, Data.serviceList)
    // Assert
    expect(stub1).to.have.been.called
    expect(stub2).to.have.been.called
  })

  allActions().forEach(action => {
    it(`invokes actionHandler when ${action} action received`, async () => {
      // Arrange
      await startServerWithState({ service: currentService })
      const handlerStubs = createHandlerStubs()
      const called = createPromiseForCall(handlerStubs[action])
      sandbox.stub(actionHandlers, 'createActionHandler')
        .returns(handlerStubs as any as actionHandlers.ActionHandlers)
      // Act
      const wsClient = createWebSocketClient()
      wsClient.emit(action, 'value')
      await called
      // Assert
      expect(handlerStubs[action]).to.have.been.calledWith('value')
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

  function createHandlerStubs(): Record<Actions, sinon.SinonStub> {
    return {
      importService: sandbox.stub(),
      selectFolder: sandbox.stub(),
      deselectFolder: sandbox.stub(),
      showSlide: sandbox.stub(),
      hideSlide: sandbox.stub(),
    }
  }

  function createPromiseForCall(stub: sinon.SinonStub): Promise<void> {
    return new Promise<void>(res => {
      stub.callsFake(res)
    })
  }
})
