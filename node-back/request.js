const token = require('./common')
const axios = require('axios')

//* 公共参数
const commonParams = {
  g_tk: token,
  loginUin: 0,
  hostUin: 0,
  inCharset: 'utf8',
  outCharset: 'utf-8',
  notice: 0,
  needNewCode: 0,
  format: 'json',
  platform: 'yqq.json'
}

//& 对 request get 请求的封装
//& 修改请求的 headers 值，合并公共请求参数
const get = (url, params) => {
  return axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/',
      origin: 'https://y.qq.com/'
    },
    params: Object.assign({}, commonParams, params)
  })
}

//& 对 request post 请求的封装
//& 修改请求的 headers 值
const post = (url, data) => {
  return axios.post(url, data, {
    headers: {
      referer: 'https://y.qq.com/',
      origin: 'https://y.qq.com/',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

module.exports = {
  get,
  post
}
