<template>
  <div
    class="singer-detail"
    @touchstart="onDetailTouchStart"
    @touchmove="onDetailTouchMove"
    @touchend="onDetailTouchEnd"
    :style="detailStyle"
    ref="detailRef"
  >
    <music-list
      :title="title"
      :pic="pic"
      :songs="songs"
      :loading="loading"
      :emptyText="emptyText"
    />
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { SINGER_KEY } from '@/assets/js/constant'
import createDetailComponent from '@/assets/js/createDetailComponent'

export default createDetailComponent({
  name: 'singer-detail',
  cacheKey: SINGER_KEY,
  fetch: getSingerDetail
})
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
