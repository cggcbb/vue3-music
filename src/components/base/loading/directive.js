import { createApp } from 'vue'
import { addClass, removeClass } from '../../../assets/js/dom'
import Loading from './loading'

const relativeClass = 'g-relative'

const postionList = ['fixed', 'relative', 'absolute']

const loadingDirective = {
  mounted(el, binding) {
    const app = createApp(Loading)
    const instance = app.mount(document.createElement('div'))
    el.instance = instance
    if (binding.value) {
      append(el)
    }
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  }
}

function append(el) {
  const style = getComputedStyle(el)
  if (!postionList.includes(style.position)) {
    addClass(el, relativeClass)
  }
  el.appendChild(el.instance.$el)
}

function remove(el) {
  removeClass(el, relativeClass)
  el.removeChild(el.instance.$el)
}

export default loadingDirective
