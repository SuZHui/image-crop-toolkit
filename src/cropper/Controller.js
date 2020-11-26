import { setStyle, moveable } from '../util/dom'
import { CROPPER_EVENT } from './constants'

export class Controller {
  $cropper = null
  $el = {
    wrapper: null,
    cropBox: null,
    cropFace: null,
    // 剪切的边框
    cropLineTop: null,
    cropLineBottom: null,
    cropLineLeft: null, 
    cropLineRight: null
  }
  $position = {
    x: 0, y: 0
  }
  $rect = {
    cropBox: { width: 0, height: 0 }
  }

  constructor (container) {
    this.$cropper = container
    this._init()
  }

  _init() {
    this._initDom()
    this._mountEvent()
    this._mountDom()
  }

  _initDom () {
    this.$el.wrapper = document.createElement('div')

    this.$el.cropBox = document.createElement('div')
    this.$el.cropBox.classList.add('crop-box')

    this.$el.cropFace = document.createElement('span')

    this.$el.cropLineTop = document.createElement('span')
    this.$el.cropLineTop.classList.add('crop-line', 'line-top')

    this.$el.cropLineLeft = document.createElement('span')
    this.$el.cropLineLeft.classList.add('crop-line', 'line-left')

    this.$el.cropLineBottom = document.createElement('span')
    this.$el.cropLineBottom.classList.add('crop-line', 'line-bottom')

    this.$el.cropLineRight = document.createElement('span')
    this.$el.cropLineRight.classList.add('crop-line', 'line-right')

    this._initStyle()
  }

  _mountDom () {
    this.$el.cropBox
      .append(
        this.$el.cropFace,
        this.$el.cropLineTop,
        this.$el.cropLineLeft,
        this.$el.cropLineBottom,
        this.$el.cropLineRight,
      )
    this.$el.wrapper
      .append(this.$el.cropBox)
  }

  _initStyle () {
    setStyle(this.$el.wrapper, {
      overflow: 'hidden',
      width: '100%',
      height: '100%',
      position: 'relative',
    })
    setStyle(this.$el.cropBox, {
      willChange: 'transform',
      position: 'absolute',
      top: 0, right: 0, bottom: 0, left: 0,
      outline: `${Math.max(this.$cropper.$rect.width, this.$cropper.$rect.height)}px solid rgba(0,0,0,0.5)`
    })
    setStyle(this.$el.cropFace, {
      left: 0,
      top: 0,
      cursor: 'move',
      display: 'block',
      width: '100%',
      height: '100%'
    })
    
    const commonLineStyles = {
      backgroundColor: '#39f',
      display: 'block',
      height: '100%',
      opacity: 0.1,
      position: 'absolute',
      width: '100%'
    }
    // 线宽
    const lineWeight = '5px'
    
    setStyle(this.$el.cropLineTop, {
      ...commonLineStyles,
      cursor: 'ns-resize',
      height: lineWeight,
      left: 0,
      top: '-3px'
    })
    setStyle(this.$el.cropLineLeft, {
      ...commonLineStyles,
      cursor: 'ew-resize',
      left: '-3px',
      top: 0,
      width: lineWeight
    })
    setStyle(this.$el.cropLineBottom, {
      ...commonLineStyles,
      bottom: '-3px',
      cursor: 'ns-resize',
      height: '5px',
      left: 0
    })
    setStyle(this.$el.cropLineRight, {
      ...commonLineStyles,
      cursor: 'ew-resize',
      right: '-3px',
      top: 0,
      width: '5px'
    })
  }

