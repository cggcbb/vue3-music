<template>
  <teleport to="body">
    <transition name="slide">
      <div class="add-song" v-show="visible">
        <div class="header">
          <h1 class="title">添加歌曲到列表</h1>
          <div class="close" @click="hide">
            <i class="icon-close"></i>
          </div>
        </div>
        <div class="search-input-wrapper">
          <search-input v-model:query="query" placeholder="搜索歌曲" />
        </div>
        <div v-show="!query">
          <switches :items="['最近播放', '搜索历史']" v-model="currentIndex" />
          <div class="list-wrapper">
            <scroll v-if="currentIndex === 0" class="list-scroll" ref="scrollRef">
              <div class="list-inner">
                <song-list :songs="playHistory" @selectSongItem="selectSongBySongList" />
              </div>
            </scroll>
            <scroll v-if="currentIndex === 1" class="list-scroll" ref="scrollRef">
              <div class="list-inner">
                <search-list
                  :searches="searchHistory"
                  :show-delete="false"
                  @select="addQuery"
                ></search-list>
              </div>
            </scroll>
          </div>
        </div>
        <div class="search-result" v-show="query">
          <suggest :query="query" :show-singer="false" @select-song="selectSongBySuggest" />
        </div>
        <message ref="messageRef" type="success" :text="messageText" />
      </div>
    </transition>
  </teleport>
</template>

<script>
import SearchInput from '@/components/search/search-input'
import Suggest from '@/components/search/suggest'
import Switches from '@/components/base/switches/switches'
import Scroll from '@/components/base/scroll/scroll'
import SongList from '@/components/base/song-list/song-list'
import SearchList from '@/components/base/search-list/search-list'
import Message from '@/components/base/message/message'
import useSelectSong from './use-select-song'
import { ref, computed, nextTick, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'add-song',
  components: {
    SearchInput,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchList,
    Message
  },
  setup() {
    const visible = ref(false)
    const query = ref('')
    const currentIndex = ref(0)
    const scrollRef = ref(null)

    // * vuex
    const store = useStore()
    const searchHistory = computed(() => store.getters.searchHistory)
    const playHistory = computed(() => store.getters.playHistory)

    const { messageRef, messageText, selectSongBySongList, selectSongBySuggest } = useSelectSong({
      query
    })

    // * methods
    const show = async () => {
      visible.value = true

      await nextTick()
      refreshScroll()
    }

    const hide = () => {
      visible.value = false
    }

    const addQuery = newQuery => {
      query.value = newQuery.trim()
    }

    const refreshScroll = () => {
      scrollRef.value.scroll.refresh()
    }

    // * user watcher
    watch(query, async newQuery => {
      if (!newQuery) {
        return
      }
      await nextTick()
      refreshScroll()
    })

    return {
      visible,
      query,
      scrollRef,
      messageRef,
      currentIndex,
      searchHistory,
      playHistory,
      show,
      hide,
      addQuery,
      selectSongBySongList,
      selectSongBySuggest,
      messageText
    }
  }
}
</script>

<style lang="scss" scoped>
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 300;
  background: $color-background;
  .header {
    position: relative;
    height: 44px;
    text-align: center;
    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .close {
      position: absolute;
      top: 0;
      right: 8px;
      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }
  .search-input-wrapper {
    margin: 20px;
  }
  .list-wrapper {
    position: absolute;
    top: 165px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
      .list-inner {
        padding: 20px 30px;
      }
    }
  }
  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }
}

.message-title {
  text-align: center;
  padding: 18px 0;
  font-size: 0;
  .icon-ok {
    font-size: $font-size-medium;
    color: $color-theme;
    margin-right: 4px;
  }
  .text {
    font-size: $font-size-medium;
    color: $color-text;
  }
}
</style>
