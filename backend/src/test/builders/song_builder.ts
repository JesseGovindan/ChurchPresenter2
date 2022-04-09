const DEFAULT_LYRICS = `<?xml version='1.0' encoding='UTF-8'?>
<song version="1.0">
  <lyrics>
    <verse label="1" type="v">
      <![CDATA[You came to the world You created  Trading Your crown for a cross ]]>
    </verse>
  </lyrics>
</song>`

type Song = {
  id?: number
  title: string
  lyrics: string
  search_title: string
  search_lyrics: string
}

export const songBuilder = () => {
  const song: Song = {
    title: 'title',
    lyrics: DEFAULT_LYRICS,
    search_title: '',
    search_lyrics: '',
  }

  const builder = {
    withId: (id: number) => {
      song.id = id
      return builder
    },
    withTitle: (title: string) => {
      song.title = title
      return builder
    },
    withLyrics: (lyrics: string) => {
      song.lyrics = lyrics
      return builder
    },
    build: () => {
      return song
    }
  }
  return builder
}
