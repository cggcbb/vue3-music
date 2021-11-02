export const sequenceList = state => state.sequenceList

export const playList = state => state.playList

export const mode = state => state.mode

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const currentIndex = state => state.currentIndex

export const currentSong = state => state.playList[state.currentIndex] || {}

export const favoriteList = state => state.favoriteList

export const searchHistory = state => state.searchHistory
