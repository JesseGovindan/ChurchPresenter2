import { app, BrowserWindow } from 'electron'
import { Config, getConfig } from './config'
import http from 'http'

import { createServer } from './server'

function main() {
  const config = getConfig(process.argv.slice(2))
  const server = startBackend(config)
  startFrontend(config, server)
}

function startBackend(config: Config) {
  const server = createServer({ service: [] })
  server.listen(config.serverPort)
  return server
}

function startFrontend(config: Config, server: http.Server) {
  if (!config.onlyApi) {
    app.on('ready', async () => {
      const window = new BrowserWindow({ width: 400, height: 600 })
      window.loadURL(`http://localhost:${config.serverPort}/mobile`)
      window.menuBarVisible = false
    })

    app.on('before-quit', () => {
      server.close()
    })
  }
}

main()
