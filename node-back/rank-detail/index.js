const { get } = require('../request')
const { getRandomVal } = require('../utils')
const getSecuritySign = require('../sign')
// * 响应成功code
const { CODE_OK, handleSongList } = require('../common')

// & 获取排行榜详情接口
function registerRankDetail(app) {
  app.get('/api/getRankDetail', (req, res) => {
    const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'
    const { id, period } = req.query

    const data = JSON.stringify({
      detail: {
        module: 'musicToplist.ToplistInfoServer',
        method: 'GetDetail',
        param: {
          topId: Number(id),
          offset: 0,
          num: 100,
          period
        }
      },
      comm: {
        ct: 24,
        cv: 0
      }
    })

    const randomKey = getRandomVal('getUCGI')
    const sign = getSecuritySign(data)

    get(url, {
      sign,
      '-': randomKey,
      data
    }).then(response => {
      const data = response.data
      if (data.code === CODE_OK) {
        const list = data.detail.data?.songInfoList
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

module.exports = registerRankDetail
