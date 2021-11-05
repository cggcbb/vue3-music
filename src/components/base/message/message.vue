<template>
  <teleport to="body">
    <transition name="slide-down">
      <div class="message" v-show="visible" @click="hide" :class="messageWrapperClass">
        <div class="message-title">
          <i class="icon" :class="iconClass"></i>
          <span class="text" :class="textClass">{{ text }}</span>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'message',
  props: {
    delay: {
      type: Number,
      default: 3000
    },
    type: {
      type: String,
      default: 'success'
    },
    text: {
      type: String,
      default: '这是一条消息'
    }
  },
  setup(props) {
    const visible = ref(false)
    const timer = ref(null)

    const show = () => {
      visible.value = true
      clearTimeout(timer.value)
      timer.value = setTimeout(() => {
        hide()
      }, props.delay)
    }

    const hide = () => {
      clearTimeout(timer.value)
      visible.value = false
    }

    const messageWrapperClass = computed(() => {
      const typeVal = props.type
      return typeVal === 'success' ? 'success' : typeVal === 'warn' ? 'warn' : 'info'
    })

    const iconClass = computed(() => {
      const typeVal = props.type
      return typeVal === 'success' ? 'icon-ok' : typeVal === 'warn' ? 'icon-close' : 'info'
    })

    const textClass = computed(() => {
      const typeVal = props.type
      return typeVal === 'success' ? 'text-success' : typeVal === 'warn' ? 'text-warn' : 'info'
    })

    return {
      visible,
      show,
      hide,
      messageWrapperClass,
      iconClass,
      textClass
    }
  }
}
</script>

<style scoped lang="scss">
$okColor: #67c23a;
$warnColor: #e6a23c;
.message {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 400;

  &.success {
    background: #f0f9eb;
  }
  &.warn {
    background: #fdf6ec;
  }
  .message-title {
    text-align: center;
    padding: 18px 0;
    font-size: 0;
    .icon {
      font-size: $font-size-medium;
      margin-right: 6px;
      vertical-align: -1px;
      &.icon-ok {
        color: $okColor;
      }
      &.icon-close {
        color: $warnColor;
      }
    }
    .text {
      font-size: $font-size-medium;
      &.text-success {
        color: $okColor;
      }
      &.text-warn {
        color: $warnColor;
      }
    }
  }

  &.slide-down-enter-active,
  &.slide-down-leave-active {
    transition: all 0.3s;
  }

  &.slide-down-enter-from,
  &.slide-down-leave-to {
    transform: translate3d(0, -100%, 0);
  }
}
</style>
