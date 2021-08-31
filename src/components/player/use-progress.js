export default function useProgress({ audioRef, currentSong, updateTime, progressChanging }) {
  // & methods
  const handleProgressChanging = ({ progress, isProgressChanging }) => {
    updateTime.value = progress * currentSong.value.duration
    progressChanging.value = isProgressChanging
  }

  const handleProgressChanged = ({ progress, isProgressChanging }) => {
    audioRef.value.currentTime = updateTime.value = progress * currentSong.value.duration
    progressChanging.value = isProgressChanging
  }

  return {
    progressChanging,
    handleProgressChanging,
    handleProgressChanged
  }
}
