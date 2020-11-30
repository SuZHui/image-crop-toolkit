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

// 线宽
const CROP_LINE_WEIGHT = 2

// 裁切线的移动方式
enum CROP_LINE_MOVE_DIRECTION {
  // 所有方向
  ALL = 0,
  // 纵向
  VERTICAL = 1,
  // 横向
  HORIZONTAL = 2
}

// 裁切变换基线的位置（横向：从左往右 纵向：从上往下）
enum CROP_LINE_BASE_TARGET {
  FIRST = 1,
  SECOND = 2
}

export class Controller {
  private $el: {
    wrapper: HTMLElement,
    cropBox: HTMLElement,
    cropFace: HTMLElement,
    // 剪切的边框
    cropLineN: HTMLElement,
    cropLineS: HTMLElement,
    cropLineW: HTMLElement, 
    cropLineE: HTMLElement,
    cropInfo: HTMLElement
  }
  // 位置标记暂存
  $rect: {
    cache: Rect
    cropBox: Rect
  } = {
    // 临时位置暂存 用于在缩放时记录起始位置
    cache: {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    },
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

  private cropLineEvent(direction: CROP_LINE_MOVE_DIRECTION, target: CROP_LINE_BASE_TARGET, e: MouseEvent) {
    const pageDir = direction === CROP_LINE_MOVE_DIRECTION.VERTICAL
      ? 'pageY' : 'pageX'

    const distanceKey: 'top'|'left' = direction === CROP_LINE_MOVE_DIRECTION.VERTICAL ? 'top' : 'left'
    const sizeKey: 'height'|'width' = direction === CROP_LINE_MOVE_DIRECTION.VERTICAL ? 'height': 'width'
    // 鼠标当前位置到达容器边缘的距离
    const mouseToEdge = e[pageDir] - this.$cropper.$rect[distanceKey]

    const highLimit = direction === CROP_LINE_MOVE_DIRECTION.VERTICAL ? this.$cropper.$rect.height : this.$cropper.$rect.width
    if (mouseToEdge < 0 || mouseToEdge > highLimit) {
      return
    }

    const currentRect: Partial<Rect> = {}
    if (direction === CROP_LINE_MOVE_DIRECTION.VERTICAL) {
      currentRect.left = this.$rect.cropBox.left
      currentRect.width = this.$rect.cropBox.width
    } else if (direction === CROP_LINE_MOVE_DIRECTION.HORIZONTAL) {
      currentRect.top = this.$rect.cropBox.top
      currentRect.height = this.$rect.cropBox.height
    }

    const cachedRect = this.$rect.cache
    const crossedLine = CROP_LINE_BASE_TARGET.FIRST === target
        ? cachedRect[distanceKey] + cachedRect[sizeKey]
        : cachedRect[distanceKey]

    const [distance, size] = mouseToEdge <= crossedLine
      ? (() => {
        const range = crossedLine - mouseToEdge
        return [crossedLine - range, range]
      })()
      : [crossedLine, mouseToEdge - crossedLine]

    currentRect[distanceKey] = distance
    currentRect[sizeKey] = size
    this.setCropRect(currentRect)
  }

  private _addCropLineEvent () {
    const handleTopLine = listenMouseMove(this.$el.cropLineN, {
      onMove: (e: MouseEvent) => {
        // 鼠标当前位置到达容器的上边距
        const mouseY2Top = e.pageY - this.$cropper.$rect.top
        if (mouseY2Top < 0 || mouseY2Top > this.$cropper.$rect.height) return
        const currentRect: Partial<Rect> = {
          left: this.$rect.cropBox.left,
          width: this.$rect.cropBox.width
        }
        const cachedRect = this.$rect.cache
        // 南线距离顶部的数值
        // 该值为分割线值
        // 如果鼠标当前位置大于该值 则表示裁切进入反向模式 此时鼠标位置变化不会改变top高度 只会增加 rect.height
        // 如果鼠标当前位置小于等于该值 则表示裁切在正常模式 此时鼠标位置的变化会同时改变top和height的数字 以保证它们相加会等于sLineTop
        const sLineTop = cachedRect.top + cachedRect.height

        const [top, height] = mouseY2Top <= sLineTop
          ? (() => {
            const h = sLineTop - mouseY2Top
            return [sLineTop -h, h]
          })()
          : [sLineTop, mouseY2Top - sLineTop]

        currentRect.top = top
        currentRect.height = height
        this.setCropRect(currentRect)
      },
      onStop: (e: MouseEvent) => {
        this.clearRectCache()
      },
      onStart: (e: MouseEvent) => {
        // 阻止事件向下传播，阻止move事件触发
        e.stopImmediatePropagation()
        this.setRectCache(this.$rect.cropBox)
      }
    })

    const handleBottomLine = listenMouseMove(this.$el.cropLineS, {
      onMove: (e: MouseEvent) => {
        this.cropLineEvent(CROP_LINE_MOVE_DIRECTION.VERTICAL, CROP_LINE_BASE_TARGET.SECOND, e)
      },
      onStop: (e: MouseEvent) => {
        this.clearRectCache()
      },
      onStart: (e: MouseEvent) => {
        // 阻止事件向下传播，阻止move事件触发
        e.stopImmediatePropagation()
        this.setRectCache(this.$rect.cropBox)
      }
    })

    const handleLeftLine = listenMouseMove(this.$el.cropLineW, {
      onMove: (e: MouseEvent) => {
        this.cropLineEvent(CROP_LINE_MOVE_DIRECTION.HORIZONTAL, CROP_LINE_BASE_TARGET.FIRST, e)
      },
      onStop: (e: MouseEvent) => {
        this.clearRectCache()
      },
      onStart: (e: MouseEvent) => {
        // 阻止事件向下传播，阻止move事件触发
        e.stopImmediatePropagation()
        this.setRectCache(this.$rect.cropBox)
      }
    })

    const handleRightLine = listenMouseMove(this.$el.cropLineE, {
      onMove: (e: MouseEvent) => {
        this.cropLineEvent(CROP_LINE_MOVE_DIRECTION.HORIZONTAL, CROP_LINE_BASE_TARGET.SECOND, e)
      },
      onStop: (e: MouseEvent) => {
        this.clearRectCache()
      },
      onStart: (e: MouseEvent) => {
        // 阻止事件向下传播，阻止move事件触发
        e.stopImmediatePropagation()
        this.setRectCache(this.$rect.cropBox)
      }
    })
    return function cancel () {
      handleTopLine.cancel()
      handleBottomLine.cancel()
      handleLeftLine.cancel()
      handleRightLine.cancel()
    }
  }

  
  // 设置位置暂存 
  private setRectCache (rect: Partial<Rect>) {
    this.$rect.cache = Object.assign(this.$rect.cache, rect)
  }

  private clearRectCache () {
    this.$rect.cache = { left: 0, top: 0, width: 0, height: 0 }
  }
  // 同步裁切信息
  private syncCropInfo () {
    const rect = this.$rect.cropBox
    this.$el.cropInfo.innerHTML = `${rect.width} × ${rect.height}`
    setStyle(this.$el.cropInfo, {
      top: rect.top > 20 ? '-20px' : '0px'
    })
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
    this.syncCropInfo()
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