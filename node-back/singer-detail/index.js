const { get } = require('../request')
const { getRandomVal } = require('../utils')
const getSecuritySign = require('../sign')
//* 响应成功code
const { CODE_OK } = require('../common')

//& 歌曲图片加载失败时使用的默认图片
const fallbackPicUrl =
  'https://y.gtimg.cn/mediastyle/music_v11/extra/default_300x300.jpg?max_age=31536000'

//& 注册歌手详情接口路由
function registerSingerDetail(app) {
  app.get('/api/getSingerDetail', (req, res) => {
    const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'
    const data = JSON.stringify({
      comm: { ct: 24, cv: 0 },
      singerSongList: {
        method: 'GetSingerSongList',
        param: { order: 1, singerMid: req.query.mid, begin: 0, num: 100 },
        module: 'musichall.song_list_server'
      }
    })

    const randomKey = getRandomVal('getSingerSong')
    const sign = getSecuritySign(data)

    get(url, {
      sign,
      '-': randomKey,
      data
    }).then(response => {
      const data = response.data
      if (data.code === CODE_OK) {
        const list = data.singerSongList.data.songList

        //* 处理歌曲列表
        const songList = handleSongList(list)

        res.json({
          code: CODE_OK,
          result: {
            songs: songList
          }
        })
      } else {
        res.json(data)
      }
    })
  })
}

//& 处理歌曲列表
function handleSongList(list) {
  const songList = []

  list.forEach(item => {
    const info = item.songInfo || item
    if (info.pay.pay_play !== 0 || !info.interval) {
      //* 过滤付费歌曲和获取不到时长的歌曲
      return
    }
    //* 构造歌曲的数据结构
    const song = createSong(info)

    songList.push(song)
  })

  return songList
}

function createSong(song) {
  return new Song(song)
}
class Song {
  constructor(song) {
    this.id = song.id
    this.mid = song.mid
    this.name = song.name
    this.singer = mergeSinger(song.singer)
    this.url = '' //* 可能第三方接口保护, 这里获取不到播放地址url, 需从另一个接口获取
    this.duration = song.interval
    this.pic = song.album.mid
      ? `https://y.gtimg.cn/music/photo_new/T002R800x800M000${song.album.mid}.jpg?max_age=2592000`
      : fallbackPicUrl
    this.album = song.album.name
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

module.exports = registerSingerDetail
