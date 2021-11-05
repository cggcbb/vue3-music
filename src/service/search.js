import { get } from './base'

export const getHotKeys = () => {
  return get('/api/getHotKeys')
}

export const search = (query, page, showSinger) => {
  return get('/api/search', {
    query,
    page,
    showSinger
  })
}
