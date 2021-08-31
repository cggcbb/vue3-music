<template>
  <div class="progress-bar" ref="progressBarRef" @click="handleProgressClick">
    <div class="bar-inner">
      <div class="progress" :style="progressStyle" ref="progressRef"></div>
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onProgressBtnTouchStart"
        @touchmove.prevent="onProgressBtnTouchMove"
        @touchend.prevent="onProgressBtnTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { watch, ref, computed } from 'vue'
import useTouch from './use-touch'

const halfProgressBtnWidth = 8

export default {
  name: 'progress-bar',
  emits: ['progress-changing', 'progress-changed'],
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  setup(props, { emit }) {
    const progressBarRef = ref(null)
    const offset = ref(0)
    const barWidth = ref(0)

    // & computed
    const progressStyle = computed(() => {
      return {
        width: `${offset.value}px`
      }
    })

    const btnStyle = computed(() => {
      return {
        transform: `translate3d(${offset.value}px, 0, 0)`
      }
    })

    // & hooks
    const {
      progressRef,
      onProgressBtnTouchStart,
      onProgressBtnTouchMove,
      onProgressBtnTouchEnd,
      handleProgressClick
    } = useTouch(
      { emit },
      {
        barWidth,
        offset,
        progressBarRef
      }
    )

    // * user watcher
    watch(
      () => props.progress,
      newProgress => {
        const barWidthVal = barWidth.value
        if (barWidthVal <= 0) {
          barWidth.value = progressBarRef.value.clientWidth - halfProgressBtnWidth
        }
        offset.value = barWidthVal * newProgress
      }
    )

    return {
      progressBarRef,
      progressStyle,
      btnStyle,
      // * hooks touch
      progressRef,
      onProgressBtnTouchStart,
      onProgressBtnTouchMove,
      onProgressBtnTouchEnd,
      handleProgressClick
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
      border-radius: 4px;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
