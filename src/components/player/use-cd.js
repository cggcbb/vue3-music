import { useStore } from 'vuex'
import { ref, computed, watch } from 'vue'

export default function useCd() {
  // & ref
  const cdImageRef = ref(null)
  const cdRef = ref(null)

  // & vuex
  const store = useStore()

  const playing = computed(() => store.getters.playing)

  // & computed
  const cdClass = computed(() => {
    return playing.value ? 'playing' : ''
  })

  // & user watcher
  watch(playing, newPlaying => {
    if (!newPlaying.value) {
      syncCdWrapperTransform(cdRef.value, cdImageRef.value)
    }
  })

  // & 同步cd旋转角度
  function syncCdWrapperTransform(wrapper, inner) {
    const innerCdTransform = getComputedStyle(inner).transform
    const outerCdTransform = getComputedStyle(wrapper).transform
    wrapper.style.transform =
      outerCdTransform === 'none'
        ? innerCdTransform
        : outerCdTransform.concat(' ', innerCdTransform)
  }

  return {
    cdImageRef,
    cdRef,
    cdClass
  }
}
