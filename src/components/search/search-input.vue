<template>
  <div class="search-input">
    <i class="icon-search"></i>
    <input class="input-inner" v-model="queryVal" :placeholder="placeholder" />
    <i v-show="queryVal" class="icon-dismiss" @click="clear"></i>
  </div>
</template>

<script>
import { debounce } from '@/assets/js/util'
import { ref, watch } from 'vue'

export default {
  name: 'search-input',
  props: {
    query: String,
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  emits: ['update:query'],
  setup(props, { emit }) {
    const queryVal = ref(props.query)

    watch(
      queryVal,
      debounce(newQuery => {
        emit('update:query', newQuery.trim())
      }, 300)
    )

    const clear = () => {
      queryVal.value = ''
    }

    return {
      queryVal,
      clear
    }
  }
}
</script>

<style lang="scss" scoped>
.search-input {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 32px;
  background: $color-highlight-background;
  border-radius: 6px;
  .icon-search {
    font-size: 24px;
    color: $color-text-d;
  }
  .input-inner {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    outline: 0;
    &::placeholder {
      color: $color-text-d;
    }
  }
  .icon-dismiss {
    font-size: 16px;
    color: $color-text-d;
  }
}
</style>
