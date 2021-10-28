<template>
  <div class="rank-detail">
    <music-list :songs="songs" :title="title" :pic="pic" :loading="loading" rank></music-list>
  </div>
</template>

<script>
import createDetailComponent from '@/assets/js/createDetailComponent'
import { getRankDetail } from '@/service/rank'
import { RANK_KEY } from '@/assets/js/constant'

export default createDetailComponent({
  name: 'rank-detail',
  cacheKey: RANK_KEY,
  fetch: getRankDetail
})
</script>

<style lang="scss" scoped>
.rank-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
