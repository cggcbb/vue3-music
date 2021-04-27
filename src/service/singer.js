import { get } from './base'

export const getSingerList = () => {
  return get('/api/getSingerList')
}
