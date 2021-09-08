import { useStore } from 'vuex'
import { SET_PLAYING } from '@/store/mutation-types'

export default function useProgress({
  audioRef,
  currentSong,
  updateTime,
  progressChanging,
  playing,
  playLyric,
  stopLyric
}) {
  const store = useStore()

  // & methods
  const handleProgressChanging = ({ progress, isProgressChanging }) => {
    updateTime.value = progress * currentSong.value.duration
    progressChanging.value = isProgressChanging
    // * playLyric 先让歌词滚动到拖动的位置, stopLyric 再暂停歌词播放
    playLyric()
    stopLyric()
  }

  const handleProgressChanged = ({ progress, isProgressChanging }) => {
    audioRef.value.currentTime = updateTime.value = progress * currentSong.value.duration
    progressChanging.value = isProgressChanging
    if (!playing.value) {
      store.commit(SET_PLAYING, true)
    }
    playLyric()
  }

  return {
    progressChanging,
    handleProgressChanging,
    handleProgressChanged
  }
}
