/**
 * file转data url
 * @param {File} blob 
 */
function toDataURL (blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      resolve(reader)
    })
    reader.addEventListener('error', err => {
      reject(err)
    })
    reader.readAsDataURL(blob)
  })
}

function fromDataURL (dataUrl, type) {
  return new Promise((resolve, reject) => {
    try {
      const data = dataUrl.split(',')[1]
      const mimePattern = /^data:(.*?)(;base64)?,/
      const mime = dataUrl.match(mimePattern)[1]
      const binStr = atob(data)
      const length = binStr.length
      const arr = new Uint8Array(length)
    
      for (var i = 0; i < length; i++) {
        arr[i] = binStr.charCodeAt(i)
      }
      resolve(new Blob([arr], { type: type || mime }))
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * file转图片
 * @param {File} blob 
 * @param {width, height} params 
 */
function toImage (blob, { width, height }) {
  return new Promise((resolve, reject) => {
    const image = new Image(width, height)
    const URL = webkitURL || URL
    const source = URL 
      ? URL.createObjectURL(blob)
      : toDataURL(blob)

    image.src = source
    image.addEventListener('load', () => {
      resolve(image)
      URL && URL.revokeObjectURL(source)
    })
    image.addEventListener('error', err => reject(err))
  })
}

function fromCanvas (canvas, { type = 'image/jpeg', quality = 0.8 }) {
  return new Promise(resolve => {
    canvas.toBlob(resolve, type, quality)
  })
}

export default {
  toDataURL,
  toImage,
  fromDataURL,
  fromCanvas
}
