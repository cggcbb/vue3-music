<template>
  <div class="singer">
    <singer-list :data="singers" v-loading="!singers.length" />
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
import SingerList from '@/components/singer-list/singer-list'
import { ref, onBeforeMount } from 'vue'

export default {
  name: 'singer',
  setup() {
    const singers = ref([])

    onBeforeMount(async () => {
      //* 获取歌手列表数据
      const result = await getSingerList()
      singers.value = result.singers
    })

    return {
      singers
    }
  },
  components: {
    SingerList
  }
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
