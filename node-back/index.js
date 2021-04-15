const registerRecommend = require('./recommend')

// 注册后端路由
function registerRouter(app) {
  registerRecommend(app)
}

module.exports = registerRouter
