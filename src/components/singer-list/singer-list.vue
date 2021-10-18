<template>
  <scroll class="singer-list" :probeType="3" @scroll="onScroll" ref="scrollRef">
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
          <li
            v-for="item in group.list"
            :key="item.id"
            class="item"
            @click="handleSingerClick(item)"
          >
            <img class="avatar" v-lazy="item.pic" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="fixed" v-show="fixedTitle" :style="fixedStyle">
      <div class="fixed-title">{{ fixedTitle }}</div>
    </div>
    <div
      class="shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      @touchend.stop.prevent="onShortcutTouchEnd"
      v-show="shortcutList.length"
      ref="shortcutRef"
    >
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :key="item"
          :data-index="index"
          class="item"
          :class="{ current: currentIndex === index }"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="center-letter" :style="centerLetterStyle">
      <div class="center-letter-content">
        {{ centerLetter }}
      </div>
    </div>
  </scroll>
</template>

<script>
import Scroll from '@/components/high-scroll'
import useFixedTitle from './use-fixed-title'
import useShortCut from './use-short-cut'

export default {
  name: 'singer-list',
  components: { Scroll },
  emits: ['singerSelect'],
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const {
      groupRef,
      onScroll,
      fixedTitle,
      fixedStyle,
      titleStyle,
      currentIndex,
      colors
    } = useFixedTitle(props)

    const {
      shortcutList,
      onShortcutTouchStart,
      onShortcutTouchMove,
      onShortcutTouchEnd,
      scrollRef,
      centerLetter,
      centerLetterStyle,
      shortcutRef
    } = useShortCut({
      props,
      currentIndex,
      colors,
      groupRef
    })

    const handleSingerClick = singerItem => {
      emit('singerSelect', singerItem)
    }

    return {
      onScroll,
      groupRef,
      fixedTitle,
      fixedStyle,
      titleStyle,
      currentIndex,
      shortcutList,
      onShortcutTouchStart,
      onShortcutTouchMove,
      onShortcutTouchEnd,
      scrollRef,
      centerLetter,
      centerLetterStyle,
      handleSingerClick,
      shortcutRef
    }
  }
}
</script>

<style lang="scss" scoped>
$shortcutColor: var(--shortcutColor, #ffcd32);

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
  .shortcut {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;
    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;
      &.current {
        color: $shortcutColor;
      }
    }
  }
  .center-letter {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    width: 70px;
    height: 70px;
    line-height: 70px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s 0.3s linear;
    border-radius: 6px;
    .center-letter-content {
      font-size: 34px;
      color: $color-text-l;
    }
  }
}
</style>
