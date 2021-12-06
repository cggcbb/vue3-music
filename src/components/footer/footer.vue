<template>
  <div class="footer">
    <a href="https://beian.miit.gov.cn/" target="__blank">蜀ICP备20001332号-1</a>
  </div>
</template>

<script>
export default {
  name: 'm-footer'
}
</script>

<style lang="scss" scoped>
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 12px;
  padding: 4px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  a {
    color: $color-text-d;
    font-size: 12px;
  }
}
</style>