  _mountEvent () {
    const cancel = moveable(this.$el.cropBox, {
      onMove: e => {
        let [x, y] = [this.$position.x - e.x, this.$position.y - e.y]
        this.setCropPosition(
          this._toSafePosition({ left: x, top: y }),
          false)
      },
      onEnd: e => {
        this.setCropPosition(
          this._toSafePosition({
            left: this.$position.x - e.x,
            top: this.$position.y - e.y
          })
        )
      },
      onStart () {
        console.log('move')
      }
    }, this.$cropper.$container)

    const cancelCropLineEvent = this._addCropLineEvent()

    // 容器大小改变时调整遮罩大小
    this.$cropper
      .on(CROPPER_EVENT.SIZE_CHANGE, rect => {
        setStyle(this.$el.cropBox, {
          outline: `${Math.max(rect.width, rect.height)}px solid rgba(0,0,0,0.5)`
        })
      })
    this.$cropper
      .on(CROPPER_EVENT.BEFORE_DESTROY, () => {
        cancel()
        cancelCropLineEvent()
      })
  }

  _addCropLineEvent () {
    const cancelTopLine = moveable(this.$el.cropLineTop, {
      onMove: e => {
        if (this.$position.y - e.y <= 0 || this.$position.y - e.y >= this.$cropper.$rect.height) return
        const { height, width } = this.$rect.cropBox
        this.setCropSize(
          this._toSafeSize({
            width, height: height + e.y
          })
          , false
        )
        this.setCropPosition(
          this._toSafePosition({
            left: this.$position.x,
            top: this.$position.y - e.y
          }, true),
          false
        )
      },
      onEnd: e => {
        this.setCropSize(
          this._toSafeSize({
            height: this.$rect.cropBox.height + e.y,
            width: this.$rect.cropBox.width
          })
        )
        this.setCropPosition(
          this._toSafePosition({
            left: this.$position.x,
            top: this.$position.y - e.y
          })
        )
      },
      onStart (_, e) {
        // 阻止事件向下传播，阻止move事件触发
        e.stopImmediatePropagation()
      }
    })

    const cancelBottomLine = moveable(this.$el.cropLineBottom, {
      onMove: e => {
        const { height, width } = this.$rect.cropBox
        if ((this.$position.y + height) - e.y <= 0 || (this.$position.y + height) - e.y >= this.$cropper.$rect.height) return
        this.setCropSize(
          this._toSafeSize({
            width, height: height - e.y
          })
          , false
        )
      },
      onEnd: e => {
        this.setCropSize(
          this._toSafeSize({
            height: this.$rect.cropBox.height - e.y,
            width: this.$rect.cropBox.width
          })
        )
        this.setCropPosition(
          this._toSafePosition({
            left: this.$position.x,
            top: this.$position.y - e.y
          })
        )
      },
      onStart (_, e) {
        // 阻止事件向下传播，阻止move事件触发
        e.stopImmediatePropagation()
      }
    })
    return function cancel () {
      cancelTopLine()
      cancelBottomLine()
    }
  }

  /**
   * 传入给定的左上角坐标点 转换为安全位置
   * @param {*} param0 
   * @param {boolean} isPoint 是否以一个点为区域内的移动元素
   */
  _toSafePosition ({ left = 0, top = 0 }, isPoint = false) {
    const cropBoxRect = this.$rect.cropBox
    const rootRect = this.$cropper.$rect
    const [width, height] = isPoint
      ? [rootRect.width, rootRect.height]
      : [rootRect.width - cropBoxRect.width, rootRect.height - cropBoxRect.height]
    return {
      x: Math.max(Math.min(width, left), 0),
      y: Math.max(Math.min(height, top), 0)
    }
  }

  _toSafeSize ({ width = 0, height = 0 }, isPoint = false) {
    const rootRect = this.$cropper.$rect
    // const cropBoxRect = this.$rect.cropBox
    // const [cWidth, cHeight] = isPoint
    //   ? []
    //   : []
    return {
      width: Math.min(rootRect.width, width),
      height: Math.min(rootRect.height, height)
    }
  }

  /**
   * Method
   */
  getElement () {
    return this.$el.wrapper 
  }

  /**
   * 
   * @param {*} param0 
   * @param {boolean} recordSize 是否记录当前大小
   */
  setCropSize ({ width = 0, height = 0 }, recordSize = true) {
    recordSize && (this.$rect.cropBox = { width, height })
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