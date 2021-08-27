<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgImageStyle" ref="bgImage">
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div v-show="songs.length" class="play-btn" @click="handleRandomPlay">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle"></div>
    </div>
    <scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      v-empty:[emptyText]="empty"
      :probe-type="3"
      @scroll="handleScroll"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs" @selectSongItem="handleSelectSongItem"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import SongList from '@/components/base/song-list/song-list'
import Scroll from '@/components/base/scroll/scroll'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import useStyle from './useStyle'
import usePlay from './usePlay'

export default {
  name: 'music-list',
  components: {
    SongList,
    Scroll
  },
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    title: String,
    pic: String,
    loading: Boolean,
    emptyText: {
      type: String,
      default: '抱歉，暂未搜索到相关内容'
    }
  },
  setup(props) {
    const scrollY = ref(0)
    const router = useRouter()

    const { bgImage, bgImageStyle, scrollStyle, filterStyle, playBtnStyle } = useStyle(
      props,
      scrollY
    )

    const { handleSelectSongItem, handleRandomPlay } = usePlay(props)

    // & 实时监听scroll滚动事件, 更新scrollY值
    const handleScroll = pos => {
      scrollY.value = Math.round(-pos.y)
    }

    // & 返回
    const goBack = () => {
      router.back()
    }

    // & 无歌曲
    const empty = computed(() => {
      return !props.loading && !props.songs.length
    })

    return {
      bgImageStyle,
      bgImage,
      scrollStyle,
      filterStyle,
      playBtnStyle,
      handleScroll,
      goBack,
      empty,
      handleSelectSongItem,
      handleRandomPlay
    }
  }
}
</script>

<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
      }
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
