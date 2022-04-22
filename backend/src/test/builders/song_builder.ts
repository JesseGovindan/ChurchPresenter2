import { formatLyrics, LyricSlide } from '../../openlp/format_lyrics'
import { Song } from '../../songs'

const DEFAULT_LYRICS = `<?xml version='1.0' encoding='UTF-8'?>
<song version="1.0">
  <lyrics>
    <verse label="1" type="v">
      <![CDATA[You came to the world You created\nTrading Your crown for a cross ]]>
    </verse>
  </lyrics>
</song>`

export const songBuilder = () => {
  const song: Omit<Song, 'id'> & { id?: number } = {
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
      song.search_title = title.toLowerCase()
      return builder
    },
    withLyrics: (lyrics: LyricSlide[]) => {
      const formattedLyrics = formatLyrics(lyrics)
      song.lyrics = formattedLyrics.xml
      song.search_lyrics = formattedLyrics.searchLyrics
      return builder
    },
    build: () => {
      return song as Song
    }
  }
  return builder
}
