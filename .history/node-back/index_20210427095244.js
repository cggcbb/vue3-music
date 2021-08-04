const registerRecommend = require('./recommend')
const registerSinger = require('./singer')

// 注册后端路由
function registerRouter(app) {
  registerRecommend(app)

  registerSinger(app)
}

module.exports = registerRouter
