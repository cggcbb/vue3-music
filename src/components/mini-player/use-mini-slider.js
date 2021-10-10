import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
  onActivated,
  onDeactivated
} from 'vue'
import { useStore } from 'vuex'
import { SET_CURRENT_INDEX } from '@/store/mutation-types'

import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

BScroll.use(Slide)

export default function useMiniSlider() {
  const miniSliderWrapperRef = ref(null)
  const slider = ref(null)

  const store = useStore()
  const fullScreen = computed(() => store.getters.fullScreen)
  const playList = computed(() => store.getters.playList)
  const currentIndex = computed(() => store.getters.currentIndex)

  const sliderShow = computed(() => {
    return !fullScreen.value && !!playList.value.length
  })

  onMounted(() => {
    let sliderVal
    watch(sliderShow, newSliderShow => {
      if (newSliderShow) {
        nextTick(() => {
          if (!sliderVal) {
            sliderVal = slider.value = new BScroll(miniSliderWrapperRef.value, {
              click: true,
              scrollX: true,
              scrollY: false,
              momentum: false,
              bounce: false,
              probeType: 2,
              slide: {
                autoplay: false,
                loop: true
              }
            })
            // * mini slider 歌曲切换完之后
            sliderVal.on('slidePageChanged', ({ pageX }) => {
              store.commit(SET_CURRENT_INDEX, pageX)
            })
          } else {
            sliderVal.refresh()
          }
          sliderVal.goToPage(currentIndex.value, 0, 0)
        })
      }
    })

    watch(currentIndex, newIndex => {
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newIndex, 0, 0)
      }
    })

    watch(playList, newList => {
      if (sliderVal && sliderShow.value && newList.length) {
        nextTick(() => {
          sliderVal.refresh()
        })
      }
    })

    watch(playList, async newList => {
      if (sliderVal && sliderShow.value && newList.length) {
        await nextTick()
        sliderVal.refresh()
      }
    })
  })

  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy()
    }
  })

  onActivated(() => {
    slider.value.enable()
    slider.value.refresh()
  })

  onDeactivated(() => {
    slider.value.disable()
  })

  return {
    slider,
    miniSliderWrapperRef
  }
}
