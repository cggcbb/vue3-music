import { PLAY_MODE_SEQUENCE, FAVORITE_KEY } from '@/assets/js/constant'
import { loadStorage } from '@/assets/js/array-storage'

const state = {
  sequenceList: [], // * 顺序播放列表
  playList: [], // * 真实播放列表 (有顺序,单曲,随机播放)
  mode: PLAY_MODE_SEQUENCE, // * 播放模式(默认顺序播放)
  playing: false, // * 播放状态(默认关闭)
  fullScreen: false, // * 全屏(默认不全屏)
  currentIndex: -1, // * 当前播放歌曲index
  favoriteList: loadStorage(FAVORITE_KEY) // * 收藏歌曲列表, 本地storage加载
}

export default state
