export function getFileName(__filename: string): string {
  return __filename.split(/\/|\\/).pop() as string
}
