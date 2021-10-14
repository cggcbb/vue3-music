/**
 * 高阶 scroll 组件
 */
import Scroll from '@/components/base/scroll/scroll'
import { h, mergeProps, withCtx, renderSlot, ref, computed, nextTick, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'high-scroll',
  props: Scroll.props,
  emits: Scroll.emits,
  render(_ctx) {
    return h(
      Scroll,
      mergeProps({ ref: 'scrollRef' }, _ctx.$props, {
        onScroll: e => {
          _ctx.$emit('scroll', e)
        }
      }),
      {
        default: withCtx(() => {
          return [renderSlot(_ctx.$slots, 'default')]
        })
      }
    )
  },
  // & 在scroll组件基础上, 做点额外的事情
  setup() {
    const scrollRef = ref(null)
    const scroll = computed(() => {
      return scrollRef.value.scroll
    })

    const store = useStore()
    const playList = computed(() => store.getters.playList)

    watch(playList, () => {
      nextTick(() => {
        scroll.value.refresh()
      })
    })

    return {
      scrollRef,
      scroll
    }
  }
}
