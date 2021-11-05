import { get, post } from './base'
import { LYRIC_KEY } from '@/assets/js/constant'
import storage from 'good-storage'
import { decode } from 'js-base64'

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
        return song.url?.includes('vkey')
      })
  })
}

export const getSongLyric = song => {
  // * 根据song.mid, 看是否有缓存歌词, 如果有直接返回
  const mid = song.mid
  const lyricStorage = storage.get(LYRIC_KEY, {})
  const songStorageLyric = lyricStorage[mid]
  if (songStorageLyric) {
    return Promise.resolve(decode(songStorageLyric))
  }
  return get('/api/getSongLyric', {
    mid
  }).then(result => {
    const lyric = result?.lyric
    const decodeLyric = decode(lyric)
    // * 新获取的歌词加入缓存
    if (lyric && hasLyric(decodeLyric)) {
      lyricStorage[mid] = lyric
      storage.set(LYRIC_KEY, lyricStorage)
    }
    return lyric ? decodeLyric : '[00:00:00] 该歌曲暂时无法获取歌词'
  })
}

// * '[00:00:00] 此歌曲为没有填词的纯音乐, 请您欣赏', 类似于这种格式的歌词, 不需要缓存
const hasLyric = lyric => {
  const reg = /^\[(\d{2}):(\d{2}):(\d{2})\]/g
  return !reg.test(lyric)
}
