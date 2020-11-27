import { clearChildren, setStyle } from '../util/dom'
import { Preview } from './Preview'
import { Controller } from './Controller'
import { EventEmitter } from '../event-emitter/EventEmitter'
import { CROPPER_EVENT } from './constants'

export class Cropper extends EventEmitter {
  // 图片预览窗口
  preview: Preview
  // 裁切栏
  controller: Controller

  $rect: {
    width: number
    height: number
    left: number
    top: number
  } & Partial<DOMRectReadOnly> = {
    width: 0, height: 0, left: 0, top: 0
  }

  constructor (private $container: HTMLElement) {
    super()
    if (!this.$container) {
      throw new Error('container不存在！')
    }
    clearChildren(this.$container)
    const rect = this.$container.getBoundingClientRect()
    // 初始化容器宽高
    this.$rect = rect
    this._initStyle()
    this._mountListener()

    this.preview = new Preview(this)
    this.$container
      .append(
        this.preview!.getElement()
      )

    this.controller = new Controller(this)
    this.$container
      .append(
        this.controller!.getElement()
        )
  }

  _initStyle () {
    setStyle(this.$container, {
      overflow: 'hidden',
      position: 'relative',
      'touch-action': 'none'
    })
  }
  _mountListener () {
    const cb = (entries: ReadonlyArray<ResizeObserverEntry>) => {
      for(const entry of entries) {
        if (entry.target === this.$container) {
          this.$rect = entry.contentRect
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
      this.controller!.setCropBoxCenter()
    })
  }

  // methods
  loadResource (resource: string) {
    // TODO: 目前只加载远端url
    this.preview.setURL(resource)
  }

  destroy () {
    this.emit(CROPPER_EVENT.BEFORE_DESTROY)
    // TODO: 释放内存
  }
}