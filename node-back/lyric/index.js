const { get } = require('../request')
const { getRandomVal } = require('../utils')
//* 响应成功code
const { CODE_OK } = require('../common')

//& 获取歌曲的真实播放地址
function registerLyric(app) {
  app.get('/api/getSongLyric', async (req, res) => {
    const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

    const params = {
      _: getRandomVal(),
      cv: 4747474,
      ct: 24,
      g_tk_new_20200303: 5381,
      songmid: req.query.mid
    }

    get(url, params).then(response => {
      const data = response.data
      if (data.code === CODE_OK) {
        const { lyric } = data
        res.json({
          code: CODE_OK,
          result: {
            lyric
          }
        })
      } else {
        res.json(data)
      }
    })
  })
}

module.exports = registerLyric
