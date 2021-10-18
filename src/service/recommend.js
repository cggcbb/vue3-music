import { get } from './base'

export const getRecommend = () => {
  return get('/api/getRecommend')
}

export const getAlbum = album => {
  return get('/api/getAlbum', {
    id: album.id
  })
}
