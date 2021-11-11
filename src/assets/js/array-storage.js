import storage from 'good-storage'

export const save = (key, item, compareFn, maxLength) => {
  const items = loadStorage(key)
  insertArray(items, item, compareFn, maxLength)
  storage.set(key, items)
  return items
}

export const remove = (key, compareFn) => {
  const items = loadStorage(key)
  deleteFromArray(items, compareFn)
  storage.set(key, items)
  return items
}

export const clear = key => {
  storage.remove(key)
  return []
}

export const insertArray = (arr, value, compareFn, maxLength) => {
  const index = arr.findIndex(compareFn)
  // * 在队首
  if (index === 0) {
    return
  }
  if (index > 0) {
    // * 存在并且不在队首, 先删除
    arr.splice(index, 1)
  }
  arr.unshift(value)
  if (maxLength && arr.length > maxLength) {
    arr.pop()
  }
}

export const deleteFromArray = (arr, compareFn) => {
  const index = arr.findIndex(compareFn)
  if (~index) {
    arr.splice(index, 1)
  }
}

export const loadStorage = key => storage.get(key, [])
