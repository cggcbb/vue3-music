<template>
  <div
    class="singer-detail"
    @touchstart="onSingerDetailTouchStart"
    @touchmove="onSingerDetailTouchMove"
    @touchend="onSingerDetailTouchEnd"
    :style="singerDetailStyle"
    ref="singerDetailRef"
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
    const singerDetailStyle = ref({})
    const singerDetailRef = ref(null)

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

    //* 屏幕宽度
    const singerDetailDomWidth = computed(() => singerDetailRef.value?.clientWidth)
    //* 屏幕宽度一半
    const singerDetailDomHalfWidth = computed(() => singerDetailDomWidth.value / 2)

    // & touchstart 记录点击时 横坐标和点击时间
    const onSingerDetailTouchStart = e => {
      touch.x = e.touches[0].pageX
      touch.startTime = +new Date()
    }

    // & touchMove 当从最左边30px之内开始按住, 能触发滑动效果
    const onSingerDetailTouchMove = e => {
      const x1 = touch.x
      const deltaX = Math.min(Math.max(e.touches[0].pageX - x1, 0), singerDetailDomWidth.value)
      touch.deltaX = deltaX
      if (x1 <= 30) {
        singerDetailStyle.value = {
          transform: `translate3d(${deltaX}px, 0, 0)`
        }
      }
    }

    // & touchend的时候, 实现详情页面短时间 (600ms 滑动了 160 像素) 向右滑动, 就跳到歌手页面
    // & 如果从最左边30px之内开始按住, 并且没有滑动到屏幕的一半距离, 则还原, 超出直接隐藏, 并跳转到歌手页面
    const onSingerDetailTouchEnd = e => {
      if (touch.x > 30) {
        const deltaTime = +new Date() - touch.startTime
        if (deltaTime <= 600 && touch.deltaX >= 160) {
          singerDetailStyle.value = createTouchEndSingerDetailStyle(false)
          router.push({
            path: '/singer'
          })
        }
        return
      }
      singerDetailStyle.value = createTouchEndSingerDetailStyle()
      if (touch.deltaX >= singerDetailDomHalfWidth.value) {
        router.push({
          path: '/singer'
        })
      }
    }
    // & 获取touchend的时候, 此时 singerDetail 该有的style
    const createTouchEndSingerDetailStyle = (isSlide = true) => {
      // * isSlide 触发了滑动效果
      if (!isSlide) {
        return {
          transition: 'all .3s linear',
          transform: 'translate3d(100%, 0, 0)'
        }
      }
      const deltaX = touch.deltaX
      const result = {
        transition: 'all .15s linear'
      }
      if (deltaX < singerDetailDomHalfWidth.value) {
        return Object.assign({}, result, {
          transform: 'translate3d(0, 0, 0)'
        })
      } else {
        return Object.assign({}, result, {
          transform: `translate3d(${singerDetailDomWidth.value}px, 0, 0)`
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
      onSingerDetailTouchMove,
      onSingerDetailTouchEnd,
      singerDetailStyle,
      singerDetailRef
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
