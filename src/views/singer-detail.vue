<template>
  <div class="singer-detail"></div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { processSongPureUrl } from '@/service/song'
export default {
  name: 'singer-detail',
  props: {
    singer: {
      type: Object,
      default: () => {}
    }
  },
  async setup(props) {
    const result = await getSingerDetail(props.singer)
    const songs = await processSongPureUrl(result.songs)

    console.log(songs)
  }
}
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
