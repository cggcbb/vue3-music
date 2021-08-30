<template>
  <div class="progress-bar" ref="progressBarRef">
    <div class="bar-inner">
      <div class="progress" :style="progressStyle"></div>
      <div class="progress-btn-wrapper" :style="btnStyle">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { watch, ref, computed } from 'vue'
const progressBtnWidth = 16
let barWidth = 0

export default {
  name: 'progress-bar',
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const progressBarRef = ref(null)
    const offset = ref(0)

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

    watch(
      () => props.progress,
      newProgress => {
        if (barWidth <= 0) {
          barWidth = progressBarRef.value.clientWidth - progressBtnWidth
        }
        offset.value = barWidth * newProgress
      }
    )

    return {
      progressBarRef,
      progressStyle,
      btnStyle
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
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
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
