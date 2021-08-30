<template>
  <m-header></m-header>
  <tab></tab>
  <router-view />
  <player />
</template>

<script>
import Header from '@/components/header/header'
import Tab from '@/components/tab/tab'
import Player from '@/components/player/player'

export default {
  name: 'App',
  components: {
    'm-header': Header,
    Tab,
    Player
  }
}
</script>

<style lang="scss" scoped></style>
