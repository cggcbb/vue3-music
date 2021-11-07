<template>
  <div
    ref="rootRef"
    class="suggest"
    v-loading:[loadingText]="loading"
    v-empty:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-if="singer" @click="selectSinger(singer)">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li class="suggest-item" v-for="song in songs" :key="song.id" @click="selectSong(song)">
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{ song.singer }}-{{ song.name }}</p>
        </div>
      </li>
      <div class="suggest-item" v-loading:[pullUpLoadingObject]="pullUpLoading"></div>
    </ul>
  </div>
</template>

<script>
import { ref, watch, computed, nextTick, reactive } from 'vue'
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
  emits: ['select-singer', 'select-song'],
  setup(props, { emit }) {
    const singer = ref(null)
    const songs = ref([])
    const hasMore = ref(true)
    const page = ref(1)
    const loadingText = ref('正在搜索 ...')
    const pullUpLoadingObject = reactive({
      message: '',
      width: 25,
      height: 25
    })
    const manualLoading = ref(false)
    const isLoading = ref(false)

    // * computed
    const noResultText = computed(() => {
      return `抱歉，暂未搜索到 "${props.query}" 相关的信息`
    })

    const loading = computed(() => {
      return !singer.value && !songs.value.length && isLoading.value
    })

    const noResult = computed(() => {
      return !singer.value && !songs.value.length && !hasMore.value
    })

    const pullUpLoading = computed(() => {
      return isPullUpLoad.value && hasMore.value
    })

    const preventPullUpLoad = computed(() => {
      return loading.value || manualLoading.value
    })

    // * methods
    const searchFirst = async () => {
      if (!props.query) {
        return
      }
      resetSearch()
      isLoading.value = true
      const result = await search(props.query, page.value, props.showSinger)
      songs.value = await processSongPureUrl(result.songs)
      singer.value = result.singer
      hasMore.value = result.hasMore
      await nextTick()
      await ensureScrollable()
      isLoading.value = false
    }

    const searchMore = async () => {
      if (!hasMore.value || !props.query) {
        return
      }
      isLoading.value = true
      page.value++
      const result = await search(props.query, page.value, props.showSinger)
      songs.value = songs.value.concat(await processSongPureUrl(result.songs))
      hasMore.value = result.hasMore
      await nextTick()
      await ensureScrollable()
      isLoading.value = false
    }

    async function ensureScrollable() {
      if (scroll.value.maxScrollY >= -1) {
        manualLoading.value = true
        await searchMore()
        manualLoading.value = false
      }
    }

    function resetSearch() {
      page.value = 1
      songs.value = []
      singer.value = null
      hasMore.value = true
    }

    const selectSinger = singer => {
      emit('select-singer', singer)
    }
    const selectSong = song => {
      emit('select-song', song)
    }

    // * hooks
    const { rootRef, isPullUpLoad, scroll } = usePullUpLoad({
      fetch: searchMore,
      preventPullUpLoad
    })

    // * user watcher
    watch(
      () => props.query,
      async newQuery => {
        if (!newQuery) {
          return
        }
        await searchFirst()
      }
    )

    return {
      singer,
      songs,
      pullUpLoadingObject,
      // * computed
      loadingText,
      noResultText,
      loading,
      noResult,
      pullUpLoading,
      // * hooks pullUp
      rootRef,
      // * methods
      selectSinger,
      selectSong
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
