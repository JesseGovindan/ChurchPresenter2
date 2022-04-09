import _ from 'lodash'
import { asBoolean, asNumber, Parser } from './router'

export interface DatabaseConfig {
  dbLocation: string
}

export interface Config extends DatabaseConfig {
  serverPort: number
  onlyApi: boolean
}

const DEFAULT_SERVER_PORT = 3000
const ONLY_API = false

export function getConfig(args: string[]): Config {
  const fields = argsToFields(args)
  return {
    serverPort: getFieldOrDefault(asNumber, 'serverPort', DEFAULT_SERVER_PORT, fields),
    onlyApi: getFieldOrDefault(asBoolean, 'onlyApi', ONLY_API, fields),
    dbLocation: '/home/jesse/Documents/cp/backend/openlp/data/songs/songs.sqlite',
  }
}

function argsToFields(args: string[]): Record<string, string> {
  const record: Record<string, string> = {}
  for (let i = 0; i < args.length; i += 2) {
    record[args[i].substring(2)] = args[i + 1]
  }
  return record
}

function getFieldOrDefault<T>(
  parser: Parser<T>,
  name: string,
  defaultValue: T,
  args: Record<string, string>
) {
  const field = _.get(args, name, null)
  if (_.isNil(field)) {
    return defaultValue
  }

  const parsed = parser(field)
  return parsed || defaultValue
}
