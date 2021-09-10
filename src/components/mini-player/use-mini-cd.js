import { useStore } from 'vuex'
import { ref, computed, watch } from 'vue'

export default function useMiniCd() {
  // & ref
  const miniCdImageRef = ref(null)
  const miniCdRef = ref(null)

  // & vuex
  const store = useStore()

  const playing = computed(() => store.getters.playing)

  // & computed
  const miniCdClass = computed(() => {
    return playing.value ? 'playing' : ''
  })

  // & user watcher
  watch(playing, newPlaying => {
    if (!newPlaying) {
      syncCdWrapperTransform(miniCdRef.value, miniCdImageRef.value)
    }
  })

  // & 同步cd旋转角度
  function syncCdWrapperTransform(wrapper, inner) {
    wrapper.style.transition = 'none'
    const innerCdTransform = getComputedStyle(inner).transform
    const outerCdTransform = getComputedStyle(wrapper).transform

    wrapper.style.transform =
      outerCdTransform === 'none'
        ? innerCdTransform
        : outerCdTransform.concat(' ', innerCdTransform)
  }

  return {
    miniCdImageRef,
    miniCdRef,
    miniCdClass
  }
}
