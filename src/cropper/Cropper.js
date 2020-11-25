import { clearChildren, setStyle } from '../util/dom'
import { Preview } from './Preview'
import { Controller } from './Controller'
import { EventEmitter } from '../event-emitter/index'
import { CROPPER_EVENT } from './constants'

export class Cropper extends EventEmitter {
  // 主容器
  $container = null
  // 图片预览窗口
  preview = null
  // 裁切栏
  controller = null

  $rect = {
    width: 0, height: 0
  }

  constructor (container) {
    if (!container) {
      throw new Error('container不存在！')
    }

    super()
    this.$container = container
    clearChildren(container)

    // 初始化容器宽高
    this.$rect = {
      width: container.offsetWidth,
      height: container.offsetHeight
    }
    this._initStyle()
    this._mountListener()

    this._initPreview()
    this._initContrller()
  }

  _initStyle () {
    setStyle(this.$container, {
      overflow: 'hidden',
      position: 'relative',
      touchAction: 'none'
    })
  }
  _mountListener () {
    const cb = (entries) => {
      for(const entry of entries) {
        if (entry.target === this.$container) {
          const { width = 0, height = 0 } = entry.contentRect
          this.$rect = { width, height }
          this.emit(CROPPER_EVENT.SIZE_CHANGE, this.$rect)
        }
      }
    }
    const wrapperObserver = new ResizeObserver(cb)
    wrapperObserver
      .observe(this.$container)

    this.$container
      .addEventListener('wheel', e => {
        this.emit(CROPPER_EVENT.WHEEL, e)
      })

    this.on(CROPPER_EVENT.PREVIEW_LOAD, () => {
      this.controller.setCropBoxCenter()
    })
  }

  _initPreview () {
    this.preview = new Preview(this)

    this.$container
      .append(
        this.preview.getElement()
      )
  }

  _initContrller () {
    this.controller = new Controller(this)

    this.$container
      .append(
        this.controller.getElement()
      )
  }


  // methods
  loadResource (resource) {
    // TODO: 目前只加载远端url
    this.preview.setURL(resource)
  }

  destroy () {
    this.emit(CROPPER_EVENT.BEFORE_DESTROY)
    // TODO: 释放内存
  }
}