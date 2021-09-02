import { useStore } from 'vuex'
import { ref, computed, watch } from 'vue'
// import { sleep } from '@/assets/js/util'

export default function useCd({ playingEnd, cdRef }) {
  // & ref
  const cdImageRef = ref(null)

  // & vuex
  const store = useStore()

  const playing = computed(() => store.getters.playing)

  // & computed
  const cdClass = computed(() => {
    return playing.value ? 'playing' : ''
  })

  const cdEndClass = computed(() => {
    return playingEnd.value ? 'cd-end' : ''
  })

  // & user watcher
  watch(playing, newPlaying => {
    if (!newPlaying) {
      syncCdWrapperTransform(cdRef.value, cdImageRef.value)
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
    cdImageRef,
    cdRef,
    cdClass,
    cdEndClass
  }
}
