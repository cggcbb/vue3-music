import { computed, watch, ref } from 'vue'

export default function useShortCut({ props, currentIndex, colors, groupRef }) {
  const scrollRef = ref(null)
  const touch = {}
  const SHORT_CUT_HEIGHT = 18

  const shortcutList = computed(() => {
    return props.data.map(item => {
      return item.title
    })
  })

  watch(currentIndex, () => {
    //* 设置shortcut的颜色
    document.body.style.setProperty('--shortcutColor', colors.value[currentIndex.value])
  })

  //& touchstart
  const onShortcutTouchStart = e => {
    const anchorIndex = parseInt(e.target.dataset.index)
    touch.anchorIndex = anchorIndex
    touch.y1 = e.touches[0].pageY
    scrollTo(anchorIndex)
  }

  //& touchmove
  const onShortcutTouchMove = e => {
    touch.y2 = e.touches[0].pageY
    const delta = ((touch.y2 - touch.y1) / SHORT_CUT_HEIGHT) | 0
    const anchorIndex = delta + touch.anchorIndex
    scrollTo(anchorIndex)
  }

  //& 滚动到指定element
  function scrollTo(index) {
    if (isNaN(index)) {
      return
    }
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const scroll = scrollRef.value.scroll
    const targetElement = groupRef.value.children[index]
    scroll.scrollToElement(targetElement, 0)
  }

  return {
    shortcutList,
    onShortcutTouchStart,
    onShortcutTouchMove,
    scrollRef
  }
}
