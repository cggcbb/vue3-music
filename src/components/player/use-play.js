import { useStore } from 'vuex'
import { SET_PLAYING, SET_CURRENT_INDEX } from '@/store/mutation-types'
import { ref, watch, computed } from 'vue'
import { formatTime, sleep } from '@/assets/js/util'
import { PLAY_MODE_LOOP } from '@/assets/js/constant'

export default function usePlay({ songReady, updateTime, manualPause }) {
  // & ref
  const audioRef = ref(null)
  const playingEnd = ref(false)

  // & vuex
  const store = useStore()

  const playList = computed(() => store.getters.playList)
  const currentIndex = computed(() => store.getters.currentIndex)
  const currentSong = computed(() => store.getters.currentSong)
  const playing = computed(() => store.getters.playing)
  const playMode = computed(() => store.getters.mode)

  // & computed
  const currentTime = computed(() => formatTime(updateTime.value))
  const duration = computed(() => formatTime(currentSong.value.duration))
  const progress = computed(() => updateTime.value / currentSong.value.duration)

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

  // ! 歌曲自动播放完毕
  const handleAudioEnded = async () => {
    playingEnd.value = true
    store.commit(SET_PLAYING, false)
    await sleep(1000)
    playingEnd.value = false
    updateTime.value = 0
    if (playMode.value === PLAY_MODE_LOOP) {
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
    if (!playing.value) {
      store.commit(SET_PLAYING, true)
    }
  }

  // & user watch
  watch(currentSong, newSong => {
    if (!newSong.id || !newSong.url) {
      return
    }
    updateTime.value = 0
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
    // * 设置是否手动触发了pause函数, 为了use-audio.js监听 audio 触发 pause 事件的时候, 是否需要再次 commit playing
    // * 不设置是否手动, 会重复 commit playing
    if (newPlaying) {
      audioElement.play()
      manualPause.value = false
    } else {
      audioElement.pause()
      manualPause.value = true
    }
  })

  return {
    audioRef,
    playingEnd,
    // * vuex
    currentSong,
    // * computed
    currentTime,
    duration,
    progress,
    // * methods
    togglePlay,
    handlePrev,
    handleNext,
    handleAudioEnded
  }
}
