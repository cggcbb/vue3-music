const { get } = require('../request')
const { getRandomVal } = require('../utils')
const getSecuritySign = require('../sign')
//* 响应成功code
const { CODE_OK, handleSongList } = require('../common')

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

module.exports = registerSingerDetail
