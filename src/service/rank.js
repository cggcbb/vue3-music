import { get } from './base'

// & 获取排行榜数据
export const getRankList = () => {
  return get('/api/getRankList')
}

// & 获取排行榜详情
export const getRankDetail = rank => {
  return get('/api/getRankDetail', {
    id: rank.id,
    period: rank.period
  })
}
