import { get } from './base'

export const getSingerList = () => {
  return get('/api/getSingerList')
}

export const getSingerDetail = singer => {
  return get('/api/getSingerDetail', {
    mid: singer.mid
  })
}
