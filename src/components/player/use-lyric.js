import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { getSongLyric } from '@/service/song'
import { LYRIC_KEY } from '@/assets/js/constant'
import { encode } from 'js-base64'
import Lyric from 'lyric-parser'
import storage from 'good-storage'

export default function useLyric({ songReady, updateTime }) {
  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  const currentLyric = ref(null)
  const currentLineNum = ref(null)
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)
  const pureMusicLyric = ref('')
  const playingLyric = ref('')

  watch(currentSong, async newSong => {
    if (!newSong.url || !newSong.id) {
      return
    }
    // * 先清理上一首歌歌词相关部分
    clearLyric()

    // * 异步获取歌词
    const lyric = await getSongLyric(newSong)

    // * 缓存歌词
    const lyricStorage = storage.get(LYRIC_KEY, {})
    const songStorageLyric = lyricStorage[currentSong.value.mid]

    // * 获取歌词是个异步过程, 当切换歌曲的时候, 获取到的, 可能不是当前播放歌曲的歌词
    // * 缓存歌词是base64编码的, 这里encode一下
    if (songStorageLyric && songStorageLyric?.slice(0, 30) !== encode(lyric).slice(0, 30)) {
      return
    }

    // * 初始化lyric parser
    currentLyric.value = new Lyric(lyric, handleLyric)
    if (hasLyric()) {
      if (songReady.value) {
        playLyric()
      }
    } else {
      playingLyric.value = pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
    }
  })

  const handleLyric = ({ lineNum, txt }) => {
    currentLineNum.value = lineNum
    playingLyric.value = txt

    const scrollComponent = lyricScrollRef.value
    const listElement = lyricListRef.value
    if (!listElement) {
      return
    }
    if (lineNum > 5) {
      const lineElement = listElement.children[lineNum - 5]
      scrollComponent.scroll.scrollToElement(lineElement, 1000)
    } else {
      scrollComponent.scroll.scrollTo(0, 0, 1000)
    }
  }

  const playLyric = () => {
    const currentLyricVal = currentLyric.value
    currentLyricVal && currentLyricVal.seek(updateTime.value * 1000)
  }

  const stopLyric = () => {
    const currentLyricVal = currentLyric.value
    currentLyricVal && currentLyricVal.stop()
  }

  const clearLyric = () => {
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = 0
    pureMusicLyric.value = ''
    playingLyric.value = ''
  }

  const hasLyric = () => {
    return currentLyric.value?.lines?.length
  }

  return {
    lyricScrollRef,
    lyricListRef,
    currentLyric,
    currentLineNum,
    playLyric,
    stopLyric,
    pureMusicLyric,
    playingLyric
  }
}
