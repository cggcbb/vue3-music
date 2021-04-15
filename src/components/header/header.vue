<template>
  <div class="header">
    <span class="icon"></span>
    <h1 class="text">Vue3-Music</h1>
  </div>
</template>

<script>
export default {
  name: 'm-header'
}
</script>

<style lang="scss" scoped>
  .header {
    height: 44px;
    text-align: center;
    color: $color-theme;
    font-size: 0;
    .icon {
      display: inline-block;
      vertical-align: top;
      margin-top: 6px;
      width: 30px;
      height: 32px;
      margin-right: 9px;
      background-image: url('../../assets/image/jay.png');
      background-size: 30px 32px;
      border-radius: 50%;
    }
    .text {
      display: inline-block;
      vertical-align: top;
      line-height: 44px;
      font-size: $font-size-large;
    }
    .mine {
      position: absolute;
      top: 0;
      right: 0;
      .icon-mine {
        display: block;
        padding: 12px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
  }
</style>
