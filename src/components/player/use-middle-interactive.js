import { ref } from 'vue'
export default function useMiddleInteractive() {
  const currentShow = ref('cd')
  const middleCdStyle = ref(null)
  const middleLyricStyle = ref(null)
  const touch = {}
  let currentView = 'cd'

  const onMiddleTouchStart = e => {
    touch.startX = e.touches[0].pageX
    touch.startY = e.touches[0].pageY
    touch.directionLocked = ''
  }
  const onMiddleTouchMove = e => {
    const deltaX = e.touches[0].pageX - touch.startX
    const deltaY = e.touches[0].pageY - touch.startY

    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)
    // * 方向锁, 如果是纵向滚动, 后面的逻辑就可以忽略了
    if (!touch.directionLocked) {
      touch.directionLocked = absDeltaX >= absDeltaY ? 'h' : 'v'
    }
    if (touch.directionLocked === 'v') {
      return
    }

    const fullWidth = window.innerWidth
    const left = currentView === 'cd' ? 0 : -fullWidth
    const offsetWidth = Math.min(0, Math.max(-fullWidth, left + deltaX))
    touch.percent = Math.abs(offsetWidth / fullWidth)

    if (currentView === 'cd') {
      if (touch.percent > 0.2) {
        currentShow.value = 'lyric'
      } else {
        currentShow.value = 'cd'
      }
    } else {
      if (touch.percent < 0.8) {
        currentShow.value = 'cd'
      } else {
        currentShow.value = 'lyric'
      }
    }

    middleCdStyle.value = {
      opacity: 1 - touch.percent
    }
    middleLyricStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`
    }
  }

  const onMiddleTouchEnd = e => {
    setMiddleCdAndLyricStyle()
  }

  // & 点击小圆点dot, 切换 cd 和 lyric 显示
  const toggleCurrentView = index => {
    if ((currentView === 'cd' && index === 0) || (currentView === 'lyric' && index === 1)) {
      return
    }
    if (currentView === 'cd') {
      currentShow.value = 'lyric'
    } else {
      currentShow.value = 'cd'
    }
    setMiddleCdAndLyricStyle()
  }

  // & 这里代码提出来, 方便 touchend 和 toggleCurrentView 公用
  const setMiddleCdAndLyricStyle = () => {
    let offsetWidth
    let opacity
    if (currentShow.value === 'cd') {
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric'
      offsetWidth = -window.innerWidth
      opacity = 0
    }

    const duration = 300
    middleCdStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`
    }

    middleLyricStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: `${duration}ms`
    }
  }

  return {
    currentShow,
    middleCdStyle,
    middleLyricStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd,
    toggleCurrentView
  }
}
