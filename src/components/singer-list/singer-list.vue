<template>
  <scroll class="singer-list" :probeType="3" @scroll="onScroll">
    <ul ref="groupRef">
      <li v-for="(group, groupIndex) in data" :key="group.title" class="group">
        <h2
          class="title"
          :style="{
            color: titleStyle(groupIndex)
          }"
        >
          {{ group.title }}
        </h2>
        <ul>
          <li v-for="item in group.list" :key="item.id" class="item">
            <img class="avatar" v-lazy="item.pic" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="fixed" v-show="fixedTitle" :style="fixedStyle">
      <div class="fixed-title">{{ fixedTitle }}</div>
    </div>
  </scroll>
</template>

<script>
import Scroll from '@/components/base/scroll/scroll'
import useFixedTitle from './use-fixed-title'

export default {
  name: 'singer-list',
  components: { Scroll },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const { groupRef, onScroll, fixedTitle, fixedStyle, titleStyle } = useFixedTitle(props)

    return {
      onScroll,
      groupRef,
      fixedTitle,
      fixedStyle,
      titleStyle
    }
  }
}
</script>

<style lang="scss" scoped>
.singer-list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;
  .group {
    padding-bottom: 30px;
    .title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      background: $color-highlight-background;
    }
    .item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }
  .fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      background: $color-highlight-background;
    }
  }
}
</style>
