<template>
  <m-header></m-header>
  <tab></tab>
  <router-view :style="viewStyle" />
  <player />
</template>

<script>
import Header from '@/components/header/header'
import Tab from '@/components/tab/tab'
import Player from '@/components/player/player'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'App',
  components: {
    'm-header': Header,
    Tab,
    Player
  },
  setup() {
    const store = useStore()
    const playList = computed(() => store.getters.playList)

    const viewStyle = computed(() => {
      const bottom = playList.value.length ? '60px' : '0'
      return {
        bottom
      }
    })

    return {
      viewStyle
    }
  }
}
</script>

<style lang="scss" scoped></style>
