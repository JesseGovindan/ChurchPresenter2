import http from 'http'
import chai, { expect } from 'chai'
import { Actions, Data } from 'commons'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

chai.use(sinonChai)

import socketIoClient, { Socket } from 'socket.io-client'
import { CpSocket, createServer } from '../server'
import { getFileName } from './get_file_name'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { State } from '../state'
import * as actionHandlers from '../action_handlers'
import { allActions } from '../transformers'
import _ from 'lodash'
import { SearchResults } from 'commons/interfaces'

describe(getFileName(__filename), () => {
  let server: http.Server
  const portNumber = 7575
  let sandbox: sinon.SinonSandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    if (server) {
      server.close()
    }
    sandbox.restore()
  })

  async function startServerWithState(state: State) {
    server = createServer(state)
    await new Promise<void>(res => server.listen(portNumber, res))
  }

  describe('when multiple clients connected', () => {
    let clients: Socket[]
    let handlerProperties: actionHandlers.HandlerProperties

    beforeEach(async () => {
      await startServerWithState({ service: [], folder: {} })

      clients = [createWebSocketClient(), createWebSocketClient()] 

      await new Promise<void>(resolve => {
        let callCount = 0
        sandbox.stub(actionHandlers, 'createActionHandler')
          .callsFake(handler => {
            callCount++
            if (callCount === clients.length) {
              resolve()
              handlerProperties = handler
            }
            return createHandlerStubs()
          })
      })
    })

    interface Fixture {
      dataTypeName: string
      dataType: Data
      methodName: keyof CpSocket
      value: any
    }

    const fixtures: Fixture[] = [
      { 
        dataTypeName: 'SearchResult',
        dataType: Data.searchResults,
        value: [
          { title: 'Song', type: 'lyric' },
          { title: 'Verse', type: 'scripture' },
        ],
        methodName: 'sendSearchResults'
      },
      { 
        dataTypeName: 'Service',
        dataType: Data.serviceList,
        value: [
          { title: 'Song', type: 'lyric' },
          { title: 'Verse', type: 'scripture' },
        ],
        methodName: 'sendService'
      },
      {
        dataTypeName: 'Folder',
        dataType: Data.folder,
        value: {
          type: 'scripture',
          title: 'Verse',
          serviceIndex: 1,
          slides: [],
        },
        methodName: 'sendFolder',
      }
    ]

    for (const fixture of fixtures) {
      it(`creates broadcaster that sends a ${fixture.dataTypeName} to all sockets`, async () => {
        // Arrange
        const stubs = clients.map(client => {
          const stub = sandbox.stub()
          client.on(fixture.dataType, stub)
          return stub
        })
        // Act
        handlerProperties.broadcaster[fixture.methodName](fixture.value)
        await Promise.all(clients.map(client => {
          return waitForNext<SearchResults>(client, fixture.dataType)
        }))
        // Assert
        stubs.forEach(stub => expect(stub).to.have.been.calledWith(fixture.value))
      })

      it(`creates a client that sends a ${fixture.dataTypeName} to only one socket`, async () => {
        // Arrange
        const stubs = clients.map(client => {
          const stub = sandbox.stub()
          client.on(fixture.dataType, stub)
          return stub
        })
        // Act
        handlerProperties.client[fixture.methodName](fixture.value)
        await waitForNext(clients[1], fixture.dataType)
        // Assert
        expect(stubs[1]).to.have.been.calledWith(fixture.value)
        expect(stubs[0]).not.to.have.been.called
      })
    }
  })

  allActions().forEach(action => {
    it(`invokes actionHandler when ${action} action received`, async () => {
      // Arrange
      await startServerWithState({ service: [] })
      const handlerStubs = createHandlerStubs()
      const called = createPromiseForCall(handlerStubs[action])
      sandbox.stub(actionHandlers, 'createActionHandler')
        .returns(handlerStubs as any as actionHandlers.ActionHandlers)
      const wsClient = createWebSocketClient()
      // Act
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

  function createHandlerStubs(): Record<Actions, sinon.SinonStub> {
    const actions = allActions()
    const stubs = actions.map(action => sandbox.stub().callsFake(() => console.log(action)))
    return _.zipObject(actions, stubs) as Record<Actions, sinon.SinonStub>
  }

  function createPromiseForCall(stub: sinon.SinonStub): Promise<void> {
    return new Promise<void>(res => {
      stub.callsFake(res)
    })
  }
})
