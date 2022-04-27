import { Data, FolderView, SearchResults, ServiceList } from 'commons'
import http from 'http'
import socketIoServer from 'socket.io'
import { initialiseActionHandlers } from './action_handlers'

import { State } from './state'
import { allActions } from './transformers'

export interface CpSocket {
  sendFolder: (folder: FolderView | null) => void
  sendService: (service: ServiceList) => void
  sendSearchResults: (results: SearchResults) => void
}

export let broadcaster: CpSocket

export function createWebSocketServer(server: http.Server, state: State) {
  const wsServer = new socketIoServer.Server(server, {
    cors: {
      origin: '*',
    },
  })
  broadcaster = createCpSocket(wsServer)
  wsServer.on('connection', clientSocket => {
    const actionHandlers = initialiseActionHandlers({
      broadcaster: broadcaster,
      client: createCpSocket(clientSocket),
      state,
    })

    allActions().forEach(action => clientSocket.on(action, actionHandlers[action]))
  })
}

function createCpSocket(socket: socketIoServer.Server | socketIoServer.Socket): CpSocket {
  return {
    sendFolder: (folder: FolderView | null) => {
      socket.emit(Data.folder, folder)
    },
    sendService: (service: ServiceList) => {
      socket.emit(Data.serviceList, service)
    },
    sendSearchResults: (results: SearchResults) => {
      socket.emit(Data.searchResults, results)
    }, 
  }
}