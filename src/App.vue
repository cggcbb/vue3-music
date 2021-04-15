<template>
  <m-header></m-header>
  <tab></tab>
  <router-view />
</template>

<script>
import Header from '@/components/header/header'
import Tab from '@/components/tab/tab'

export default {
  name: 'App',
  components: {
    'm-header': Header,
    Tab
  }
}
</script>

<style lang="scss" scoped>
</style>
