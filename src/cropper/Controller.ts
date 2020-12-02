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

enum CROP_POINT_POSITION {
  TOP_LEFT = 1,
  BOTTOM_LEFT = 2,
  TOP_RIGHT = 3,
  BOTTOM_RIGHT = 4,

  CENTER_LEFT = 11,
  CENTER_RIGHT = 22,

  TOP_CENTER = 10,
  BOTTOM_CENTER = 20,
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
    // 左上角坐标显示
    cropInfo: HTMLElement,
    // 缩放点
    cropPointN: HTMLElement,
    cropPointW: HTMLElement,
    cropPointS: HTMLElement,
    cropPointE: HTMLElement,
    cropPointNE: HTMLElement,
    cropPointNW: HTMLElement,
    cropPointSW: HTMLElement,
    cropPointSE: HTMLElement
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
    const cancelCropPointEvent = this._addCropPointEvent()

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
        cancelCropPointEvent()
      })
  }

  private getRectByLine (direction: CROP_LINE_MOVE_DIRECTION, target: CROP_LINE_BASE_TARGET, e: MouseEvent): Rect {
    const pageDir = direction === CROP_LINE_MOVE_DIRECTION.VERTICAL
      ? 'pageY' : 'pageX'

    const distanceKey: 'top'|'left' = direction === CROP_LINE_MOVE_DIRECTION.VERTICAL ? 'top' : 'left'
    const sizeKey: 'height'|'width' = direction === CROP_LINE_MOVE_DIRECTION.VERTICAL ? 'height': 'width'
    // 鼠标当前位置到达容器边缘的距离
    const mouseToEdge = e[pageDir] - this.$cropper.$rect[distanceKey]

    const highLimit = direction === CROP_LINE_MOVE_DIRECTION.VERTICAL ? this.$cropper.$rect.height : this.$cropper.$rect.width
    if (mouseToEdge < 0 || mouseToEdge > highLimit) {
      return this.$rect.cropBox
    }

    const currentRect: Rect = Object.assign({}, this.$rect.cropBox)
    // if (direction === CROP_LINE_MOVE_DIRECTION.VERTICAL) {
    //   currentRect.left = this.$rect.cropBox.left
    //   currentRect.width = this.$rect.cropBox.width
    // } else if (direction === CROP_LINE_MOVE_DIRECTION.HORIZONTAL) {
    //   currentRect.top = this.$rect.cropBox.top
    //   currentRect.height = this.$rect.cropBox.height
    // }

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
    return currentRect
  }

  private getRectByPoint (position: CROP_POINT_POSITION, e: MouseEvent): Rect {
    if (position % 10 === 0 || position % 11 === 0) {
      // 单向移动 直接复用 crop line函数
      const dir = position % 11 === 0 ? CROP_LINE_MOVE_DIRECTION.HORIZONTAL : CROP_LINE_MOVE_DIRECTION.VERTICAL
      const target = position >= 20 ? CROP_LINE_BASE_TARGET.SECOND : CROP_LINE_BASE_TARGET.FIRST
      return this.getRectByLine(dir, target, e)
    } else {
      // 双向移动
      const isYFirst = position === CROP_POINT_POSITION.TOP_LEFT || position === CROP_POINT_POSITION.TOP_RIGHT
      const isXFirst = position === CROP_POINT_POSITION.TOP_LEFT || position === CROP_POINT_POSITION.BOTTOM_LEFT
      const rectV = this.getRectByLine(CROP_LINE_MOVE_DIRECTION.VERTICAL, isYFirst ? CROP_LINE_BASE_TARGET.FIRST : CROP_LINE_BASE_TARGET.SECOND, e)
      const rectH = this.getRectByLine(CROP_LINE_MOVE_DIRECTION.HORIZONTAL, isXFirst ? CROP_LINE_BASE_TARGET.FIRST : CROP_LINE_BASE_TARGET.SECOND, e)
      return {
        top: rectV.top,
        height: rectV.height,
        left: rectH.left,
        width: rectH.width
      }
    }
  }

  private getCropLineOption (dir: CROP_LINE_MOVE_DIRECTION, target: CROP_LINE_BASE_TARGET) {
    return {
      onMove: (e: MouseEvent) => {
        const rect = this.getRectByLine(dir, target, e)
        this.setCropRect(rect)
      },
      onStop: (e: MouseEvent) => this.clearRectCache(),
      onStart: (e: MouseEvent) => {
        // 阻止事件向下传播，阻止move事件触发
        e.stopImmediatePropagation()
        this.setRectCache(this.$rect.cropBox)
      }
    }
  }

  private getCropPointOption (pos: CROP_POINT_POSITION) {
    return {
      onMove: (e: MouseEvent) => {
        const rect = this.getRectByPoint(pos, e)
        this.setCropRect(rect)
      },
      onStop: () => this.clearRectCache(),
      onStart: (e: MouseEvent) => {
        e.stopImmediatePropagation()
        this.setRectCache(this.$rect.cropBox)
      }
    }
  }

  private _addCropLineEvent () {
    const handleTopLine = listenMouseMove(
      this.$el.cropLineN,
      this.getCropLineOption(CROP_LINE_MOVE_DIRECTION.VERTICAL, CROP_LINE_BASE_TARGET.FIRST)
    )
    
    const handleBottomLine = listenMouseMove(
      this.$el.cropLineS,
      this.getCropLineOption(CROP_LINE_MOVE_DIRECTION.VERTICAL, CROP_LINE_BASE_TARGET.SECOND)
    )
    
    const handleLeftLine = listenMouseMove(
      this.$el.cropLineW,
      this.getCropLineOption(CROP_LINE_MOVE_DIRECTION.HORIZONTAL, CROP_LINE_BASE_TARGET.FIRST)
    )

    const handleRightLine = listenMouseMove(
      this.$el.cropLineE,
      this.getCropLineOption(CROP_LINE_MOVE_DIRECTION.HORIZONTAL, CROP_LINE_BASE_TARGET.SECOND)
    )
    return function cancel () {
      handleTopLine.cancel()
      handleBottomLine.cancel()
      handleLeftLine.cancel()
      handleRightLine.cancel()
    }
  }

  private _addCropPointEvent () {
    const handlePointN = listenMouseMove(
      this.$el.cropPointN,
      this.getCropPointOption(CROP_POINT_POSITION.TOP_CENTER)
    )

    const handlePointS = listenMouseMove(
      this.$el.cropPointS,
      this.getCropPointOption(CROP_POINT_POSITION.BOTTOM_CENTER)
    )

    const handlePointW = listenMouseMove(
      this.$el.cropPointW,
      this.getCropPointOption(CROP_POINT_POSITION.CENTER_LEFT)
    )

    const handlePointE = listenMouseMove(
      this.$el.cropPointE,
      this.getCropPointOption(CROP_POINT_POSITION.CENTER_RIGHT)
    )

    const handlePointNW = listenMouseMove(
      this.$el.cropPointNW,
      this.getCropPointOption(CROP_POINT_POSITION.TOP_LEFT)
    )
    
    const handlePointNE = listenMouseMove(
      this.$el.cropPointNE,
      this.getCropPointOption(CROP_POINT_POSITION.TOP_RIGHT)
    )
    
    const handlePointSW = listenMouseMove(
      this.$el.cropPointSW,
      this.getCropPointOption(CROP_POINT_POSITION.BOTTOM_LEFT)
    )
    
    const handlePointSE = listenMouseMove(
      this.$el.cropPointSE, 
      this.getCropPointOption(CROP_POINT_POSITION.BOTTOM_RIGHT)
    )

    return function cancel () {
      handlePointN.cancel()
      handlePointS.cancel()
      handlePointW.cancel()
      handlePointE.cancel()
      handlePointNW.cancel()
      handlePointNE.cancel()
      handlePointSW.cancel()
      handlePointSE.cancel()
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