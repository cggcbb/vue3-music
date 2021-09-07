import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { getSongLyric } from '@/service/song'
import { LYRIC_KEY } from '@/assets/js/constant'
import { encode } from 'js-base64'
import Lyric from 'lyric-parser'
import storage from 'good-storage'

export default function useLyric() {
  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  const currentLyric = ref(null)
  const currentLineNum = ref(null)

  watch(currentSong, async newSong => {
    if (!newSong.url || !newSong.id) {
      return
    }
    const lyric = await getSongLyric(newSong)

    // * 缓存歌词
    const lyricStorage = storage.get(LYRIC_KEY, {})
    const songStorageLyric = lyricStorage[currentSong.value.mid]

    // * 获取歌词是个异步过程, 当切换歌曲的时候, 获取到的, 可能不是当前播放歌曲的歌词
    // * 缓存歌词是base64编码的, 这里encode一下
    if (songStorageLyric?.slice(0, 30) !== encode(lyric).slice(0, 30)) {
      return
    }

    // * 初始化lyric parser
    currentLyric.value = new Lyric(lyric, handleLyric)
  })

  const handleLyric = ({ lineNum }) => {
    currentLineNum.value = lineNum
  }

  return {
    currentLyric,
    currentLineNum
  }
}
