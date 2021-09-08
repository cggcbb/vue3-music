import { ref } from 'vue'
import { useStore } from 'vuex'
import { SET_PLAYING } from '@/store/mutation-types'

export default function useAudio() {
  const songReady = ref(null)
  const updateTime = ref(0)
  const manualPause = ref(false)
  const progressChanging = ref(false)

  const store = useStore()

  // & 如果 audio 触发了 pause 事件 (eg: 笔记本屏幕合上等等..., 非手动触发), 将 playing 设置成 false
  const handleAudioPause = () => {
    if (!manualPause.value) {
      store.commit(SET_PLAYING, false)
    }
  }

  // & 歌曲加载错误的时候, songReady 设置为 true, 防止不能点击上一曲, 下一曲
  const handleAudioError = () => {
    songReady.value = true
  }

  // & 播放器触发 timeupdate 事件, 非拖动进度条的情况下, 更新 currentTime
  const handleAudioTimeUpdate = e => {
    if (!progressChanging.value) {
      updateTime.value = e.target.currentTime
    }
  }

  return {
    // * ref
    songReady,
    updateTime,
    manualPause,
    progressChanging,
    // * methods
    handleAudioPause,
    handleAudioError,
    handleAudioTimeUpdate
  }
}
