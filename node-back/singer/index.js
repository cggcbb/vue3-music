// 获取签名方法
const getSecuritySign = require('../sign')
// 请求相关函数
const { get } = require('../request')
// utils
const { getRandomVal } = require('../utils')

// 响应成功code
const CODE_OK = 0

// 注册歌手数据接口路由
function registerSinger(app) {
  app.get('/api/getSinger', (req, res) => {
    // 第三方服务接口 url
    const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'

    // 构造请求 data 参数
    const data = JSON.stringify({
      comm: { ct: 24, cv: 0 },
      singerList: {
        module: 'Music.SingerListServer',
        method: 'get_singer_list',
        param: {
          area: -100,
          sex: -100,
          genre: -100,
          index: -100,
          sin: 0,
          cur_page: 1
        }
      }
    })

    // 随机数值
    const randomVal = getRandomVal('getUCGI')
    // 计算签名值
    const sign = getSecuritySign(data)

    // 发送 get 请求
    get(url, {
      sign,
      '-': randomVal,
      data
    }).then(response => {
      const data = response.data
      console.log(data)
      if (data.code === CODE_OK) {
        // 往前端发送一个标准格式的响应数据，包括成功错误码和数据
        const singers = data.singerList.data.singerlist

        res.json({
          code: CODE_OK,
          result: {
            singers
          }
        })
      } else {
        res.json(data)
      }
    })
  })
}

module.exports = registerSinger
