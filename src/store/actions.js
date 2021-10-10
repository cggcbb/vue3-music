import * as types from './mutation-types'
import { PLAY_MODE_RANDOM } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'

export const selectPlay = ({ commit, state }, { list, song, index }) => {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === PLAY_MODE_RANDOM) {
    commit(types.SET_PLAY_LIST, shuffle(list))
    index = state.playList.findIndex(item => item.id === song.id)
  } else {
    commit(types.SET_PLAY_LIST, list)
  }
  commit(types.SET_MODE, state.mode)
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

export const changePlayMode = ({ commit, state, getters }, mode) => {
  const currentSongId = getters.currentSong.id
  if (mode === PLAY_MODE_RANDOM) {
    commit(types.SET_PLAY_LIST, shuffle(state.sequenceList))
  } else {
    commit(types.SET_PLAY_LIST, state.sequenceList)
  }
  const index = state.playList.findIndex(song => song.id === currentSongId)

  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_MODE, mode)
}

export const removeSong = ({ commit, state }, song) => {
  const sequenceList = state.sequenceList.slice()
  const playList = state.playList.slice()

  const sequenceIndex = findIndex(sequenceList, song)
  const playIndex = findIndex(playList, song)
  if (sequenceIndex < 0 || playIndex < 0) {
    return
  }

  sequenceList.splice(sequenceIndex, 1)
  playList.splice(playIndex, 1)

  let currentIndex = state.currentIndex
  if (playIndex < currentIndex || currentIndex === playList.length) {
    currentIndex--
  }

  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  if (!playList.length) {
    commit(types.SET_PLAYING, false)
  }
}

function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}
