import { ref } from 'vue'
import createKeyframeAnimation from 'create-keyframe-animation'

export default function useAnimation() {
  const cdWrapperRef = ref(null)
  const miniImageBounce = ref(false)

  let entering = false
  let leaving = false

  const enter = (el, done) => {
    if (leaving) {
      afterLeave()
    }
    entering = true

    const { x, y, scale } = getPosAndScale()

    const animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      60: {
        transform: 'translate3d(0, 0, 0) scale(1.2)'
      },
      100: {
        transform: 'translate3d(0, 0, 0) scale(1)'
      }
    }

    createKeyframeAnimation.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 400,
        easing: 'ease-in'
      }
    })

    createKeyframeAnimation.runAnimation(cdWrapperRef.value, 'move', done)
  }

  const afterEnter = () => {
    entering = false
    createKeyframeAnimation.unregisterAnimation('move')
    cdWrapperRef.value.style.animation = ''
  }

  const leave = (el, done) => {
    if (entering) {
      afterEnter()
    }
    leaving = true

    miniImageBounce.value = true
    const cdWrapperEl = cdWrapperRef.value
    cdWrapperEl.style.transition = '.4s'
    const { x, y, scale } = getPosAndScale()
    cdWrapperEl.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
    cdWrapperEl.addEventListener('transitionend', next)

    // * 解绑eventListener
    function next() {
      cdWrapperEl.removeEventListener('transitionend', next)
      done()
    }
  }

  const afterLeave = () => {
    leaving = false

    const cdWrapperEl = cdWrapperRef.value
    cdWrapperEl.style.transition = ''
    cdWrapperEl.style.transform = ''

    // * 延迟2000ms, 让miniCdWrapper层 弹跳动画结束
    setTimeout(() => {
      miniImageBounce.value = false
    }, 2000)
  }

  function getPosAndScale() {
    const targetWidth = 40 // ! target width
    const paddingLeft = 40 // ! The distance from the small picture center to the left
    const paddingBottom = 30 // ! The distance from the big picture center to the bottom
    const paddingTop = 80 // ! The distance from the big picture to the top
    const width = window.innerWidth * 0.8 // ! big picture width
    const scale = targetWidth / width // ! initial scale
    const x = -(window.innerWidth / 2 - paddingLeft) // ! x-axis relative distance
    const y = window.innerHeight - paddingBottom - width / 2 - paddingTop // ! y-axis relative distance

    return {
      x,
      y,
      scale
    }
  }

  return {
    cdWrapperRef,
    miniImageBounce,
    enter,
    afterEnter,
    leave,
    afterLeave
  }
}
