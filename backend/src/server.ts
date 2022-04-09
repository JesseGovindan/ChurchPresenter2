import express from 'express'
import http from 'http'
import path from 'path'
import socketIoServer from 'socket.io'
import { Actions, Data, Folder } from 'commons'
import { parseServiceFromOpenLpService } from './openlp/service_parser'
import { folderToServiceItem } from './transformers'
import { FolderView, SlideSpecifier } from 'commons/interfaces'
import { State } from './state'
import _ from 'lodash'

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
    clientSocket.emit(Data.serviceList, state.service.map(folderToServiceItem))
    if (!_.isNil(state.selectedFolderIndex)) {
      if (!_.isNil(state.shownSlideIndex)) {
        clientSocket.emit(Data.folder, asFolderView(
          state.selectedFolderIndex,
          state.service[state.selectedFolderIndex],
          state.shownSlideIndex,
        ))
      } else {
        clientSocket.emit(Data.folder, asFolderView(
          state.selectedFolderIndex,
          state.service[state.selectedFolderIndex],
        ))
      }
    } else {
      clientSocket.emit(Data.folder, null)
    }

    clientSocket.on(Actions.importService, (fileBuffer: Buffer) => {
      const serviceFile: any[] = JSON.parse(fileBuffer.toString())
      state.service = parseServiceFromOpenLpService(serviceFile)
      wsServer.emit(Data.serviceList, state.service.map(folderToServiceItem))
    })

    clientSocket.on(Actions.selectFolder, (index: number) => {
      state.selectedFolderIndex = index
      wsServer.emit(Data.folder, asFolderView(index, state.service[index]))
    })

    clientSocket.on(Actions.deselectFolder, () => {
      state.selectedFolderIndex = undefined
      wsServer.emit(Data.folder, null)
    })

    clientSocket.on(Actions.showSlide, (slide: SlideSpecifier) => {
      state.selectedFolderIndex = slide.folderIndex
      state.shownSlideIndex = slide.slideIndex
      wsServer.emit(Data.folder, asFolderView(
        slide.folderIndex, state.service[slide.folderIndex], slide.slideIndex))
    })

    clientSocket.on(Actions.hideSlide, () => {
      const folderIndex = state.selectedFolderIndex || 0
      state.shownSlideIndex = undefined
      wsServer.emit(Data.folder, asFolderView(folderIndex, state.service[folderIndex]))
    })
  })
}

function asFolderView(index: number, folder: Folder, showingSlideIndex?: number): FolderView {
  return {
    serviceIndex: index,
    ...folder,
    slides: folder.slides.map((slide, index) => { 
      return {
        ...slide,
        isShown: index === showingSlideIndex,
      }
    })
  }
}
