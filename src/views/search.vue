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
        </div>
      </div>
    </scroll>
    <div class="search-result" v-show="query">
      <suggest :query="query"></suggest>
    </div>

    <message ref="messageRef" type="warn" :delay="3000" text="暂无搜索历史"></message>
  </div>
</template>

<script>
import SearchInput from '@/components/search/search-input'
import Scroll from '@/components/high-scroll'
import Confirm from '@/components/base/confirm/confirm'
import Message from '@/components/base/message/message'
import Suggest from '@/components/search/suggest'
import useSearchHistory from '@/components/search/use-search-history'
import { ref, onBeforeMount, computed, watch } from 'vue'
import { getHotKeys } from '@/service/search'
import { useStore } from 'vuex'

export default {
  name: 'search',
  components: {
    SearchInput,
    Scroll,
    Confirm,
    Message,
    Suggest
  },
  setup() {
    const query = ref('')
    const scrollRef = ref(null)
    const hotKeys = ref([])
    const confirmRef = ref(null)
    const messageRef = ref(null)

    onBeforeMount(async () => {
      const result = await getHotKeys()
      hotKeys.value = result.hotKeys
    })

    const store = useStore()
    const searchHistory = computed(() => store.getters.searchHistory)

    const { deleteSearch, clearSearch } = useSearchHistory()

    const showConfirm = () => {
      if (!searchHistory.value.length) {
        messageRef.value.show()
        return
      }
      confirmRef.value.show()
    }

    watch(query, newQuery => {
      console.log(newQuery)
    })

    return {
      confirmRef,
      messageRef,
      query,
      scrollRef,
      hotKeys,
      // * vuex
      searchHistory,
      // * hooks searchHistory
      deleteSearch,
      clearSearch,
      // * methods
      showConfirm
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
