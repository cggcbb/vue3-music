import { useStore } from 'vuex'
import { PLAY_KEY } from '@/assets/js/constant'
import { save } from '@/assets/js/array-storage'
import { SET_PLAY_HISTORY } from '@/store/mutation-types'

export default function usePlayHistory() {
  const store = useStore()

  const maxLen = 200

  const savePlayHistory = song => {
    const songs = save(
      PLAY_KEY,
      song,
      item => {
        return item.id === song.id
      },
      maxLen
    )

    store.commit(SET_PLAY_HISTORY, songs)
  }

  return {
    savePlayHistory
  }
}
