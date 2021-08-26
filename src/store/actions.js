import * as types from './mutation-types'
import { PLAY_MODE_SEQUENCE } from '@/assets/js/constant'

export const selectPlay = ({ commit, state }, { list, index }) => {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAY_LIST, list)
  commit(types.SET_MODE, PLAY_MODE_SEQUENCE)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
  commit(types.SET_CURRENT_INDEX, index)
}
