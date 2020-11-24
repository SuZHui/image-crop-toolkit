function fromURL (url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => {
      resolve(image)
    })
    image.addEventListener('error', err => reject(err))
    image.src = url
    image.setAttribute('crossOrigin','anonymous')
  })
}

function fromDataURL (dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => {
      resolve(image)
    })
    image.addEventListener('error', err => reject(err))
    image.src = dataUrl
  })
}

function toCanvas (image) {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    resolve(canvas)
  })
}

export default {
  fromURL,
  fromDataURL,
  toCanvas
}
