import _ from 'lodash'

export type Parser<T> = (text: string) => T | null

export function asNumber(possibleNumber: string): number | null {
  const i = parseInt(possibleNumber)
  return isNaN(i) ? null : i
}

export function asBoolean(possibleBool: string): boolean | null {
  const lowercase = possibleBool.toLowerCase()
  return lowercase === 'true' || lowercase === 'false' ? lowercase === 'true' : null
}
