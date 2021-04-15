<template>
  <m-header></m-header>
  <router-view />
</template>

<script>
import Header from '@/components/header/header'

export default {
  name: 'App',
  components: {
    'm-header': Header
  }
}
</script>

<style lang="scss">
</style>
