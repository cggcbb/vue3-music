//& 处理歌曲列表
function handleSongList(list) {
  const songList = []

  list.forEach(item => {
    const info = item.songInfo ?? item
    const payPlay = info.pay.pay_play ?? info.pay.payplay
    if (payPlay !== 0 || !info.interval) {
      //* 过滤付费歌曲和获取不到时长的歌曲
      return
    }
    //* 构造歌曲的数据结构
    const song = createSong(info)

    songList.push(song)
  })

  return songList
}

//& 歌曲图片加载失败时使用的默认图片
const fallbackPicUrl =
  'https://y.gtimg.cn/mediastyle/music_v11/extra/default_300x300.jpg?max_age=31536000'

function createSong(song) {
  return new Song(song)
}

class Song {
  constructor(song) {
    this.id = song.id ?? song.songid
    this.mid = song.mid ?? song.songmid
    this.name = song.name ?? song.songname
    this.singer = mergeSinger(song.singer)
    this.url = '' //* 可能第三方接口保护, 这里获取不到播放地址url, 需从另一个接口获取
    this.duration = song.interval
    this.pic =
      song.album?.mid ?? song.albummid
        ? `https://y.gtimg.cn/music/photo_new/T002R800x800M000${song.album?.mid ||
            song.albummid}.jpg?max_age=2592000`
        : fallbackPicUrl
    this.album = song.album?.name ?? song.albumname
  }
}

//& 合并多个歌手的姓名
function mergeSinger(singer) {
  const ret = []
  if (!singer) {
    return ''
  }
  singer.forEach(s => {
    ret.push(s.name)
  })
  return ret.join('/')
}

const token = 5381

module.exports = {
  CODE_OK: 0,
  handleSongList,
  token
}
