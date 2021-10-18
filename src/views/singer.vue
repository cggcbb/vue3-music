<template>
  <div class="singer">
    <singer-list :data="singers" v-loading="!singers.length" @singerSelect="handleSingerSelect" />
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selecedSinger"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
import SingerList from '@/components/singer-list/singer-list'
import { ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { SINGER_KEY } from '@/assets/js/constant'
import storage from 'good-storage'

export default {
  name: 'singer',
  setup() {
    const singers = ref([])
    const selecedSinger = ref(null)
    const router = useRouter()

    onBeforeMount(async () => {
      // * 获取歌手列表数据
      const result = await getSingerList()
      singers.value = result.singers
    })

    const handleSingerSelect = singerItem => {
      selecedSinger.value = singerItem
      cacheSingerToSessionStorage(singerItem)
      router.push({
        path: `/singer/${singerItem.mid}`
      })
    }
    // & 缓存singer 至 sessionStorage  (页面刷新使用)
    const cacheSingerToSessionStorage = singer => {
      storage.session.set(SINGER_KEY, singer)
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
