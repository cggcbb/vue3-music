import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom'

const relativeClass = 'g-relative'

const positionList = ['fixed', 'relative', 'absolute']

const prefix = '__directive__'

export default function createDirective(Component) {
  const name = `${prefix}${Component.name}`

  return {
    mounted(el, binding) {
      const app = createApp(Component)
      const instance = app.mount(document.createElement('div'))

      // * 将 instance 绑定在 el 的 __directive__ + Component name 的 key 对象上, 否者多个指令会覆盖 el.instance, 导致出错 (多套一层)
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

      if (message) {
        el[name].instance.setMessage(message)
      }

      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el)
      }
    }
  }

  function append(el) {
    const style = getComputedStyle(el)
    if (!positionList.includes(style.position)) {
      addClass(el, relativeClass)
    }
    el.appendChild(el[name].instance.$el)
  }

  function remove(el) {
    removeClass(el, relativeClass)
    el.removeChild(el[name].instance.$el)
  }
}
