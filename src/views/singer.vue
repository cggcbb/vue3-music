<template>
  <div>
    singer
  </div>
</template>

<script>
import { getSinger } from '@/service/singer'
export default {
  name: 'singer',
  data() {
    return {
      singers: []
    }
  },
  async created() {
    const result = await getSinger()
    console.log(result)
  }
}
</script>

<style lang="scss" scoped></style>
