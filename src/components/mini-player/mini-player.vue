<template>
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="showNormalPlayer">
      <div class="cd-wrapper" ref="miniCdWrapperRef">
        <div class="cd" ref="miniCdRef">
          <img
            width="40"
            height="40"
            ref="miniCdImageRef"
            :src="currentSong.pic"
            :class="miniCdClass"
          />
        </div>
      </div>
      <div class="slider-wrapper" ref="miniSliderWrapperRef">
        <div class="slider-group">
          <div class="slider-page" v-for="song in playList" :key="song.id">
            <p class="desc">{{ `${song.name} - ${song.singer}` }}</p>
          </div>
        </div>
      </div>
      <div class="control">
        <progress-circle :radius="32" :progress="progress">
          <i class="icon-mini" :class="miniPlayIcon" @click.stop="togglePlay"></i>
        </progress-circle>
      </div>
      <div class="control" @click.stop="showPlayList">
        <i class="icon-playlist"></i>
      </div>
      <play-list ref="playListRef"></play-list>
    </div>
  </transition>
</template>

<script>
import ProgressCircle from '@/components/progress-circle/progress-circle'
import PlayList from '@/components/play-list/play-list'
import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'
import { SET_FULL_SCREEN } from '@/store/mutation-types'
import useMiniCd from './use-mini-cd'
import useMiniSlider from './use-mini-slider'
import { addClass, removeClass } from '@/assets/js/dom'

export default {
  name: 'mini-player',
  components: {
    ProgressCircle,
    PlayList
  },
  props: {
    progress: {
      type: Number,
      default: 0
    },
    togglePlay: Function,
    // * miniCdWrpper 弹跳
    bounce: Boolean
  },
  setup(props) {
    const miniCdWrapperRef = ref(null)
    const playListRef = ref(null)

    const store = useStore()
    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playing = computed(() => store.getters.playing)
    const playList = computed(() => store.getters.playList)

    const miniPlayIcon = computed(() => {
      return playing.value ? 'icon-pause-mini' : 'icon-play-mini'
    })

    const { miniCdImageRef, miniCdRef, miniCdClass } = useMiniCd()

    const { miniSliderWrapperRef } = useMiniSlider()

    const showNormalPlayer = () => {
      store.commit(SET_FULL_SCREEN, true)
    }

    const showPlayList = () => {
      playListRef.value.show()
    }

    // & user watcher -> 监听 bounce, 给 miniCdWrapper 添加 'bounce' class, 触发弹跳动画
    watch(
      () => props.bounce,
      newBounce => {
        if (newBounce) {
          addClass(miniCdWrapperRef.value, 'bounce')
        } else {
          removeClass(miniCdWrapperRef.value, 'bounce')
        }
      }
    )

    return {
      miniCdWrapperRef,
      playListRef,
      // * vuex
      fullScreen,
      currentSong,
      playList,
      // * hooks cd
      miniCdImageRef,
      miniCdRef,
      miniCdClass,
      // * hooks miniSlider
      miniSliderWrapperRef,
      // * computed
      miniPlayIcon,
      // * methods
      showNormalPlayer,
      showPlayList
    }
  }
}
</script>

<style lang="scss" scoped>
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: $color-highlight-background;
  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    &.bounce {
      animation: bounce 2s ease-out;
    }
    .cd {
      height: 100%;
      width: 100%;
      img {
        border-radius: 50%;
        &.playing {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }
  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      display: flex;
      align-items: center;
      .slider-page {
        display: inline-block;
        width: 100%;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        .desc {
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text;
        }
      }
    }
  }
  .playLyric {
    position: absolute;
    width: 68%;
    @include no-wrap();
    font-size: $font-size-small;
    color: $color-text;
  }
  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    .icon-playlist {
      position: relative;
      top: -2px;
      font-size: 28px;
      color: $color-theme-d;
    }
    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: $color-theme-d;
      font-size: 32px;
    }
  }
  &.mini-enter-active,
  &.mini-leave-active {
    transition: all 0.4s cubic-bezier(0.45, 0, 0.55, 1);
  }
  &.mini-enter-from,
  &.mini-leave-to {
    opacity: 0;
  }
}

@keyframes bounce {
  0% {
    transform: translate3d(0, -20px, 0);
  }
  20% {
    transform: translate3d(0, 0, 0);
  }
  40% {
    transform: translate3d(0, -15px, 0);
  }
  60% {
    transform: translate3d(0, 0, 0);
  }
  80% {
    transform: translate3d(0, -10px, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
</style>
