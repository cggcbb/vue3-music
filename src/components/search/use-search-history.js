import { save, remove, clear } from '@/assets/js/array-storage'
import { SEARCH_KEY } from '@/assets/js/constant'
import { useStore } from 'vuex'
import { SET_SEARCH_HISTORY } from '@/store/mutation-types'

export default function useSearchHistory() {
  const maxLen = 200

  const store = useStore()

  const saveSearch = query => {
    const searches = save(
      SEARCH_KEY,
      query,
      item => {
        return item === query
      },
      maxLen
    )
    store.commit(SET_SEARCH_HISTORY, searches)
  }

  const deleteSearch = query => {
    const searches = remove(SEARCH_KEY, item => {
      return item === query
    })
    store.commit(SET_SEARCH_HISTORY, searches)
  }

  const clearSearch = () => {
    const searches = clear(SEARCH_KEY)
    store.commit(SET_SEARCH_HISTORY, searches)
  }

  return {
    saveSearch,
    deleteSearch,
    clearSearch
  }
}
