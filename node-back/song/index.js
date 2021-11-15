const { post } = require('../request')
const { getRandomVal, getUid } = require('../utils')
const getSecuritySign = require('../sign')
//* 响应成功code
const { CODE_OK } = require('../common')

//& 获取歌曲的真实播放地址
function registerSongsPureUrl(app) {
  app.post('/api/getSongsPureUrl', async (req, res) => {
    //* 先获取post请求参数mid数组, 再进行后操作
    const mid = req.body.mid

    let midGroup = []
    //* 这里第三方服务最多一次获取100条数据, 如果大于100条就发送多个请求
    if (mid.length > 100) {
      const groupLen = Math.ceil(mid.length / 100)
      for (let i = 0; i < groupLen; i++) {
        midGroup.push(mid.slice(i * 100, 100 * (i + 1)))
      }
    } else {
      midGroup = [mid]
    }

    //* 以歌曲的 mid 为 key，存储歌曲 pure URL
    const pureUrlMap = {}

    //* 构造多个 Promise 请求
    const requests = midGroup.map(mid => {
      return process(mid, pureUrlMap)
    })

    //* 并行发送多个请求
    return Promise.all(requests).then(() => {
      //* 所有请求响应完毕，pureUrlMap里面就构建好了, 以歌曲的 mid 为 key，存储歌曲 pure URL
      res.json({
        code: CODE_OK,
        result: {
          map: pureUrlMap
        }
      })
    })
  })
}

//& 处理返回的 mid
function process(mid, pureUrlMap) {
  const token = 5381
  const data = {
    req_0: {
      module: 'vkey.GetVkeyServer',
      method: 'CgiGetVkey',
      param: {
        guid: getUid(),
        songmid: mid,
        songtype: new Array(mid.length).fill(0),
        uin: '0',
        loginflag: 0,
        platform: '23',
        h5to: 'speed'
      }
    },
    comm: {
      g_tk: token,
      uin: '0',
      format: 'json',
      platform: 'h5'
    }
  }

  const sign = getSecuritySign(JSON.stringify(data))
  const url = `https://u.y.qq.com/cgi-bin/musics.fcg?_=${getRandomVal()}&sign=${sign}`

  //* 发送 post 请求
  return post(url, data).then(response => {
    const data = response.data
    if (data.code === CODE_OK) {
      const midInfo = data.req_0.data.midurlinfo
      //* 播放地址域名
      const sip = data.req_0.data.sip
      const domain = sip[sip.length - 1]

      midInfo.forEach(info => {
        //* 获取歌曲的真实播放 URL (域名 + purl 拼接)
        pureUrlMap[info.songmid] = `${domain}${info.purl.replace('http', 'https')}`
      })
    }
  })
}

module.exports = registerSongsPureUrl
