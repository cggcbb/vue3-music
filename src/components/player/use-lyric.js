import { useStore } from 'vuex'
import { computed, watch } from 'vue'
import { getSongLyric } from '@/service/song'
import { decode } from 'js-base64'

export default function useLyric() {
  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  watch(currentSong, async newSong => {
    if (!newSong.url || !newSong.id) {
      return
    }

    const lyric = await getSongLyric(newSong)

    console.log(decode(lyric))
  })
}
