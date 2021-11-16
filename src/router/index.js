import { createRouter, createWebHashHistory } from 'vue-router'

const Recommend = () => import(/* webpackChunkName: "recommend" */ '@/views/recommend')
const Singer = () => import(/* webpackChunkName: "singer" */ '@/views/singer')
const Rank = () => import(/* webpackChunkName: "rank" */ '@/views/rank')
const Search = () => import(/* webpackChunkName: "search" */ '@/views/search')
const SingerDetail = () => import(/* webpackChunkName: "singerDetail" */ '@/views/singer-detail')
const Album = () => import(/* webpackChunkName: "album" */ '@/views/album')
const rankDetail = () => import(/* webpackChunkName: "rank-detail" */ '@/views/rank-detail')
const UserCenter = () => import(/* webpackChunkName: "user-center" */ '@/views/user-center')

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Album
      }
    ]
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: ':mid',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/rank',
    component: Rank,
    children: [
      {
        path: ':id',
        component: rankDetail
      }
    ]
  },
  {
    path: '/search',
    component: Search,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/user',
    components: {
      user: UserCenter
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
