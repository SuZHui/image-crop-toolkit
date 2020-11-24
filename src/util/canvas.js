function toDataURL (canvas, quality = 0.8, type = 'image/jpeg') {
  return new Promise(resolve => {
    resolve(canvas.toDataURL(type, quality))
  })
}

export default {
  toDataURL
}