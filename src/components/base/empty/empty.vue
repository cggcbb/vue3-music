<template>
  <div class="empty">
    <div class="empty-content">
      <div class="icon"></div>
      <p class="text">{{ emptyMessage }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'empty',

  setup() {
    const emptyMessage = ref('抱歉，暂未搜索到相关内容')

    const setMessage = message => {
      emptyMessage.value = message
    }
    return {
      emptyMessage,
      setMessage
    }
  }
}
</script>

<style lang="scss" scoped>
.empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: 100%;
  .empty-content {
    text-align: center;
    .icon {
      width: 130px;
      height: 80px;
      margin: 0 auto;
      background-image: url('../../../assets/image/empty.svg');
      background-size: 100%;
    }
    .text {
      margin-top: 30px;
      font-size: $font-size-medium;
      color: $color-text-d;
    }
  }
}
</style>
