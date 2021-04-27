const colors = ['#ff0000', '#00ffff', '#ffcd32', '#00ffb8', '#00e7ff', '#ff00f7']

export default function getRandomColorsList(length) {
  const result = []
  for (let i = 0; i < length; i++) {
    const random = Math.floor(Math.random() * colors.length)
    result.push(colors[random])
  }
  return result
}
