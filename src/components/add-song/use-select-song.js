import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import useSearchHistory from '@/components/search/use-search-history'

export default function useSelectSong({ query }) {
  const messageRef = ref(null)

  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  // & 添加歌曲到播放列表, 成功后的提示信息
  const messageText = computed(() => {
    const currentSongVal = currentSong.value
    let songText = `${currentSongVal.singer}-${currentSongVal.name}`
    if (songText?.length > 10) {
      songText = songText.slice(0, 10) + '...'
    }
    return `" ${songText} " 已添加到播放列表`
  })

  // * hooks
  const { saveSearch } = useSearchHistory()

  // * methods
  const selectSongBySongList = ({ song }) => {
    addSong(song)
  }

  const selectSongBySuggest = song => {
    addSong(song)
    saveSearch(query.value.trim())
  }

  const addSong = song => {
    store.dispatch('addSong', song)
    showMessage()
  }

  function showMessage() {
    messageRef.value.show()
  }

  return {
    messageRef,
    messageText,
    selectSongBySongList,
    selectSongBySuggest,
    showMessage
  }
}
