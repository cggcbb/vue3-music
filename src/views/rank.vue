<template>
  <div class="rank-list" v-loading="loading">
    <scroll class="rank-list-content">
      <ul>
        <li class="item" v-for="item in rankList" :key="item.id" @click="selectRankItem(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.pic" />
          </div>
          <ul class="song-list">
            <li class="song" v-for="(song, index) in item.songList" :key="song.id">
              <span>{{ index + 1 }}. </span>
              <span>{{ song.songName }}-{{ song.singerName }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedRank"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>
import Scroll from '@/components/high-scroll'
import storage from 'good-storage'
import { getRankList } from '@/service/rank'
import { ref, onBeforeMount } from 'vue'
import { RANK_KEY } from '@/assets/js/constant'
import { useRouter } from 'vue-router'

export default {
  name: 'rank-list',
  components: {
    Scroll
  },
  setup() {
    const loading = ref(true)
    const rankList = ref([])
    const selectedRank = ref(null)

    const router = useRouter()

    onBeforeMount(async () => {
      // * 获取排行榜列表数据
      const result = await getRankList()
      rankList.value = result.rankList
      loading.value = false
    })

    const selectRankItem = rank => {
      selectedRank.value = rank
      cacheRank(rank)
      router.push({
        path: `/rank/${rank.id}`
      })
    }

    const cacheRank = rank => {
      storage.session.set(RANK_KEY, rank)
    }

    return {
      loading,
      rankList,
      selectedRank,
      selectRankItem
    }
  }
}
</script>

<style lang="scss" scoped>
.rank-list {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .rank-list-content {
    height: 100%;
    overflow: hidden;
    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;
      &:last-child {
        padding-bottom: 20px;
      }
      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }
      .song-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small;
        .song {
          @include no-wrap();
          line-height: 26px;
        }
      }
    }
  }
}
</style>
