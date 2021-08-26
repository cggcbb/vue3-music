import { watch, ref, computed } from 'vue'

export default function useShortCut({ props, currentIndex, colors, groupRef }) {
  const scrollRef = ref(null)
  const touch = {}
  const SHORT_CUT_HEIGHT = 18
  const centerLetter = ref(null)
  const showCenterLetter = ref(false)
  const shortcutList = ref([])

  const stopWatchShortcutList = watch(
    () => props.data,
    () => {
      shortcutList.value = props.data.map(item => {
        return item.title
      })
      stopWatchShortcutList()
    }
  )

  watch(currentIndex, () => {
    // * 设置shortcut的颜色
    document.body.style.setProperty('--shortcutColor', colors.value[currentIndex.value])
  })

  const centerLetterStyle = computed(() => {
    return {
      opacity: showCenterLetter.value ? 1 : 0
    }
  })

  // & touchstart
  const onShortcutTouchStart = e => {
    const anchorIndex = parseInt(e.target.dataset.index)
    touch.anchorIndex = anchorIndex
    touch.y1 = e.touches[0].pageY
    scrollTo(anchorIndex)
    showCenterLetter.value = true
  }

  // & touchmove
  const onShortcutTouchMove = e => {
    touch.y2 = e.touches[0].pageY
    const delta = ((touch.y2 - touch.y1) / SHORT_CUT_HEIGHT) | 0
    // * anchorIndex 最小值为0, 最大值为shortcutList.length - 1
    const anchorIndex = Math.min(
      Math.max(delta + touch.anchorIndex, 0),
      shortcutList.value.length - 1
    )
    scrollTo(anchorIndex)
  }

  // & touchend
  const onShortcutTouchEnd = e => {
    showCenterLetter.value = false
  }

  // & 滚动到指定element
  function scrollTo(index) {
    if (isNaN(index)) {
      return
    }
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const scroll = scrollRef.value.scroll
    const targetElement = groupRef.value.children[index]
    scroll.scrollToElement(targetElement, 0)
    // * 设置centerLetter的值
    centerLetter.value = shortcutList.value[index]
  }

  return {
    shortcutList,
    onShortcutTouchStart,
    onShortcutTouchMove,
    onShortcutTouchEnd,
    scrollRef,
    centerLetter,
    centerLetterStyle
  }
}
