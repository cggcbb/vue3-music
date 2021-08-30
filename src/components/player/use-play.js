import { useStore } from 'vuex'
import { SET_PLAYING, SET_CURRENT_INDEX } from '@/store/mutation-types'
import { ref, watch, computed } from 'vue'

export default function usePlay(songReady) {
  // & ref
  const audioRef = ref(null)

  // & vuex
  const store = useStore()

  const playList = computed(() => store.getters.playList)
  const currentIndex = computed(() => store.getters.currentIndex)
  const currentSong = computed(() => store.getters.currentSong)
  const playing = computed(() => store.getters.playing)

  // & methods
  const togglePlay = () => {
    if (!songReady.value) {
      return
    }
    store.commit(SET_PLAYING, !playing.value)
  }

  const handlePrev = () => {
    if (playList.value.length === 1) {
      loop()
    } else {
      changeCurrentSong(false)
    }
  }

  const handleNext = () => {
    if (playList.value.length === 1) {
      loop()
    } else {
      changeCurrentSong(true)
    }
  }

  // ! 修改当前播放歌曲 (上一曲和下一曲的逻辑)
  const changeCurrentSong = isNext => {
    const list = playList.value
    if (!songReady.value || !list.length) {
      return
    }
    let index = null
    if (isNext) {
      // * 已经是最后一曲, 则跳到第一曲
      index = (currentIndex.value + 1) % list.length
    } else {
      // * 已经是第一曲, 则跳到最后一曲
      index = currentIndex.value - 1
      index = index < 0 ? list.length - 1 : index
    }
    store.commit(SET_CURRENT_INDEX, index)
    if (!playing.value) {
      store.commit(SET_PLAYING, true)
    }
  }

  // ! 循环播放, 直接设置 audio 标签的 currentTime = 0
  const loop = () => {
    const audioElement = audioRef.value
    audioElement.currentTime = 0
    audioElement.play()
  }

  // & user watch
  watch(currentSong, newSong => {
    if (!newSong.id || !newSong.url) {
      return
    }
    songReady.value = false
    const audioElement = audioRef.value
    audioElement.src = newSong.url
    audioElement.play()
  })

  watch(playing, newPlaying => {
    if (!songReady.value) {
      return
    }
    const audioElement = audioRef.value
    newPlaying ? audioElement.play() : audioElement.pause()
  })

  return {
    audioRef,
    currentSong,
    togglePlay,
    handlePrev,
    handleNext
  }
}
