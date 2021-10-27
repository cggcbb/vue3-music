const { get } = require('../request')
const { getRandomVal } = require('../utils')
const getSecuritySign = require('../sign')
// * 响应成功code
const { CODE_OK } = require('../common')

// & 获取排行榜接口
function registerRankList(app) {
  app.get('/api/getRankList', (req, res) => {
    const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'

    const data = JSON.stringify({
      comm: { ct: 24 },
      toplist: { module: 'musicToplist.ToplistInfoServer', method: 'GetAll', param: {} }
    })

    const randomKey = getRandomVal('recom')
    const sign = getSecuritySign(data)

    get(url, {
      sign,
      '-': randomKey,
      data
    }).then(response => {
      const data = response.data
      if (data.code === CODE_OK) {
        const rankList = []
        const group = data.toplist.data.group

        group.forEach(item => {
          item.toplist.forEach(listItem => {
            rankList.push({
              id: listItem.topId,
              pic: listItem.frontPicUrl,
              name: listItem.title,
              period: listItem.period,
              songList: listItem.song.map(songItem => {
                return {
                  id: songItem.songId,
                  singerName: songItem.singerName,
                  songName: songItem.title
                }
              })
            })
          })
        })

        res.json({
          code: CODE_OK,
          result: {
            rankList
          }
        })
      } else {
        res.json(data)
      }
    })
  })
}

module.exports = registerRankList
