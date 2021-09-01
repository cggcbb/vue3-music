import { useStore } from 'vuex'
import { ref, computed, watch } from 'vue'

export default function useCd({ playingEnd }) {
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

  const cdEndClass = computed(() => {
    return playingEnd.value ? 'cd-end' : ''
  })

  // & user watcher
  watch(playing, newPlaying => {
    if (!newPlaying && !playingEnd.value) {
      syncCdWrapperTransform(cdRef.value, cdImageRef.value)
    }
  })

  watch(playingEnd, async newPlayingEnd => {
    if (newPlayingEnd) {
      cdRef.value.style.transform = ''
    }
  })

  // & 同步cd旋转角度
  async function syncCdWrapperTransform(wrapper, inner) {
    wrapper.style.transition = ''

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
