import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom'
import Loading from './loading'

const relativeClass = 'g-relative'

const positionList = ['fixed', 'relative', 'absolute']

const loadingDirective = {
  mounted(el, binding) {
    const app = createApp(Loading)
    const instance = app.mount(document.createElement('div'))
    el.instance = instance

    // 添加loading 文案
    const loadingMessage = binding.arg
    if (loadingMessage) {
      instance.setMessage(loadingMessage)
    }

    if (binding.value) {
      append(el)
    }
  },
  updated(el, binding) {
    //* 修改loading 文案
    const loadingMessage = binding.arg
    if (loadingMessage) {
      el.instance.setMessage(loadingMessage)
    }

    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  }
}

const append = el => {
  const style = getComputedStyle(el)
  if (!positionList.includes(style.position)) {
    addClass(el, relativeClass)
  }
  el.appendChild(el.instance.$el)
}

const remove = el => {
  removeClass(el, relativeClass)
  el.removeChild(el.instance.$el)
}

export default loadingDirective
