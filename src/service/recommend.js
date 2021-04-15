import { get } from './base'

export const getRecommend = () => {
  return get('/api/getRecommend')
}
