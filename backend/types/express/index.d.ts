import { CpSocket } from '../../src/websocket_server'
import { State } from '../../src/state'

declare global {
  namespace Express {
    interface Request {
      state: State
      broadcaster: CpSocket
    }
  }
}
