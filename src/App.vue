<template>
  <m-header></m-header>
  <tab></tab>
  <router-view :style="viewStyle" v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <router-view :style="viewStyle" name="user" v-slot="{ Component }">
    <transition appear name="slide">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
  <player />
  <m-footer></m-footer>
</template>

<script>
import Header from '@/components/header/header'
import Footer from '@/components/footer/footer'
import Tab from '@/components/tab/tab'
import Player from '@/components/player/player'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'App',
  components: {
    'm-header': Header,
    Tab,
    Player,
    'm-footer': Footer
  },
  setup() {
    const store = useStore()
    const playList = computed(() => store.getters.playList)

    const viewStyle = computed(() => {
      const bottom = playList.value.length ? '60px' : '20px'
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
