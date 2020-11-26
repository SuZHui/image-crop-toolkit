import { setStyle } from '../util/dom'
import { CROPPER_EVENT } from './constants'
import { initControllerNodes } from './helper'
import { listenMouseMove } from '../moveable/index'

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
    left: 0, top: 0
  }
  $rect = {
    cropBox: {
      width: 0,
      height: 0
    }
  }

  constructor (container) {
    this.$cropper = container
    this._init()
  }

  _init() {
    this._initDom()
    this._mountEvent()
  }

  _initDom () {
    this.$el = initControllerNodes(this.$cropper)
  }

  _calculatePosition (e) {
    const currentPosition = this.$position
    const rect = this.$rect.cropBox
    const rootRect = this.$cropper.$rect
    // 容器边缘到达鼠标位置的距离
    const [r2mLeft, r2mTop] = [e.pageX - rootRect.left, e.pageY - rootRect.top]
    let [left, top] = [currentPosition.left + e.movementX, currentPosition.top + e.movementY]
    left = Math.max(Math.min(rootRect.right - rect.width, left), 0)
    top = Math.max(Math.min(rootRect.bottom - rect.height, top), 0)
    return {
      left,
      top
    }
  }

  _mountEvent () {
    const { cancel } = listenMouseMove(this.$el.cropBox, {
      onStart: e => this.setCropPosition(
          this._calculatePosition(e)
        ),
      onMove: e => this.setCropPosition(
          this._calculatePosition(e)
        ),
      onStop: e => this.setCropPosition(
          this._calculatePosition(e)
        )
    })

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
    const cancelTopLine = listenMouseMove(this.$el.cropLineTop, {
      onMove: e => { },
      onStop: e => { },
      onStart (_, e) {
        // 阻止事件向下传播，阻止move事件触发
        e.stopImmediatePropagation()
      }
    })

    const cancelBottomLine = listenMouseMove(this.$el.cropLineBottom, {
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
   */
  setCropSize ({ width = 0, height = 0 }) {
    this.$rect.cropBox = { width, height }
    setStyle(this.$el.cropBox, {
      width: `${width}px`, height: `${height}px`
    })
  }

  /**
   *
   * @param {*} param0 
   */
  setCropPosition ({ left = 0, top = 0 }) {
    this.$position = { left, top }
    setStyle(this.$el.cropBox, {
      transform: `translate3d(${left}px, ${top}px, 0px)`
    })
  }
  // 设置裁切框居中
  setCropBoxCenter (scale = 0.8) {
    // 默认缩小为视口的0.8
    const { preview, $rect } = this.$cropper
    const imageRect = preview.getImageRect()

    const cropSize = {
      width: imageRect.cWidth * scale,
      height: imageRect.cHeight * scale
    }
    const position = {
      left: ($rect.width - cropSize.width) / 2,
      top: ($rect.height - cropSize.height) / 2
    }
    this.setCropSize(cropSize)
    this.setCropPosition(position)
  }
}