import { ref, watch, nextTick, computed } from 'vue'
import getRandomColorsList from './colors'

export default function useFixedTitle(props) {
  const FIXED_TITLE_HEIGHT = 30
  const groupRef = ref(null)
  const heightLists = ref([])
  const scrollY = ref(0)
  const currentIndex = ref(0)
  const distance = ref(0)
  const colors = ref(['#ffcd32'])

  const stop = watch(
    () => props.data,
    () => {
      nextTick(() => {
        calculateHeightsList()
        colors.value = colors.value.concat(getRandomColorsList(props.data.length))
        stop()
      })
    }
  )

  watch(scrollY, newVal => {
    const heightsListVal = heightLists.value
    for (let i = 0; i < heightsListVal.length - 1; i++) {
      const heightTop = heightsListVal[i]
      const heightBottom = heightsListVal[i + 1]
      if (heightTop <= newVal && heightBottom >= newVal) {
        currentIndex.value = i
        distance.value = heightBottom - newVal
      }
    }
  })

  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return ''
    }
    const currentGroup = props.data[currentIndex.value]
    return currentGroup?.title ?? ''
  })

  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    const diff =
      distanceVal > 0 && distanceVal <= FIXED_TITLE_HEIGHT ? distanceVal - FIXED_TITLE_HEIGHT : 0
    return {
      transform: `translate3d(0, ${diff}px, 0)`,
      color: colors.value[currentIndex.value]
    }
  })

  const titleStyle = index => {
    return colors.value[index]
  }

  // &计算每个区间的height
  function calculateHeightsList() {
    const list = groupRef.value.children
    const heightsListVal = heightLists.value
    let height = 0

    heightsListVal.length = 0
    heightsListVal.push(height)

    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      heightsListVal.push(height)
    }
  }

  function onScroll(pos) {
    scrollY.value = -pos.y
  }

  return {
    groupRef,
    fixedTitle,
    fixedStyle,
    onScroll,
    titleStyle,
    currentIndex,
    colors
  }
}
