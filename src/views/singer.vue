<template>
  <div class="singer">
    <singer-list :data="singers" v-loading="!singers.length" @singerSelect="handleSingerSelect" />
    <router-view :singer="selecedSinger"></router-view>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
import SingerList from '@/components/singer-list/singer-list'
import { ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'singer',
  setup() {
    const singers = ref([])
    const selecedSinger = ref(null)
    const router = useRouter()

    onBeforeMount(async () => {
      //* 获取歌手列表数据
      const result = await getSingerList()
      singers.value = result.singers
    })

    const handleSingerSelect = singerItem => {
      selecedSinger.value = singerItem
      router.push({
        path: `/singer/${singerItem.mid}`
      })
    }

    return {
      singers,
      selecedSinger,
      handleSingerSelect
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
