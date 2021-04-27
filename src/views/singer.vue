<template>
  <div>
    singer
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
export default {
  name: 'singer',
  data() {
    return {
      singers: []
    }
  },
  async created() {
    const result = await getSingerList()
    console.log(result)
  }
}
</script>

<style lang="scss" scoped></style>
