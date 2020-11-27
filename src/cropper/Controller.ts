import { setStyle } from '../util/dom'
import { CROPPER_EVENT } from './constants'
import { initControllerNodes } from './helper'
import { listenMouseMove } from '../moveable/index'
import { Cropper } from './Cropper'

type Rect = {
  width: number
  height: number
  left: number
  top: number
}

export class Controller {
  private $el: {
    wrapper: HTMLElement,
    cropBox: HTMLElement,
    cropFace: HTMLElement,
    // 剪切的边框
    cropLineTop: HTMLElement,
    cropLineBottom: HTMLElement,
    cropLineLeft: HTMLElement, 
    cropLineRight: HTMLElement
  }
  // 位置标记暂存
  $rect: {
    cropBox: Rect
  } = {
    cropBox: {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    }
  }

  constructor (private $cropper: Cropper) {
    this.$el = initControllerNodes(this.$cropper)
    this._mountEvent()
  }

  _calculatePosition (e: MouseEvent) {
    const rect = this.$rect.cropBox
    const rootRect = this.$cropper.$rect

    let [left, top] = [rect.left + e.movementX, rect.top + e.movementY]
    left = Math.max(Math.min(rootRect.right! - rect.width, left), 0)
    top = Math.max(Math.min(rootRect.bottom! - rect.height, top), 0)
    return {
      left,
      top
    }
  }

  _mountEvent () {
    const { cancel } = listenMouseMove(this.$el.cropBox, {
      onStart: (e: MouseEvent) => this.setCropRect(
          this._calculatePosition(e)
        ),
      onMove: (e: MouseEvent) => this.setCropRect(
          this._calculatePosition(e)
        ),
      onStop: (e: MouseEvent) => this.setCropRect(
          this._calculatePosition(e)
        )
    })

    const cancelCropLineEvent = this._addCropLineEvent()

    // 容器大小改变时调整遮罩大小
    this.$cropper
      .on(CROPPER_EVENT.SIZE_CHANGE, (rect: Rect) => {
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
    const handleTopLine = listenMouseMove(this.$el.cropLineTop, {
      onMove: (e: MouseEvent) => {
        const rect = {
          left: this.$rect.cropBox.left,
          top: this.$rect.cropBox.top + e.movementY,
          width: this.$rect.cropBox.width,
          height: this.$rect.cropBox.height - e.movementY
        }
        this.setCropRect(rect)
      },
      onStop: (e: MouseEvent) => {
        this.setCropRect({
          width: this.$rect.cropBox.width,
          height: this.$rect.cropBox.height - e.movementY
        })
      },
      onStart: (e: MouseEvent) => {
        // 阻止事件向下传播，阻止move事件触发
        e.stopImmediatePropagation()
      }
    })

    const handleBottomLine = listenMouseMove(this.$el.cropLineBottom, {
      onMove: (e: MouseEvent) => { },
      onStop: (e: MouseEvent) => { },
      onStart: (e: MouseEvent) => {
        // 阻止事件向下传播，阻止move事件触发
        e.stopImmediatePropagation()
      }
    })
    return function cancel () {
      handleTopLine.cancel()
      handleBottomLine.cancel()
    }
  }

  /**
   * Method
   */
  getElement () {
    return this.$el.wrapper!
  }

  setCropRect (rect: Partial<Rect>) {
    const newRect = Object.assign({}, this.$rect.cropBox, rect)
    setStyle(this.$el.cropBox, {
      width: `${newRect.width}px`, height: `${newRect.height}px`,
      transform: `translate3d(${newRect.left}px, ${newRect.top}px, 0px)`
    })
    this.$rect.cropBox = newRect
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
      left: ($rect.width! - cropSize.width) / 2,
      top: ($rect.height! - cropSize.height) / 2
    }
    this.setCropRect({ ...cropSize, ...position })
  }
}