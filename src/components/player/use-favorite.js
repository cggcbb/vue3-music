import { useStore } from 'vuex'
import { computed } from 'vue'
import { save, remove } from '@/assets/js/array-storage'
import { FAVORITE_KEY } from '@/assets/js/constant'
import { SET_FAVORITE_LIST } from '@/store/mutation-types'

const FAVORITE_LIST_MAX_LENGTH = 100

export default function useFavorite() {
  const store = useStore()

  const favoriteList = computed(() => store.getters.favoriteList)

  const getFavoriteIcon = song => {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  // & 歌曲收藏切换, 未收藏, 则添加, 已收藏,则删除
  const toggleFavorite = song => {
    let list = null
    if (isFavorite(song)) {
      list = remove(FAVORITE_KEY, compareFn)
    } else {
      list = save(FAVORITE_KEY, song, compareFn, FAVORITE_LIST_MAX_LENGTH)
    }
    store.commit(SET_FAVORITE_LIST, list)

    // * 查询对比函数
    function compareFn(item) {
      return item.id === song.id
    }
  }

  // & 根据 song.id 比对, 查询该歌曲是否已收藏
  const isFavorite = song => {
    return ~favoriteList.value.findIndex(item => item.id === song.id)
  }

  return {
    getFavoriteIcon,
    toggleFavorite
  }
}
