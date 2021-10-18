import { processSongPureUrl } from '@/service/song'
import { ref, computed, onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MusicList from '@/components/music-list/music-list'
import storage from 'good-storage'

export default function createDetailComponent({ name, cacheKey, fetch }) {
  return {
    name,
    props: {
      data: {
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
      const pureData = ref({})
      const route = useRoute()
      const router = useRouter()
      const touch = {}
      const detailStyle = ref({})
      const detailRef = ref(null)

      onBeforeMount(async () => {
        const _computedData = computedData()
        if (!_computedData) {
          return router.back()
        }
        pureData.value = _computedData
        const result = await fetch(pureData.value)
        songs.value = await processSongPureUrl(result.songs)
        loading.value = false
      })

      // * 如果props传入Data对象, 就取props.data, 否者尝试取sessionStorage里面Data
      const computedData = () => {
        const propData = props.data
        if (propData) {
          return propData
        } else {
          // ! 歌曲有mid, 无id, album有id, 无mid
          const mid = route.params?.mid || route.params?.id
          const cacheData = storage.session.get(cacheKey)
          // ! 这里做了歌曲和album的兼容处理
          if (cacheData && (cacheData.mid || cacheData.id + '') === mid) {
            return cacheData
          }
          return null
        }
      }

      // * 顶部展示的title
      const title = computed(() => {
        const pureDataVal = pureData.value
        return pureDataVal?.name || pureDataVal?.title
      })

      // * 背景图片
      const pic = computed(() => pureData.value?.pic)

      const emptyText = computed(() => {
        return `抱歉，暂未搜索到 "${pureData.value.name}" 相关的歌曲`
      })

      //* 屏幕宽度
      const detailDomWidth = computed(() => detailRef.value?.clientWidth)
      //* 屏幕宽度一半
      const detailDomHalfWidth = computed(() => detailDomWidth.value / 2)

      // & touchstart 记录点击时 横坐标和点击时间
      const onDetailTouchStart = e => {
        touch.x = e.touches[0].pageX
        touch.startTime = +new Date()
      }

      // & touchMove 当从最左边30px之内开始按住, 能触发滑动效果
      const onDetailTouchMove = e => {
        const x1 = touch.x
        const deltaX = Math.min(Math.max(e.touches[0].pageX - x1, 0), detailDomWidth.value)
        touch.deltaX = deltaX
        if (x1 <= 30) {
          detailStyle.value = {
            transform: `translate3d(${deltaX}px, 0, 0)`
          }
        }
      }

      // & touchend的时候, 实现详情页面短时间 (600ms 滑动了 160 像素) 向右滑动, 就跳到歌手页面
      // & 如果从最左边30px之内开始按住, 并且没有滑动到屏幕的一半距离, 则还原, 超出直接隐藏, 并跳转到歌手页面
      const onDetailTouchEnd = e => {
        if (touch.x > 30) {
          const deltaTime = +new Date() - touch.startTime
          if (deltaTime <= 600 && touch.deltaX >= 160) {
            detailStyle.value = createTouchEndDetailStyle(false)
            router.back()
          }
          return
        }
        detailStyle.value = createTouchEndDetailStyle()
        if (touch.deltaX >= detailDomHalfWidth.value) {
          router.back()
        }
      }
      // & 获取touchend的时候, 此时 DataDetail 该有的style
      const createTouchEndDetailStyle = (isSlide = true) => {
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
        if (deltaX < detailDomHalfWidth.value) {
          return Object.assign({}, result, {
            transform: 'translate3d(0, 0, 0)'
          })
        } else {
          return Object.assign({}, result, {
            transform: `translate3d(${detailDomWidth.value}px, 0, 0)`
          })
        }
      }

      return {
        title,
        pic,
        songs,
        loading,
        emptyText,
        onDetailTouchStart,
        onDetailTouchMove,
        onDetailTouchEnd,
        detailStyle,
        detailRef
      }
    }
  }
}
