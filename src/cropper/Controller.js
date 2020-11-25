import { setStyle, moveable } from "../util/dom"

export class Controller {
  $cropper = null
  $el = {
    wrapper: null,
    modal: null,
    cropBox: null,
    cropFace: null
  }
  $position = {
    x: 0, y: 0
  }

  constructor (container) {
    this.$cropper = container
    console.dir(container)
    this._init()
  }

  _init() {
    this.$el.wrapper = document.createElement('div')
    this.$el.modal = document.createElement('div')
    this.$el.cropBox = document.createElement('div')
    this.$el.cropFace = document.createElement('span')

    this._initStyle()
    this._mountEvent()

    this.$el.cropBox
      .append(this.$el.cropFace)
    this.$el.wrapper
      .append(this.$el.modal, this.$el.cropBox)
  }

  _initStyle () {
    setStyle(this.$el.wrapper, {
      overflow: 'hidden',
      width: '100%',
      height: '100%',
      position: 'relative',
    })
    setStyle(this.$el.modal, {
      backgroundColor: '#000',
      opacity: 0.5,
      position: 'absolute',
      top: 0, right: 0, bottom: 0, left: 0
    })
    this.$el.cropBox
      .classList.add('crop-box')
    setStyle(this.$el.cropBox, {
      willChange: 'transform',
      position: 'absolute',
      top: 0, right: 0, bottom: 0, left: 0
    })
    setStyle(this.$el.cropFace, {
      backgroundColor: '#fff',
      left: 0,
      top: 0,
      cursor: 'move',
      display: 'block',
      opacity: 0.1,
      width: '100%',
      height: '100%'
    })
  }

  _mountEvent () {
    moveable(this.$el.cropBox, {
      onStart: (e) => {},
      onMove: e => {
        this.setCropPosition({
          x: this.$position.x + e.x,
          y: this.$position.y + e.y
        }, false)
      },
      onEnd: e => {
        this.setCropPosition({
          x: this.$position.x + e.x,
          y: this.$position.y + e.y
        })
      }
    }, this.$cropper.$container)
  }

  /**
   * Method
   */
  getElement () {
    return this.$el.wrapper 
  }

  setCropSize ({ width = 0, height = 0 }) {
    setStyle(this.$el.cropBox, {
      width: `${width}px`, height: `${height}px`
    })
  }

  /**
   *
   * @param {*} param0 
   * @param {boolean} cachePosition 是否记录当前位置
   */
  setCropPosition ({ x = 0, y = 0 }, recordPosition = true) {
    recordPosition && (this.$position = { x, y })
    setStyle(this.$el.cropBox, {
      transform: `translate3d(${x}px, ${y}px, 0px)`
    })
  }
  // 设置裁切框居中
  setCropBoxCenter () {
    // 默认缩小为视口的0.8
    const { preview, $rect } = this.$cropper
    const imageRect = preview.getImageRect()

    const cropSize = {
      width: imageRect.cWidth * 0.8,
      height: imageRect.cHeight * 0.8
    }
    const position = {
      x: ($rect.width - cropSize.width) / 2,
      y: ($rect.height - cropSize.height) / 2
    }
    this.setCropSize(cropSize)
    this.setCropPosition(position)
  }
}