const registerRecommend = require('./recommend')
const registerSinger = require('./singer')
const registerSingerDetail = require('./singer-detail')
const registerSongsPureUrl = require('./song')
const registerLyric = require('./lyric')
const registerAlbum = require('./album')
const registerRankList = require('./rank')
const registerRankDetail = require('./rank-detail')
const registerHotKeys = require('./hot-key')
const registerSearch = require('./search')

//& 注册后端路由
function registerRouter(app) {
  registerRecommend(app)

  registerSinger(app)

  registerSingerDetail(app)

  registerSongsPureUrl(app)

  registerLyric(app)

  registerAlbum(app)

  registerRankList(app)

  registerRankDetail(app)

  registerHotKeys(app)

  registerSearch(app)
}

module.exports = registerRouter
