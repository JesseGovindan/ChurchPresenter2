import { app, BrowserWindow } from 'electron'
import http from 'http'
import path from 'path'

import { Config, getConfig } from './config'
import { initialiseSongsDatabase } from './db/sqlite'
import { createServer } from './server'

function main() {
  const config = getConfig(process.argv.slice(2))
  initialiseSongsDatabase(config.songDatabaseLocation)
  console.log('Song Database Location: ', config.songDatabaseLocation)
  const server = startBackend(config)
  startFrontend(config, server)
}

function startBackend(config: Config) {
  const server = createServer({ service: [], folder: {} })
  server.listen(config.serverPort)
  return server
}

function startFrontend(config: Config, server: http.Server) {
  if (!config.onlyApi) {
    app.on('ready', async () => {
      const window = new BrowserWindow({
        width: 400,
        height: 600,
        icon: path.join(__dirname, 'public/favicon.ico'),
      })
      window.loadURL(`http://localhost:${config.serverPort}/mobile`)
      window.menuBarVisible = false
    })

    app.on('before-quit', () => {
      server.close()
    })
  }
}

main()
