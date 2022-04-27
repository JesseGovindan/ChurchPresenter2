import express from 'express'
import http from 'http'
import _ from 'lodash'
import path from 'path'

import { addSongToService } from './api/add_song_to_service'
import { createWebSocketServer } from './websocket_server'
import { State } from './state'

export function createServer(state: State): http.Server {
  const router = createRouter(state)
  const server = http.createServer(router)
  createWebSocketServer(server, state)
  return server
}

function createRouter(state: State) {
  const router = express()
  disableCors(router)
  addStaticFileRouting(router)
  router.use('*', (request, _response, next) => {
    request.state = state
    next()
  })
  router.post('/service/song/:songId', addSongToService)
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