import _ from 'lodash'
import path from 'path'

export interface DatabaseConfig {
  songDatabaseLocation: string
}

export interface Config extends DatabaseConfig {
  serverPort: number
  onlyApi: boolean
}

export type Parser<T> = (text: string) => T | null

export function asNumber(possibleNumber: string): number | null {
  const i = parseInt(possibleNumber)
  return isNaN(i) ? null : i
}

export function asBoolean(possibleBool: string): boolean | null {
  const lowercase = possibleBool.toLowerCase()
  return lowercase === 'true' || lowercase === 'false' ? lowercase === 'true' : null
}

function asString(s: string) { return s }

const DEFAULT_SERVER_PORT = 3000
const ONLY_API = false

export function getConfig(args: string[]): Config {
  const fields = argsToFields(args)
  return {
    serverPort: getFieldOrDefault('serverPort', DEFAULT_SERVER_PORT, fields, asNumber),
    onlyApi: getFieldOrDefault('onlyApi', ONLY_API, fields, asBoolean),
    songDatabaseLocation: getFieldOrDefault('songDb', getSongDatabaseLocation(), fields, asString),
  }
}

function argsToFields(args: string[]): Record<string, string> {
  const record: Record<string, string> = {}
  for (let i = 0; i < args.length; i += 2) {
    record[args[i].substring(2)] = args[i + 1]
  }
  return record
}

function getFieldOrDefault<T = string>(
  name: string,
  defaultValue: T,
  args: Record<string, string>,
  parser: Parser<T>,
) {
  const field = _.get(args, name, null)
  if (_.isNil(field)) {
    return defaultValue
  }

  const parsed = parser(field)
  return parsed || defaultValue
}

function getSongDatabaseLocation() {
  const home = getWindowsHomeFolder() || getLinuxHomeFolder()
  const location = home ? path.join(home, 'songs/songs.sqlite') : ':memory:'
  return location
}

function getWindowsHomeFolder() {
  return process.env.APPDATA ? path.join(process.env.APPDATA, 'openlp/data') : null
}

function getLinuxHomeFolder() {
  return process.env.HOME ? path.join(process.env.HOME, '.local/share/openlp') : null
}
