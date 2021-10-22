// & 随机打乱数组元素
export const shuffle = source => {
  const arr = [...source]
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i)
    if (i !== j) {
      swap(arr, i, j)
    }
  }
  return arr
}

// & 获取最大值为max的随机整数
export const getRandomInt = max => {
  return Math.floor(Math.random() * (max + 1))
}

// & 交换数组两个下标位置的元素
export const swap = (arr, i, j) => {
  ;[arr[i], arr[j]] = [arr[j], arr[i]]
}

// & 格式化时间 -> mm:ss
export const formatTime = interval => {
  const _interval = interval | 0
  const minute = (((_interval / 60) | 0) + '').padStart(2, '0')
  const second = ((_interval % 60) + '').padStart(2, '0')
  return `${minute}:${second}`
}

// & 简易防抖函数
export const debounce = (cb, delay) => {
  let timer = null
  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      cb.apply(this, args)
    }, delay)
  }
}

export const sleep = delay => new Promise(resolve => setTimeout(resolve, delay))
