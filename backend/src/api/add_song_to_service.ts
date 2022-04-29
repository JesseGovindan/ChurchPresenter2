import { RequestHandler } from 'express'

import { parseLyrics } from '../helpers/parse_lyrics'
import { getSongWithId } from '../songs'
import { folderToServiceItem } from '../transformers'
import { getBroadcaster } from '../websocket_server'

export const addSongToService: RequestHandler = async (request, response) => {
  const songId = parseInt(request.params.songId)
  const songToAdd = await getSongWithId(songId)
  if (songToAdd === null) {
    response.status(404).end()
    return
  }

  request.state.service.push({
    type: 'lyric',
    title: songToAdd.title,
    slides: parseLyrics(songToAdd.lyrics)
  })

  getBroadcaster().sendService(request.state.service.map(folderToServiceItem))

  response.end()
}
