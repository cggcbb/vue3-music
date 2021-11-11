import * as types from './mutation-types'
import { PLAY_MODE_RANDOM } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'

// & 选取一首歌播放
export const selectPlay = ({ commit, state }, { list, song, index }) => {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === PLAY_MODE_RANDOM) {
    // * 随机播放模式需打乱播放列表, 并且需要获取 <当前播放歌曲在随机播放列表里面的索引>
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

export const randomPlay = ({ commit }, list) => {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAY_LIST, shuffle(list))
  commit(types.SET_MODE, PLAY_MODE_RANDOM)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
  commit(types.SET_CURRENT_INDEX, 0)
}

// & 随机播放
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

// & 删除一首歌
export const removeSong = ({ commit, state }, song) => {
  // * 先获取副本, 否则直接修改原数据, vuex会报警告 (不是通过commit mutation)
  const sequenceList = state.sequenceList.slice()
  const playList = state.playList.slice()

  const sequenceIndex = findIndex(sequenceList, song)
  const playIndex = findIndex(playList, song)
  if (sequenceIndex < 0 || playIndex < 0) {
    return
  }
  // * 两个歌曲列表删除对应歌曲
  sequenceList.splice(sequenceIndex, 1)
  playList.splice(playIndex, 1)

  let currentIndex = state.currentIndex
  // * 当删除的歌曲在当前歌曲之前, currentIndex-- , 否则会自动切歌, 因为playList变了
  // * currentSong获取方式:  currentSong = state => state.playList[state.currentIndex]
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

// & 清空播放列表
export const clearSongList = ({ commit }) => {
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAY_LIST, [])
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAYING, false)
}

// & 添加一首歌曲
export const addSong = ({ commit, state }, song) => {
  const playList = state.playList.slice()
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  const playIndex = findIndex(playList, song)

  if (playIndex > -1) {
    currentIndex = playIndex
  } else {
    playList.push(song)
    currentIndex = playList.length - 1
  }

  const sequenceIndex = findIndex(sequenceList, song)
  if (sequenceIndex === -1) {
    sequenceList.push(song)
  }

  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_PLAYING, true)
  commit(types.SET_FULL_SCREEN, true)
}

function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}
