import { useStore } from 'vuex'
import { PLAY_MODE_SEQUENCE, PLAY_MODE_RANDOM, MODE_KEY } from '@/assets/js/constant'
import { computed } from 'vue'
import storage from 'good-storage'

export default function useMode() {
  const store = useStore()
  const playMode = computed(() => store.getters.mode)

  /*  eslint-disable */
  const playModeIcon = computed(() => {
    const mode = playMode.value
    return mode === PLAY_MODE_SEQUENCE
      ? 'icon-sequence'
      : mode === PLAY_MODE_RANDOM
      ? 'icon-random'
      : 'icon-loop'
  })

  const changePlayMode = () => {
    const mode = (playMode.value + 1) % 3
    store.dispatch('changePlayMode', mode)
    storage.set(MODE_KEY, mode)
  }

  return {
    playModeIcon,
    changePlayMode
  }
}
