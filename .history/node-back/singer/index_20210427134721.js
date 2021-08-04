// 获取签名方法
const getSecuritySign = require('../sign')
// 请求相关函数
const { get } = require('../request')
// utils
const { getRandomVal } = require('../utils')

const pinyin = require('pinyin')

// 响应成功code
const CODE_OK = 0

const HOT_NAME = '热'
// 默认前10名为热门歌手
const HOT_NUM = 15

// 第三方服务接口 url
const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'

// 获取分页请求参数
function getSingerRequestParams(page) {
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
        sin: page === 1 ? 0 : (page - 1) * 80,
        cur_page: page
      }
    }
  })

  // 随机数值
  const randomVal = getRandomVal('getUCGI')
  // 计算签名值
  const sign = getSecuritySign(data)

  return {
    randomVal,
    data,
    sign
  }
}

// 分页获取歌手数据 ( 返回promise, 供Promise.all使用 )
function getSingerListPage(page) {
  return new Promise((resolve, reject) => {
    const { randomVal, data, sign } = getSingerRequestParams(page)

    get(url, {
      sign,
      '-': randomVal,
      data
    }).then(response => {
      const data = response.data
      if (data.code === CODE_OK) {
        resolve(data)
      } else {
        reject(data)
      }
    })
  })
}

// 注册歌手数据接口路由
function registerSinger(app) {
  app.get('/api/getSingerList', (req, res) => {
    Promise.all([getSingerListPage(1), getSingerListPage(2), getSingerListPage(3)])
      .then(result => {
        // 歌手列表
        let singers = []

        // 3页歌手数据汇总
        for (const item of result) {
          if (item.code === CODE_OK) {
            singers = singers.concat(item.singerList.data.singerlist)
          }
        }

        const singerMap = {
          // 热门歌手
          hot: {
            title: HOT_NAME,
            list: normalizeSingers(singers.slice(0, HOT_NUM))
          }
        }

        singers.forEach(item => {
          /**
           * 歌手名称转换成拼音
           * input: pinyin('周杰伦')
           * output: [ [ 'zhōu' ], [ 'jié' ], [ 'lún' ] ]
           *
           */
          const p = pinyin(item.singer_name)
          if (!p || !p.length) {
            return
          }
          // 获取歌手名称拼音首字母
          const key = p[0][0].slice(0, 1).toUpperCase()
          if (key) {
            if (!singerMap[key]) {
              singerMap[key] = {
                title: key,
                list: []
              }
            }
            singerMap[key].list.push(normalizeSingers(item))
          }
        })

        // 按首字母排序
        const hot = []
        const letter = []

        for (const key in singerMap) {
          const item = singerMap[key]
          if (item.title.match(/[a-zA-Z]/)) {
            letter.push(item)
          } else if (item.title === HOT_NAME) {
            hot.push(item)
          }
        }
        letter.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })

        res.json({
          code: CODE_OK,
          result: {
            singers: hot.concat(letter)
          }
        })
      })
      .catch(err => {
        res.json({
          code: '01',
          message: err
        })
      })
  })
}

// 格式化歌手列表
function normalizeSingers(singers) {
  if (Array.isArray(singers)) {
    return singers.map(item => {
      return createSinger(item)
    })
  }
  return createSinger(singers)
}

function createSinger(singer) {
  return new Singer(singer)
}
class Singer {
  constructor(singer) {
    this.id = singer.singer_id
    this.mid = singer.singer_mid
    this.name = singer.singer_name
    this.pic = singer.singer_pic
  }
}

module.exports = registerSinger
