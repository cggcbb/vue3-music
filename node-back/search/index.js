//* 获取签名方法
const { get } = require('../request')
const { getRandomVal } = require('../utils')

//* 响应成功code
const { CODE_OK, handleSongList, token } = require('../common')

// & 注册搜索查询接口
function registerSearch(app) {
  app.get('/api/search', (req, res) => {
    const url = 'https://shc.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

    const { query, page, showSinger } = req.query

    // * 每页20条数据
    const data = {
      _: getRandomVal(),
      g_tk_new_20200303: token,
      w: query,
      p: page,
      perpage: 100,
      n: 100,
      zhidaqu: 1,
      catZhida: showSinger === 'true' ? 1 : 0,
      t: 0,
      flag: 1,
      ie: 'utf-8',
      sem: 1,
      aggr: 0,
      remoteplace: 'txt.mqq.all',
      uin: '0',
      needNewCode: 1,
      platform: 'h5',
      format: 'json'
    }

    get(url, data).then(response => {
      const data = response.data
      if (data.code === CODE_OK) {
        const songData = data.data.song
        const songList = handleSongList(songData.list)

        let singer
        const zhida = data.data.zhida
        if (zhida && zhida.type === 2) {
          singer = {
            id: zhida.singerid,
            mid: zhida.singermid,
            name: zhida.singername,
            pic: `https://y.gtimg.cn/music/photo_new/T001R800x800M000${zhida.singermid}.jpg?max_age=2592000`
          }
        }

        const { curnum, curpage, totalnum } = songData
        const hasMore = 20 * (curpage - 1) + curnum < totalnum

        res.json({
          code: CODE_OK,
          result: {
            songs: songList,
            singer,
            hasMore
          }
        })
      } else {
        res.json(data)
      }
    })
  })
}

module.exports = registerSearch
