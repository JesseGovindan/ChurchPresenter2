import { CpSocket } from '../../server'
import { State } from '../../state'

declare global {
  namespace Express {
    interface Request {
      state: State
      broadcaster: CpSocket
    }
  }
}
