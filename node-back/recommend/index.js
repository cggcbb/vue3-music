//* 获取签名方法
const getSecuritySign = require('../sign')
const { get } = require('../request')
const { getRandomVal } = require('../utils')

//* 响应成功code
const { CODE_OK } = require('../common')

//& 注册推荐列表接口路由
function registerRecommend(app) {
  app.get('/api/getRecommend', (req, res) => {
    //* 第三方服务接口 url
    const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'

    //* 构造请求 data 参数
    const data = JSON.stringify({
      comm: { ct: 24 },
      recomPlaylist: {
        method: 'get_hot_recommend',
        param: { async: 1, cmd: 2 },
        module: 'playlist.HotRecommendServer'
      },
      focus: {
        module: 'music.musicHall.MusicHallPlatform',
        method: 'GetFocus',
        param: {}
      }
    })

    //* 随机数值
    const randomVal = getRandomVal('recom')
    //* 计算签名值
    const sign = getSecuritySign(data)

    //* 发送 get 请求
    get(url, {
      sign,
      '-': randomVal,
      data
    }).then(response => {
      const data = response.data
      if (data.code === CODE_OK) {
        //* 处理轮播图数据
        const focusList = data.focus.data.shelf.v_niche[0].v_card
        const sliders = []
        const jumpPrefixMap = {
          10002: 'https://y.qq.com/n/yqq/album/',
          10014: 'https://y.qq.com/n/yqq/playlist/',
          10012: 'https://y.qq.com/n/yqq/mv/v/'
        }
        //* 最多获取 10 条数据
        const len = Math.min(focusList.length, 10)

        for (let i = 0; i < len; i++) {
          const item = focusList[i]
          const sliderItem = {}
          //* 单个轮播图数据包括 id、pic、link 等字段
          sliderItem.id = item.id
          sliderItem.pic = item.cover
          if (jumpPrefixMap[item.jumptype]) {
            sliderItem.link = jumpPrefixMap[item.jumptype] + (item.subid || item.id) + '.html'
          } else if (item.jumptype === 3001) {
            sliderItem.link = item.id
          }

          sliders.push(sliderItem)
        }

        //* 处理推荐歌单数据
        const albumList = data.recomPlaylist.data.v_hot
        const albums = []
        for (let i = 0; i < albumList.length; i++) {
          const item = albumList[i]

          //* 推荐歌单数据包括 id、username、title、pic 等字段
          const albumItem = createAlbum(item)
          albums.push(albumItem)
        }

        //* 往前端发送一个标准格式的响应数据，包括成功错误码和数据
        res.json({
          code: CODE_OK,
          result: {
            sliders,
            albums
          }
        })
      } else {
        res.json(data)
      }
    })
  })
}

function createAlbum(albumItem) {
  return new Album(albumItem.content_id, albumItem.username, albumItem.title, albumItem.cover)
}

class Album {
  constructor(id, username, title, pic) {
    this.id = id
    this.username = username
    this.title = title
    this.pic = pic
  }
}

module.exports = registerRecommend
