import * as types from './mutation-types'
import { PLAY_MODE_SEQUENCE, PLAY_MODE_RANDOM } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'

export const selectPlay = ({ commit, state }, { list, index }) => {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAY_LIST, list)
  commit(types.SET_MODE, PLAY_MODE_SEQUENCE)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
  commit(types.SET_CURRENT_INDEX, index)
}

export const randomPlay = ({ commit, state }, list) => {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAY_LIST, shuffle(list))
  commit(types.SET_MODE, PLAY_MODE_RANDOM)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
  commit(types.SET_CURRENT_INDEX, 0)
}
