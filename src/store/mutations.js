import * as types from './mutation-types'

const mutations = {
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_LIST](state, list) {
    state.playList = list
  },
  [types.SET_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_PLAYING](state, isPlaying) {
    state.playing = isPlaying
  },
  [types.SET_FULL_SCREEN](state, isFullScreen) {
    state.fullScreen = isFullScreen
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  }
}

export default mutations