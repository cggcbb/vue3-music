//& 获取一个随机数值
const getRandomVal = (prefix = '') => {
  return prefix + (Math.random() + '').replace('0.', '')
}

//& 获取一个随机 uid
const getUid = () => {
  const t = new Date().getUTCMilliseconds()
  return '' + ((Math.round(2147483647 * Math.random()) * t) % 1e10)
}

module.exports = {
  getRandomVal,
  getUid
}
