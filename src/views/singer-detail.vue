<template>
  <div
    class="singer-detail"
    @touchstart="onSingerDetailTouchStart"
    @touchmove="onSingerDetailTouchMove"
  >
    <music-list
      :title="title"
      :pic="pic"
      :songs="songs"
      :loading="loading"
      :emptyText="emptyText"
    />
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { processSongPureUrl } from '@/service/song'
import MusicList from '@/components/music-list/music-list'
import { computed, ref, onBeforeMount } from 'vue'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'singer-detail',
  props: {
    singer: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    MusicList
  },
  setup(props) {
    const songs = ref([])
    const loading = ref(true)
    const pureSinger = ref({})
    const route = useRoute()
    const router = useRouter()
    const touch = {}

    onBeforeMount(async () => {
      const _computedSinger = computedSinger()
      if (!_computedSinger) {
        return router.back()
      }
      pureSinger.value = _computedSinger
      const result = await getSingerDetail(pureSinger.value)
      songs.value = await processSongPureUrl(result.songs)
      loading.value = false
    })

    // * 如果props传入singer对象, 就取props.singer, 否者尝试取sessionStorage里面singer
    const computedSinger = () => {
      const propSinger = props.singer

      if (propSinger) {
        return propSinger
      } else {
        const mid = route.params?.mid
        const cacheSinger = storage.session.get(SINGER_KEY)
        if (cacheSinger && cacheSinger.mid === mid) {
          return cacheSinger
        }
        return null
      }
    }

    const title = computed(() => pureSinger.value?.name)

    const pic = computed(() => pureSinger.value?.pic)

    const emptyText = computed(() => {
      return `抱歉，暂未搜索到 "${pureSinger.value.name}" 相关的歌曲`
    })

    // & onSingerDetailTouchStart 和 onSingerDetailTouchMove 实现详情页面短时间 (600ms 滑动了 260 像素) 向右滑动, 关闭
    const onSingerDetailTouchStart = e => {
      touch.x = e.touches[0].pageX
      touch.startTime = +new Date()
    }

    const onSingerDetailTouchMove = e => {
      const deltaX = e.touches[0].pageX - touch.x
      const deltaTime = +new Date() - touch.startTime
      if (deltaTime <= 600 && deltaX >= 260) {
        router.push({
          path: '/singer'
        })
      }
    }

    return {
      title,
      pic,
      songs,
      loading,
      emptyText,
      onSingerDetailTouchStart,
      onSingerDetailTouchMove
    }
  }
}
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
