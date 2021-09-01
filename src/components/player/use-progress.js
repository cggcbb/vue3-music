import { useStore } from 'vuex'
import { SET_PLAYING } from '@/store/mutation-types'

export default function useProgress({
  audioRef,
  currentSong,
  updateTime,
  progressChanging,
  playing
}) {
  const store = useStore()

  // & methods
  const handleProgressChanging = ({ progress, isProgressChanging }) => {
    updateTime.value = progress * currentSong.value.duration
    progressChanging.value = isProgressChanging
  }

  const handleProgressChanged = ({ progress, isProgressChanging }) => {
    audioRef.value.currentTime = updateTime.value = progress * currentSong.value.duration
    progressChanging.value = isProgressChanging
    if (!playing.value) {
      store.commit(SET_PLAYING, true)
    }
  }

  return {
    progressChanging,
    handleProgressChanging,
    handleProgressChanged
  }
}
