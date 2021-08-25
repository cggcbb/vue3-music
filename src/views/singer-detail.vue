<template>
  <div class="singer-detail">
    <music-list :title="title" :pic="pic" :songs="songs" :loading="loading" />
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

    return {
      title,
      pic,
      songs,
      loading
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
