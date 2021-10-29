import { get } from './base'

export const getHotKeys = () => {
  return get('/api/getHotKeys')
}
