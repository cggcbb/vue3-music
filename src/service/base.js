import axios from 'axios'

const CODE_OK = 0
const baseURL = process.env.NODE_ENV === 'production' ? 'https://music.cggcbb.com/' : '/'

axios.defaults.baseURL = baseURL

export const get = (url, params) => {
  return axios
    .get(url, {
      params
    })
    .then(res => {
      const serverData = res.data
      if (serverData.code === CODE_OK) {
        return serverData.result
      }
    })
    .catch(e => {
      throw new Error(e)
    })
}

export const post = (url, data) => {
  return axios
    .post(url, data)
    .then(res => {
      const serverData = res.data
      if (serverData.code === CODE_OK) {
        return serverData.result
      }
    })
    .catch(e => {
      throw new Error(e)
    })
}
