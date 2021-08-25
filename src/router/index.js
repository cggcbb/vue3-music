import { createRouter, createWebHistory } from 'vue-router'

const Recommend = () => import(/* webpackChunkName: "recommend" */ '@/views/recommend')
const Singer = () => import(/* webpackChunkName: "singer" */ '@/views/singer')
const Rank = () => import(/* webpackChunkName: "rank" */ '@/views/rank')
const Search = () => import(/* webpackChunkName: "search" */ '@/views/search')
const SingerDetail = () => import(/* webpackChunkName: "singerDetail" */ '@/views/singer-detail')

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend
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
    component: Rank
  },
  {
    path: '/search',
    component: Search
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
