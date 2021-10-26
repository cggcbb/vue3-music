import { get } from './base'

// & 获取排行榜数据
export const getRankList = () => {
  return get('/api/getRankList')
}
