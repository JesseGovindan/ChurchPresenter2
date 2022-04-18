export interface Song {
  title: string
}

export async function findSongs(_searchTerm: string): Promise<Song[]> {
  return []
}
