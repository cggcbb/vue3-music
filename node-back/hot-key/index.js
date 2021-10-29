const { get } = require('../request')
//* 响应成功code
const { CODE_OK, token } = require('../common')

// & 获取热门搜索接口
function registerHotKeys(app) {
  app.get('/api/getHotKeys', (req, res) => {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

    get(url, {
      g_tk_new_20200303: token
    }).then(response => {
      const data = response.data
      if (data.code === CODE_OK) {
        res.json({
          code: CODE_OK,
          result: {
            hotKeys: data.data.hotkey
              .map(key => {
                return {
                  key: key.k,
                  id: key.n
                }
              })
              .slice(0, 10)
          }
        })
      } else {
        res.json(data)
      }
    })
  })
}

module.exports = registerHotKeys
