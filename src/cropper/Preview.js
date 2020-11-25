import { setStyle } from '../util/dom'
import { CROPPER_EVENT } from './constants'

export class Preview {
  $cropper = null
  $el = {
    wrapper: null,
    image: null
  }

  $rect = {
    image: {
      width: 0,
      height: 0
    }
  }

  $transform = {
    scale: 1,
  }

  url = null

  constructor (crooper) {
    this.$cropper = crooper
    this._init()
  }

  _init () {
    this.$el.wrapper = document.createElement('div')
    this.$el.image = new Image()
    this.$el.wrapper
      .append(this.$el.image)

    this._initStyle()
    this._mountEvent()
  }

  _initStyle () {
    setStyle(this.$el.wrapper, {
      backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC")',
      overflow: 'hidden',
      position: 'absolute',
      top: 0, right: 0, bottom: 0, left: 0
    })

    setStyle(this.$el.image, {
      position: 'absolute',
      webkitUserDrag: 'none'
    })
  }
  // 挂载事件
  _mountEvent () {
    this.$cropper.on(CROPPER_EVENT.SIZE_CHANGE, this.onWrapperSizeChange.bind(this))
    this.$cropper.on(CROPPER_EVENT.WHEEL, this.onPreviewZoom.bind(this))

    const image = this.$el.image
    this.onImageLoad = this.onImageLoad.bind(this)
    this.onImageError = this.onImageError.bind(this)
    image.addEventListener('load', this.onImageLoad)
    image.addEventListener('error', this.onImageError)
  }

  // internal event
  onWrapperSizeChange () {
    this.fullDisplayImage()
  }

  onImageLoad () {
    const [nw, nh] = [this.$el.image.naturalWidth, this.$el.image.naturalHeight]
    this.$rect.image = { width: nw, height: nh }
    this.$el.image.width = nw
    this.$el.image.height = nh

    this.fullDisplayImage()

    this.$cropper.emit(CROPPER_EVENT.PREVIEW_LOAD)
  }

  onImageError (err) {
    console.error(err)
  }

  onPreviewZoom (e) {
    const ratio = 0.1
    let delta = 1
    e.preventDefault()

    // 限制滚轮速度防止缩放过快
    if (this.wheeling) return

    this.wheeling = true

    setTimeout(() => {
      this.wheeling = false
    }, 50)

    if (e.deltaY) {
      delta = e.deltaY > 0 ? 1 : -1;
    } else if (e.wheelDelta) {
      delta = -e.wheelDelta / 120;
    } else if (e.detail) {
      delta = e.detail > 0 ? 1 : -1;
    }
    this.zoom(-delta * ratio)
  }

  // internal method
  fullDisplayImage () {
    const imageRect = this.$rect.image
    const wrapperRect = this.$cropper.$rect
    // 完整显示图片
    const scaleRatio = Math.min(
      wrapperRect.width/imageRect.width,
      wrapperRect.height/imageRect.height
    )

    this.$transform.scale = scaleRatio
    setStyle(this.$el.image, {
      left: `${(wrapperRect.width - imageRect.width)/2}px`,
      top: `${(wrapperRect.height - imageRect.height)/2}px`,
      transform: `scale(${scaleRatio})`
    })
  }

  /**
   * Methods
   */

  getElement () {
    return this.$el.wrapper
  }

  getImageRect () {
    const { scale } = this.$transform

    return {
      nWidth: this.$rect.image.width,
      nHeight: this.$rect.image.height,
      cWidth: this.$rect.image.width * scale,
      cHeight: this.$rect.image.height * scale
    }
  }

  setURL (url) {
    this.url = url
    this.$el.image.src = url
  }
  // 缩放
  zoom (ratio) {
    this.$transform.scale = this.$transform.scale * (1 + ratio)
    setStyle(this.$el.image, {
      transform: `scale(${this.$transform.scale})`
    })
  }
}