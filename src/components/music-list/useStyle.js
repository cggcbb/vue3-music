import { onMounted, computed, ref } from 'vue'

// * title 高度
const TITLE_HEIGHT = 40

export default function useStyle(props, scrollY) {
  const bgImage = ref(null)
  const maxTranslateY = ref(0)
  const picHeight = ref(0)

  // & 获取头像背景图片高度 (用于设置 scroll-list 的top值)
  onMounted(() => {
    const bgImageHeight = bgImage.value.clientHeight
    picHeight.value = bgImageHeight
    maxTranslateY.value = bgImageHeight - TITLE_HEIGHT
  })

  // & 动态计算 bgImage style
  const bgImageStyle = computed(() => {
    const _scrollY = scrollY.value

    let zIndex = 0
    let paddingTop = '70%'
    let height = 0
    let translateZ = 0

    // * 当scroll滚动到离顶部 40px 的时候
    if (_scrollY > maxTranslateY.value) {
      zIndex = 10
      paddingTop = 0
      height = `${TITLE_HEIGHT}px`
      translateZ = 1
    }

    let scale = 1
    //* 下拉放大
    if (_scrollY < 0) {
      scale = 1 + Math.abs(_scrollY / picHeight.value)
    }

    return {
      zIndex,
      paddingTop,
      height,
      backgroundImage: `url(${props.pic})`,
      transform: `scale(${scale}) translateZ(${translateZ}px)`
    }
  })

  // & 动态计算 scroll style
  const scrollStyle = computed(() => {
    return {
      top: `${picHeight.value}px`
    }
  })

  // & 动态计算 filter 层 style
  const filterStyle = computed(() => {
    let blur = 0
    const _scrollY = scrollY.value
    const _picHeight = picHeight.value

    if (_scrollY > 0) {
      blur = Math.min(maxTranslateY.value / _picHeight, _scrollY / _picHeight) * 20
    }
    return {
      backdropFilter: `blur(${blur}px)`
    }
  })

  // & 动态计算 playBtn 按钮 style
  const playBtnStyle = computed(() => {
    return {
      display: scrollY.value >= maxTranslateY.value ? 'none' : ''
    }
  })

  return {
    bgImageStyle,
    scrollStyle,
    filterStyle,
    playBtnStyle,
    bgImage
  }
}
