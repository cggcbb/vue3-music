<template>
  <div class="loading-wrapper">
    <svg :width="width" :height="height" viewBox="0 0 50 50" preserveAspectRatio="xMidYMid meet">
      <circle
        cx="25"
        cy="25"
        :r="outSideRadius"
        fill="none"
        :stroke-width="strokeWidth"
        :stroke="outSideColor"
        :stroke-dasharray="outSideStrokeDasharray"
        stroke-linecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 25 25; 360 25 25"
          :dur="`${duration}s`"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke"
          :values="outSideTransformColor"
          :dur="`${duration * 2}s`"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        cx="25"
        cy="25"
        :r="inSideRadius"
        fill="none"
        :stroke-width="strokeWidth"
        :stroke="inSideColor"
        :stroke-dasharray="inSideStrokeDasharray"
        stroke-linecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="360 25 25; 0 25 25"
          :dur="`${duration}s`"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke"
          :values="inSideTransformColor"
          :dur="`${duration * 2}s`"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
    <div class="loading-content">
      {{ loadingMessage }}
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'

export default {
  name: 'loading',
  props: {
    width: {
      type: [Number, String],
      default: 50
    },
    height: {
      type: [Number, String],
      default: 50
    },
    outSideColor: {
      type: String,
      default: '#3be6cb'
    },
    outSideSplit: {
      type: [Number, String],
      default: 2
    },
    outSideRadius: {
      type: [Number, String],
      default: 22
    },
    inSideColor: {
      type: String,
      default: '#02bcfe'
    },
    inSideSplit: {
      type: [Number, String],
      default: 2
    },
    inSideRadius: {
      type: [Number, String],
      default: 12
    },
    strokeWidth: {
      type: [Number, String],
      default: 3
    },
    duration: {
      type: [Number, String],
      default: 2
    }
  },
  setup(ctx) {
    const outSideTransformColor = computed(
      () => `${ctx.outSideColor};${ctx.inSideColor};${ctx.outSideColor}`
    )
    const inSideTransformColor = computed(
      () => `${ctx.inSideColor};${ctx.outSideColor};${ctx.inSideColor}`
    )
    const outSideStrokeDasharray = computed(() =>
      Math.floor((2 * Math.PI * ctx.outSideRadius) / (ctx.outSideSplit * 2))
    )
    const inSideStrokeDasharray = computed(() =>
      Math.floor((2 * Math.PI * ctx.inSideRadius) / (ctx.inSideSplit * 2))
    )

    onMounted(() => {
      if (ctx.outSideRadius >= 24) {
        warnLoading('outSideRadius')
      }
      if (ctx.inSideRadius >= 24) {
        warnLoading('inSideRadius')
      }
    })

    const warnLoading = params => {
      console.warn(
        `${params}[current]: ${ctx[params]}, strokeWidth[current]: ${ctx.strokeWidth}, it may not be fully displayed, you might try to lower the [${params}] or [strokeWidth] params to maintain a better display`
      )
    }

    const loadingMessage = ref('Loading ...')

    // 对loading directive提供的内部方法, 来动态修改loadingMessage的值
    const setMessage = message => {
      loadingMessage.value = message
    }

    return {
      outSideTransformColor,
      inSideTransformColor,
      outSideStrokeDasharray,
      inSideStrokeDasharray,
      loadingMessage,
      setMessage
    }
  }
}
</script>

<style scoped lang="scss">
.loading-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  .loading-content {
    margin-top: 10px;
  }
}
</style>
