import { PLAY_MODE_SEQUENCE } from '@/assets/js/constant'

const state = {
  sequenceList: [], // * 顺序播放列表
  playList: [], // * 真实播放列表 (有顺序,单曲,随机播放)
  mode: PLAY_MODE_SEQUENCE, // * 播放模式(默认顺序播放)
  playing: false, // * 播放状态(默认关闭)
  fullScreen: false, // * 全屏(默认不全屏)
  currentIndex: -1 // * 当前播放歌曲index
}

export default state
