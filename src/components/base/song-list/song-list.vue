<template>
  <ul class="song-list">
    <li
      class="item"
      v-for="(song, index) in songs"
      :key="song.id"
      @click="selectSongItem(song, index)"
    >
      <div class="rank" v-if="rank">
        <span :class="getRankClass(index)">{{ getRankText(index) }}</span>
      </div>
      <div class="content">
        <h2 class="name">{{ song.name }}</h2>
        <p class="desc">{{ getDesc(song) }}</p>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'song-list',
  emits: ['selectSongItem'],
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    rank: Boolean
  },
  setup(props, { emit }) {
    const getDesc = song => {
      return `${song.singer} · ${song.album}`
    }

    const selectSongItem = (song, index) => {
      emit('selectSongItem', { song, index })
    }

    // & 图标样式
    const getRankClass = index => {
      if (index <= 2) {
        return `icon icon-${index}`
      } else {
        return 'text'
      }
    }

    const getRankText = index => {
      if (index > 2) {
        return index + 1
      }
    }

    return {
      getDesc,
      selectSongItem,
      getRankClass,
      getRankText
    }
  }
}
</script>

<style lang="scss" scoped>
.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;
    .rank {
      flex: 0 0 25px;
      width: 25px;
      margin-right: 20px;
      text-align: center;
      .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;
        &.icon-0 {
          @include bg-image('first');
        }
        &.icon-1 {
          @include bg-image('second');
        }
        &.icon-2 {
          @include bg-image('third');
        }
      }
      .text {
        color: $color-theme;
        font-size: $font-size-large;
      }
    }
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        @include no-wrap();
        color: $color-text;
      }
      .desc {
        @include no-wrap();
        margin-top: 4px;
        color: $color-text-d;
      }
    }
  }
}
</style>
