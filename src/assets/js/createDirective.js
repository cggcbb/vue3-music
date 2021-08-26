import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom'

const relativeClass = 'g-relative'

const positionList = ['fixed', 'relative', 'absolute']

export default function createDirective(Component) {
  return {
    mounted(el, binding) {
      const app = createApp(Component)
      const instance = app.mount(document.createElement('div'))

      // * 将 instance 绑定在 el 的 Component name 的 key 上, 否者多个指令会覆盖 el.instance, 导致出错 (多套一层)
      const name = Component.name
      if (!el[name]) {
        el[name] = {}
      }
      el[name].instance = instance

      // * 添加文案
      const message = binding.arg
      if (message) {
        instance.setMessage(message)
      }

      if (binding.value) {
        append(el)
      }
    },
    updated(el, binding) {
      // * 修改文案
      const message = binding.arg

      const name = Component.name
      if (message) {
        el[name].instance.setMessage(message)
      }

      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el)
      }
    }
  }

  function append(el) {
    const name = Component.name

    const style = getComputedStyle(el)
    if (!positionList.includes(style.position)) {
      addClass(el, relativeClass)
    }
    el.appendChild(el[name].instance.$el)
  }

  function remove(el) {
    const name = Component.name

    removeClass(el, relativeClass)
    el.removeChild(el[name].instance.$el)
  }
}
