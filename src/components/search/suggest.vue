<template>
  <div
    ref="rootRef"
    class="suggest"
    v-loading:[loadingText]="loading"
    v-empty:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-if="singer">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li class="suggest-item" v-for="song in songs" :key="song.id">
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{ song.singer }}-{{ song.name }}</p>
        </div>
      </li>
      <div class="suggest-item"></div>
    </ul>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'
import { search } from '@/service/search'
import { processSongPureUrl } from '@/service/song'
import usePullUpLoad from './use-pull-up-load'

export default {
  name: 'suggest',
  props: {
    query: String,
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { emit }) {
    const singer = ref(null)
    const songs = ref([])
    const hasMore = ref(true)
    const page = ref(1)
    const loadingText = ref('正在搜索...')
    const noResultText = ref('抱歉，暂无搜索结果')

    const loading = computed(() => {
      return !singer.value && !songs.value.length
    })

    const noResult = computed(() => {
      return !singer.value && !songs.value.length && !hasMore.value
    })

    const searchFirst = async () => {
      debugger
      if (!props.query) {
        return
      }
      resetSearch()

      const result = await search(props.query, page.value, props.showSinger)
      songs.value = await processSongPureUrl(result.songs)
      singer.value = result.singer
      hasMore.value = result.hasMore
    }

    const searchMore = async () => {
      if (!hasMore.value || !props.query) {
        return
      }
      page.value++
      const result = await search(props.query, page.value, props.showSinger)
      songs.value = songs.value.concat(await processSongPureUrl(result.songs))
      hasMore.value = result.hasMore
    }

    const { rootRef } = usePullUpLoad({
      fetch: searchMore
    })

    watch(
      () => props.query,
      async newQuery => {
        if (!newQuery) {
          return
        }
        await searchFirst()
      }
    )

    function resetSearch() {
      page.value = 1
      songs.value = []
      singer.value = null
      hasMore.value = true
    }

    return {
      singer,
      songs,
      loadingText,
      noResultText,
      loading,
      noResult,
      rootRef
    }
  }
}
</script>

<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^='icon-'] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
