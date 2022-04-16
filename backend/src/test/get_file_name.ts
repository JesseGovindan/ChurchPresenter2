export function getFileName(__filename: string): string {
  const parts = __filename.split(/\/|\\/)
  const indexOfTest = parts.indexOf('test')
  return parts.slice(indexOfTest + 1).join('/')
}
