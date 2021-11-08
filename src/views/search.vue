<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model:query="query"></search-input>
    </div>
    <scroll ref="scrollRef" class="search-content" v-show="!query">
      <div>
        <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="item in hotKeys" :key="item.id" @click="addQuery(item.key)">
              <span>{{ item.key }}</span>
            </li>
          </ul>
        </div>
        <div class="search-history">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <confirm
            ref="confirmRef"
            text="是否清空所有搜索历史"
            confirm-btn-text="清空"
            @confirm="clearSearch"
          >
          </confirm>
          <search-list
            :searches="searchHistory"
            @select="addQuery"
            @delete="deleteSearch"
          ></search-list>
        </div>
      </div>
    </scroll>
    <div class="search-result" v-show="query">
      <suggest :query="query" @select-song="selectSong" @select-singer="selectSinger"></suggest>
    </div>
    <message ref="messageRef" type="warn" :delay="2000" text="暂无搜索历史"></message>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>
import SearchInput from '@/components/search/search-input'
import Scroll from '@/components/high-scroll'
import Confirm from '@/components/base/confirm/confirm'
import Message from '@/components/base/message/message'
import Suggest from '@/components/search/suggest'
import useSearchHistory from '@/components/search/use-search-history'
import SearchList from '@/components/base/search-list/search-list'
import storage from 'good-storage'
import { ref, onBeforeMount, computed, watch, nextTick } from 'vue'
import { getHotKeys } from '@/service/search'
import { useStore } from 'vuex'
import { SINGER_KEY } from '@/assets/js/constant'
import { useRouter } from 'vue-router'

export default {
  name: 'search',
  components: {
    SearchInput,
    Scroll,
    Confirm,
    Message,
    Suggest,
    SearchList
  },
  setup() {
    const query = ref('')
    const scrollRef = ref(null)
    const hotKeys = ref([])
    const confirmRef = ref(null)
    const messageRef = ref(null)
    const selectedSinger = ref(null)

    const router = useRouter()

    onBeforeMount(async () => {
      const result = await getHotKeys()
      hotKeys.value = result.hotKeys
    })

    const store = useStore()
    const searchHistory = computed(() => store.getters.searchHistory)

    const { saveSearch, deleteSearch, clearSearch } = useSearchHistory()

    // & 删除搜索历史弹窗
    const showConfirm = () => {
      if (!searchHistory.value.length) {
        // * 无搜索历史, 提示message
        messageRef.value.show()
        return
      }
      confirmRef.value.show()
    }

    const addQuery = newQuery => {
      query.value = newQuery.trim()
    }

    const selectSinger = singer => {
      saveSearch(query.value.trim())
      selectedSinger.value = singer
      cacheSingerToSessionStorage(singer)

      router.push({
        path: `/search/${singer.mid}`
      })
    }

    const selectSong = song => {
      saveSearch(query.value.trim())
      store.dispatch('addSong', song)
    }

    // & 缓存singer 至 sessionStorage  (页面刷新使用)
    const cacheSingerToSessionStorage = singer => {
      storage.session.set(SINGER_KEY, singer)
    }

    // & 清空搜索列表 刷新scroll, 以达到能滚动的目的
    watch(query, async newQuery => {
      if (!newQuery) {
        await nextTick()
        refreshScroll()
      }
    })

    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }

    return {
      confirmRef,
      messageRef,
      query,
      scrollRef,
      hotKeys,
      selectedSinger,
      // * vuex
      searchHistory,
      // * hooks searchHistory
      deleteSearch,
      clearSearch,
      // * methods
      showConfirm,
      addQuery,
      selectSong,
      selectSinger
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper {
    margin: 20px;
  }
  .search-content {
    flex: 1;
    overflow: hidden;
    .hot-keys {
      margin: 0 20px 20px 20px;
      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: $color-highlight-background;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
    .search-history {
      position: relative;
      margin: 0 20px;
      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: $font-size-medium;
        color: $color-text-l;
        .text {
          flex: 1;
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
  }
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
