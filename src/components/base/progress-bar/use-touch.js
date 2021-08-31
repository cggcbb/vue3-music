import { ref, reactive } from 'vue'

export default function useTouch({ emit }, { barWidth, offset, progressBarRef }) {
  const progressRef = ref(null)
  const touch = reactive({})
  let isProgressChanging = false

  const onProgressBtnTouchStart = e => {
    touch.x1 = e.touches[0].pageX
    touch.beginWidth = progressRef.value.clientWidth
  }

  const onProgressBtnTouchMove = e => {
    const barWidthVal = barWidth.value
    const deltaX = e.touches[0].pageX - touch.x1
    const deltaWidth = touch.beginWidth + deltaX
    const progress = Math.min(1, Math.max(0, deltaWidth / barWidthVal))
    offset.value = barWidthVal * progress

    isProgressChanging = true
    emit('progress-changing', { progress, isProgressChanging })
  }

  const onProgressBtnTouchEnd = e => {
    const progress = progressRef.value.clientWidth / barWidth.value

    isProgressChanging = false
    emit('progress-changed', { progress, isProgressChanging })
  }

  const handleProgressClick = e => {
    const offsetX = e.pageX - progressBarRef.value.getBoundingClientRect().left
    const progress = Math.min(1, Math.max(0, offsetX / barWidth.value))

    isProgressChanging = false
    emit('progress-changed', { progress, isProgressChanging })
  }

  return {
    progressRef,
    onProgressBtnTouchStart,
    onProgressBtnTouchMove,
    onProgressBtnTouchEnd,
    handleProgressClick
  }
}
