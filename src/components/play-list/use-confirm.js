import { ref } from 'vue'
import { useStore } from 'vuex'

export default function useConfirm({ hide }) {
  const confirmRef = ref(null)
  const store = useStore()

  const showConfirm = () => {
    confirmRef.value.show()
  }

  const confirmClear = () => {
    store.dispatch('clearSongList')
    hide()
  }

  return {
    confirmRef,
    showConfirm,
    confirmClear
  }
}
