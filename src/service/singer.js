import { get } from './base'

export const getSinger = () => {
  return get('/api/getSinger')
}
