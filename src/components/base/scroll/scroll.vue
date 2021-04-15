<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>

<script>
import useScroll from './use-scroll'
import { ref } from 'vue'

export default {
  name: 'scroll',
  props: {
    click: {
      type: Boolean,
      default: true
    },
    probeType: {
      type: Number,
      default: 0
    }
  },
  emits: ['scroll'],
  setup(props, { emit }) {
    const rootRef = ref(null)
    const scroll = useScroll(rootRef, props, emit)

    return {
      rootRef,
      scroll
    }
  }
}
</script>

<style lang="scss" scoped>
.scrollbar {
  height: 100% !important;
  .scrollbar-wrapper {
    position: relative !important;
    height: 100% !important;
    padding: 0 10px !important;
    border: 1px solid #ccc !important;
    overflow: hidden !important;
  }
  .scrollbar-content-item {
    padding: 10px 0 !important;
    list-style: none !important;
    border-bottom: 1px solid #ccc !important;
    text-align: left !important;
  }
}

</style>
