import express from 'express'
import http from 'http'
import path from 'path'
import socketIoServer from 'socket.io'
import { Data } from 'commons'
import { allActions } from './transformers'
import { FolderView, SearchResults, ServiceList } from 'commons/interfaces'
import { State } from './state'
import _ from 'lodash'
import { initialiseActionHandlers } from './action_handlers'

export interface CpSocket {
  sendFolder: (folder: FolderView | null) => void
  sendService: (service: ServiceList) => void
  sendSearchResults: (results: SearchResults) => void
}

export function createServer(state: State): http.Server {
  const router = createRouter()
  const server = http.createServer(router)
  createWebSocketServer(server, state)
  return server
}

function createRouter() {
  const router = express()
  disableCors(router)
  addStaticFileRouting(router)
  return router
}

function disableCors(router: express.Express) {
  router.use('/*', (_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    next()
  })
}

function addStaticFileRouting(router: express.Express) {
  // Routing is handled by the frontend.
  // This allows React to handle route changes correctly.
  const publicPath = path.join(__dirname, 'public')
  router.use(express.static(publicPath))
  router.use('*', express.static(publicPath))
}

function createWebSocketServer(server: http.Server, state: State) {
  const wsServer = new socketIoServer.Server(server, {
    cors: {
      origin: '*',
    },
  })
  wsServer.on('connection', clientSocket => {
    const actionHandlers = initialiseActionHandlers({
      broadcaster: createCpSocket(wsServer),
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
