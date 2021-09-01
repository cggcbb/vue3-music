import { useStore } from 'vuex'

export default function usePlay(props) {
  const store = useStore()

  // & 点击单首歌曲, dispatch 'selectPlay' action
  const handleSelectSongItem = ({ song, index }) => {
    store.dispatch('selectPlay', {
      list: props.songs,
      song,
      index
    })
  }

  // & 点击随机播放按钮 dispatch 'randomPlay' action
  const handleRandomPlay = () => {
    store.dispatch('randomPlay', props.songs)
  }

  return {
    handleSelectSongItem,
    handleRandomPlay
  }
}
