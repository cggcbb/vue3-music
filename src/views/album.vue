<template>
  <div
    class="album"
    @touchstart="onDetailTouchStart"
    @touchmove="onDetailTouchMove"
    @touchend="onDetailTouchEnd"
    :style="detailStyle"
    ref="detailRef"
  >
    <music-list :songs="songs" :title="title" :pic="pic" :loading="loading"></music-list>
  </div>
</template>

<script>
import createDetailComponent from '@/assets/js/createDetailComponent'
import { getAlbum } from '@/service/recommend'
import { ALBUM_KEY } from '@/assets/js/constant'

export default createDetailComponent({
  name: 'album',
  cacheKey: ALBUM_KEY,
  fetch: getAlbum
})
</script>

<style lang="scss" scoped>
.album {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
