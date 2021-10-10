<template>
  <teleport to="body">
    <transition name="list-fade">
      <div class="playlist" v-show="visible && playList.length" @click="hide">
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <h1 class="title">
              <i class="icon" :class="playModeIcon" @click="changePlayMode"></i>
              <span class="text">{{ playModeText }}</span>
            </h1>
          </div>
          <scroll ref="scrollRef" class="list-content">
            <transition-group ref="listRef" name="list" tag="ul">
              <li
                class="item"
                v-for="song in sequenceList"
                :key="song.id"
                @click="selectItem(song)"
              >
                <i class="current" :class="getCurrentIcon(song)"></i>
                <span class="text">{{ song.name }}</span>
                <span class="favorite" @click.stop="toggleFavorite(song)">
                  <i :class="getFavoriteIcon(song)"></i>
                </span>
                <span class="delete" @click.stop="removeSong(song)" :class="{ disable: removing }">
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </scroll>
          <div class="list-footer" @click="hide">
            <span>关闭</span>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import Scroll from '@/components/base/scroll/scroll'
import { ref, computed, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
import { SET_CURRENT_INDEX, SET_PLAYING } from '@/store/mutation-types'
import useMode from '../player/use-mode'
import useFavorite from '../player/use-favorite'

export default {
  name: 'play-list',
  components: {
    Scroll
  },
  setup() {
    const visible = ref(false)
    const scrollRef = ref(null)
    const listRef = ref(null)
    const removing = ref(false)

    const store = useStore()
    const playList = computed(() => store.getters.playList)
    const sequenceList = computed(() => store.getters.sequenceList)
    const currentSong = computed(() => store.getters.currentSong)

    // & hooks
    const { playModeIcon, playModeText, changePlayMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()

    // & methods
    const getCurrentIcon = song => {
      if (song.id === currentSong.value.id) {
        return 'icon-play'
      }
    }

    const show = async () => {
      visible.value = true

      await nextTick()
      refreshScroll()
      scrollToCurrent()
    }

    const hide = () => {
      visible.value = false
    }

    const refreshScroll = () => {
      scrollRef.value.scroll.refresh()
    }

    // ! 滚动到当前播放歌曲
    const scrollToCurrent = () => {
      const index = sequenceList.value.findIndex(song => {
        return currentSong.value.id === song.id
      })
      if (index === -1) {
        return
      }
      const target = listRef.value.$el.children[index]

      scrollRef.value.scroll.scrollToElement(target, 300)
    }

    // ! 切歌
    const selectItem = song => {
      const index = playList.value.findIndex(item => {
        return song.id === item.id
      })

      store.commit(SET_CURRENT_INDEX, index)
      store.commit(SET_PLAYING, true)
    }

    const removeSong = song => {
      if (removing.value) {
        return
      }
      removing.value = true
      store.dispatch('removeSong', song)
      if (!playList.value.length) {
        hide()
      }
      setTimeout(() => {
        removing.value = false
      }, 300)
    }

    // & user watcher
    watch(currentSong, async newSong => {
      if (!visible.value || !newSong.id) {
        return
      }
      // * currentSong的变化, 可能是因为删除歌曲, dom会发生变化, 这里await nextTick 的目的是确保dom重新渲染之后再执行后续操作
      await nextTick()
      scrollToCurrent()
    })

    return {
      visible,
      scrollRef,
      listRef,
      removing,
      // * vuex
      playList,
      sequenceList,
      // * hooks mode
      playModeIcon,
      playModeText,
      changePlayMode,
      // * hooks favorite
      getFavoriteIcon,
      toggleFavorite,
      // * methods
      getCurrentIcon,
      show,
      hide,
      selectItem,
      removeSong
    }
  }
}
</script>

<style lang="scss" scoped>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;
  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter-from,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 24px;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .favorite {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
        }
      }
    }
    .list-add {
      width: 140px;
      margin: 20px auto 30px auto;
      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;
        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }
        .text {
          font-size: $font-size-small;
        }
      }
    }
    .list-footer {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
