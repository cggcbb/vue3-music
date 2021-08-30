import { watch, ref, computed, nextTick } from 'vue'

const SHORTCUT_PADDING = 20

export default function useShortCut({ props, currentIndex, colors, groupRef }) {
  const scrollRef = ref(null)
  const touch = {}
  const SHORT_CUT_HEIGHT = 18
  const centerLetter = ref(null)
  const showCenterLetter = ref(false)
  const shortcutList = ref([])
  const shortcutRef = ref(null)
  let shortcutTop = 0
  let shortcutBottom = 0

  const stopWatchShortcutList = watch(
    () => props.data,
    () => {
      shortcutList.value = props.data.map(item => {
        return item.title
      })
      stopWatchShortcutList()

      /* nextTick 才能获取到数据渲染后shortcut的真实位置信息
       * +- 20 是css设置了 padding: 20px
       * 为了解决 shortcut 上下边界的问题
       */
      nextTick(() => {
        const shortcutRefRect = shortcutRef.value.getBoundingClientRect()
        shortcutTop = shortcutRefRect.top + SHORTCUT_PADDING
        shortcutBottom = shortcutRefRect.bottom - SHORTCUT_PADDING
      })
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

  /* eslint-disable */
  // & touchstart (52-53行) 格式化有点问题, 暂且关闭eslint检测
  const onShortcutTouchStart = e => {
    const pageY = e.touches[0].pageY
    let index = e.target.dataset.index
    index =
      index === undefined
        ? pageY < shortcutTop
          ? 0
          : pageY > shortcutBottom
          ? shortcutList.value.length - 1
          : null
        : index
    touch.y1 = pageY
    const anchorIndex = parseInt(index)
    touch.anchorIndex = anchorIndex
    scrollTo(anchorIndex)
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
    // * 开启大字母显示
    showCenterLetter.value = true
  }

  // & touchend, 关闭大字母显示
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
    centerLetterStyle,
    shortcutRef
  }
}
