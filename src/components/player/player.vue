<template>
  <div class="player">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.pic" />
      </div>
      <div class="top">
        <div class="back" @click="handleMiniClick">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">{{ currentSong.name }}</h1>
        <h2 class="subtitle">{{ currentSong.singer }}</h2>
      </div>
      <div class="middle">
        <div class="middle-l">
          <div class="cd-wrapper">
            <div class="cd" ref="cdRef">
              <img ref="cdImageRef" class="image" :class="cdClass" :src="currentSong.pic" />
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="progress-wrapper">
          <span class="time time-l">{{ currentTime }}</span>
          <div class="progress-bar-wrapper">
            <progress-bar
              :progress="progress"
              @progress-changing="handleProgressChanging"
              @progress-changed="handleProgressChanged"
            ></progress-bar>
          </div>
          <span class="time time-r">{{ duration }}</span>
        </div>
        <div class="operators">
          <div class="icon i-left">
            <i :class="playModeIcon" @click="changePlayMode"></i>
          </div>
          <div class="icon i-left" :class="disabledClass">
            <i class="icon-prev" @click="handlePrev"></i>
          </div>
          <div class="icon i-center" :class="disabledClass">
            <i :class="playIcon" @click="togglePlay"></i>
          </div>
          <div class="icon i-right" :class="disabledClass">
            <i class="icon-next" @click="handleNext"></i>
          </div>
          <div class="icon i-right">
            <i :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
          </div>
        </div>
      </div>
    </div>
    <audio
      ref="audioRef"
      @pause="handleAudioPause"
      @canplay="handleAudioCanPlay"
      @error="handleAudioError"
      @timeupdate="handleAudioTimeUpdate"
      @ended="handleAudioEnded"
    ></audio>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import { SET_FULL_SCREEN } from '@/store/mutation-types'
import useMode from './use-mode'
import useFavorite from './use-favorite'
import useAudio from './use-audio'
import usePlay from './use-play'
import ProgressBar from '@/components/base/progress-bar/progress-bar'
import useProgress from './use-progress'
import useCd from './use-cd'

export default {
  name: 'player',
  components: {
    ProgressBar
  },
  setup() {
    // & vuex
    const store = useStore()

    const fullScreen = computed(() => store.getters.fullScreen)
    const playing = computed(() => store.getters.playing)

    // & hooks
    const { playModeIcon, changePlayMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()

    const {
      songReady,
      updateTime,
      manualPause,
      progressChanging,
      handleAudioPause,
      handleAudioCanPlay,
      handleAudioError,
      handleAudioTimeUpdate
    } = useAudio()

    const {
      audioRef,
      currentSong,
      currentTime,
      duration,
      progress,
      togglePlay,
      handlePrev,
      handleNext,
      handleAudioEnded
    } = usePlay({
      songReady,
      updateTime,
      manualPause
    })

    const { handleProgressChanging, handleProgressChanged } = useProgress({
      audioRef,
      currentSong,
      updateTime,
      progressChanging,
      playing
    })

    const { cdImageRef, cdRef, cdClass } = useCd()

    // & computed
    const playIcon = computed(() => (playing.value ? 'icon-pause' : 'icon-play'))
    const disabledClass = computed(() => (songReady.value ? '' : 'disable'))

    // & methods
    const handleMiniClick = () => {
      store.commit(SET_FULL_SCREEN, false)
    }

    return {
      //* vuex
      fullScreen,
      // * hooks mode
      playModeIcon,
      changePlayMode,
      // * hooks favorite
      getFavoriteIcon,
      toggleFavorite,
      // * hooks audio
      handleAudioPause,
      handleAudioCanPlay,
      handleAudioError,
      handleAudioTimeUpdate,
      // * hooks play
      audioRef,
      currentSong,
      currentTime,
      duration,
      progress,
      togglePlay,
      handlePrev,
      handleNext,
      handleAudioEnded,
      // * hooks progress
      handleProgressChanging,
      handleProgressChanged,
      // * hooks cd
      cdImageRef,
      cdRef,
      cdClass,
      // * computed
      playIcon,
      disabledClass,
      // * methods
      handleMiniClick
    }
  }
}
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;
      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
