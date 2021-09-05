import { get, post } from './base'

export const processSongPureUrl = songs => {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  return post('/api/getSongsPureUrl', {
    mid: songs.map(song => song.mid)
  }).then(result => {
    const map = result.map
    return songs
      .map(song => {
        song.url = map[song.mid]
        return song
      })
      .filter(song => {
        return song.url.includes('vkey')
      })
  })
}

export const getSongLyric = song => {
  return get('/api/getSongLyric', {
    mid: song.mid
  }).then(result => {
    const lyric = result?.lyric || '[00:00:00] 该歌曲暂时无法获取歌词'
    return lyric
  })
}
