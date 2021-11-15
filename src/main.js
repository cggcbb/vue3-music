import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lazyPlugin from 'vue3-lazy'
import loadingDirective from '@/components/base/loading/directive'
import emptyDirective from '@/components/base/empty/directive'

//* 引入全局样式文件
import '@/assets/scss/index.scss'

createApp(App)
  .use(store)
  .use(router)
  .use(lazyPlugin, {
    loading: require('@/assets/image/jay.jpg')
  })
  .directive('loading', loadingDirective)
  .directive('empty', emptyDirective)
  .mount('#app')
