(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Toolkit = {}));
}(this, (function (exports) { 'use strict';

  /**
   * file转data url
   * @param {File} blob 
   */
  function toDataURL (blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        resolve(reader);
      });
      reader.addEventListener('error', err => {
        reject(err);
      });
      reader.readAsDataURL(blob);
    })
  }

  function fromDataURL (dataUrl, type) {
    return new Promise((resolve, reject) => {
      try {
        const data = dataUrl.split(',')[1];
        const mimePattern = /^data:(.*?)(;base64)?,/;
        const mime = dataUrl.match(mimePattern)[1];
        const binStr = atob(data);
        const length = binStr.length;
        const arr = new Uint8Array(length);
      
        for (var i = 0; i < length; i++) {
          arr[i] = binStr.charCodeAt(i);
        }
        resolve(new Blob([arr], { type: type || mime }));
      } catch (err) {
        reject(err);
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
      const image = new Image(width, height);
      const URL = webkitURL || URL;
      const source = URL 
        ? URL.createObjectURL(blob)
        : toDataURL(blob);

      image.src = source;
      image.addEventListener('load', () => {
        resolve(image);
        URL && URL.revokeObjectURL(source);
      });
      image.addEventListener('error', err => reject(err));
    })
  }

  function fromCanvas (canvas, { type = 'image/jpeg', quality = 0.8 }) {
    return new Promise(resolve => {
      canvas.toBlob(resolve, type, quality);
    })
  }

  var blob = {
    toDataURL,
    toImage,
    fromDataURL,
    fromCanvas
  };

  function fromURL (url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => {
        resolve(image);
      });
      image.addEventListener('error', err => reject(err));
      image.src = url;
      image.setAttribute('crossOrigin','anonymous');
    })
  }

  function fromDataURL$1 (dataUrl) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => {
        resolve(image);
      });
      image.addEventListener('error', err => reject(err));
      image.src = dataUrl;
    })
  }

  function toCanvas (image) {
    return new Promise(resolve => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas);
    })
  }

  var image = {
    fromURL,
    fromDataURL: fromDataURL$1,
    toCanvas
  };

  function toDataURL$1 (canvas, quality = 0.8, type = 'image/jpeg') {
    return new Promise(resolve => {
      resolve(canvas.toDataURL(type, quality));
    })
  }

  var canvas = {
    toDataURL: toDataURL$1
  };

  function clearChildren (dom) {
    dom.innerHTML = '';
  }

  function setStyle (dom, props = {}) {
    for (const key in props) {
      dom.style[key] = props[key];
    }
  }

  function moveable (element, {
    onMove = () => {},
    onStart = () => {},
    onEnd = () => {}
  }, boundary) {
    let position = {
      x: 0, y: 0
    };
    let padding = null;
    // 获取鼠标在四周碰撞区域的可移动范围
    const getBoundaryPadding = () => {
      const boundaryRect = boundary.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      // debugger
      const xMin = boundaryRect.left - elementRect.left;
      const xMax = boundaryRect.right - elementRect.right;
      const yMin = boundaryRect.top - elementRect.top;
      const yMax = boundaryRect.bottom - elementRect.bottom;

      return {
        xMin, xMax,
        yMin, yMax
      }
    };

    const handleMove = e => {
      e.preventDefault();

      let [x, y] = [e.pageX - position.x, e.pageY - position.y];
      if (boundary) {
        x = Math.min(Math.max(padding.xMin, x), padding.xMax);
        y = Math.min(Math.max(padding.yMin, y), padding.yMax);
      } 
      onMove({ x, y }, e);
    };
    const handleEnd = e => {
      let [x, y] = [e.pageX - position.x, e.pageY - position.y];
      if (boundary) {
        x = Math.min(Math.max(padding.xMin, x), padding.xMax);
        y = Math.min(Math.max(padding.yMin, y), padding.yMax);
      } 
      onEnd({ x, y }, e);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
    };

    const handleStart = e => {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      if (boundary) {
        padding = getBoundaryPadding();
      }
      position = { x: e.pageX, y: e.pageY };
      onStart(position, e);
    };

    element.addEventListener('mousedown', handleStart);

    return function cancel () {
      element.removeEventListener('mousedown', handleStart);
      position = null;
      padding = null;
    }
  }

  const CROPPER_EVENT = {
    SIZE_CHANGE: 'sizeChange',
    PREVIEW_LOAD: 'previewLoad',
    WHEEL: 'wheel',
    BEFORE_DESTROY: 'beforeDestroy'
  };

  class Preview {
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
      this.$cropper = crooper;
      this._init();
    }

    _init () {
      this.$el.wrapper = document.createElement('div');
      this.$el.image = new Image();
      this.$el.wrapper
        .append(this.$el.image);

      this._initStyle();
      this._mountEvent();
    }

    _initStyle () {
      setStyle(this.$el.wrapper, {
        backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC")',
        overflow: 'hidden',
        position: 'absolute',
        top: 0, right: 0, bottom: 0, left: 0
      });

      setStyle(this.$el.image, {
        position: 'absolute',
        webkitUserDrag: 'none'
      });
    }
    // 挂载事件
    _mountEvent () {
      this.$cropper.on(CROPPER_EVENT.SIZE_CHANGE, this.onWrapperSizeChange.bind(this));
      this.$cropper.on(CROPPER_EVENT.WHEEL, this.onPreviewZoom.bind(this));

      const image = this.$el.image;
      this.onImageLoad = this.onImageLoad.bind(this);
      this.onImageError = this.onImageError.bind(this);
      image.addEventListener('load', this.onImageLoad);
      image.addEventListener('error', this.onImageError);
    }

    // internal event
    onWrapperSizeChange () {
      this.fullDisplayImage();
    }

    onImageLoad () {
      const [nw, nh] = [this.$el.image.naturalWidth, this.$el.image.naturalHeight];
      this.$rect.image = { width: nw, height: nh };
      this.$el.image.width = nw;
      this.$el.image.height = nh;

      this.fullDisplayImage();

      this.$cropper.emit(CROPPER_EVENT.PREVIEW_LOAD);
    }

    onImageError (err) {
      console.error(err);
    }

    onPreviewZoom (e) {
      const ratio = 0.1;
      let delta = 1;
      e.preventDefault();

      // 限制滚轮速度防止缩放过快
      if (this.wheeling) return

      this.wheeling = true;

      setTimeout(() => {
        this.wheeling = false;
      }, 50);

      if (e.deltaY) {
        delta = e.deltaY > 0 ? 1 : -1;
      } else if (e.wheelDelta) {
        delta = -e.wheelDelta / 120;
      } else if (e.detail) {
        delta = e.detail > 0 ? 1 : -1;
      }
      this.zoom(-delta * ratio);
    }

    // internal method
    fullDisplayImage () {
      const imageRect = this.$rect.image;
      const wrapperRect = this.$cropper.$rect;
      // 完整显示图片
      const scaleRatio = Math.min(
        wrapperRect.width/imageRect.width,
        wrapperRect.height/imageRect.height
      );

      this.$transform.scale = scaleRatio;
      setStyle(this.$el.image, {
        left: `${(wrapperRect.width - imageRect.width)/2}px`,
        top: `${(wrapperRect.height - imageRect.height)/2}px`,
        transform: `scale(${scaleRatio})`
      });
    }

    /**
     * Methods
     */

    getElement () {
      return this.$el.wrapper
    }

    getImageRect () {
      const { scale } = this.$transform;

      return {
        nWidth: this.$rect.image.width,
        nHeight: this.$rect.image.height,
        cWidth: this.$rect.image.width * scale,
        cHeight: this.$rect.image.height * scale
      }
    }

    setURL (url) {
      this.url = url;
      this.$el.image.src = url;
    }
    // 缩放
    zoom (ratio) {
      this.$transform.scale = this.$transform.scale * (1 + ratio);
      setStyle(this.$el.image, {
        transform: `scale(${this.$transform.scale})`
      });
    }
  }

  class Controller {
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
    $rect = {
      cropBox: { width: 0, height: 0 }
    }

    constructor (container) {
      this.$cropper = container;
      this._init();
    }

    _init() {
      this.$el.wrapper = document.createElement('div');
      this.$el.modal = document.createElement('div');
      this.$el.cropBox = document.createElement('div');
      this.$el.cropFace = document.createElement('span');

      this._initStyle();
      this._mountEvent();

      this.$el.cropBox
        .append(this.$el.cropFace);
      this.$el.wrapper
        .append(this.$el.modal, this.$el.cropBox);
    }

    _initStyle () {
      setStyle(this.$el.wrapper, {
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        position: 'relative',
      });
      setStyle(this.$el.modal, {
        backgroundColor: '#000',
        opacity: 0.5,
        position: 'absolute',
        top: 0, right: 0, bottom: 0, left: 0
      });
      this.$el.cropBox
        .classList.add('crop-box');
      setStyle(this.$el.cropBox, {
        willChange: 'transform',
        position: 'absolute',
        top: 0, right: 0, bottom: 0, left: 0
      });
      setStyle(this.$el.cropFace, {
        backgroundColor: '#fff',
        left: 0,
        top: 0,
        cursor: 'move',
        display: 'block',
        opacity: 0.1,
        width: '100%',
        height: '100%'
      });
    }

    _mountEvent () {
      const cancel = moveable(this.$el.cropBox, {
        onStart: (e) => {},
        onMove: e => {
          const cropBoxRect = this.$rect.cropBox;
          const rootRect = this.$cropper.$rect;
          let [x, y] = [this.$position.x + e.x, this.$position.y + e.y];
          const [width, height] = [rootRect.width - cropBoxRect.width, rootRect.height - cropBoxRect.height];
          x = Math.max(Math.min(width, x), 0);
          y = Math.max(Math.min(height, y), 0);
          this.setCropPosition({ x, y }, false);
        },
        onEnd: e => {
          this.setCropPosition({
            x: this.$position.x + e.x,
            y: this.$position.y + e.y
          });
        }
      }, this.$cropper.$container);

      this.$cropper
        .on(CROPPER_EVENT.BEFORE_DESTROY, () => cancel());
    }

    /**
     * Method
     */
    getElement () {
      return this.$el.wrapper 
    }

    setCropSize ({ width = 0, height = 0 }) {
      this.$rect.cropBox = { width, height };
      setStyle(this.$el.cropBox, {
        width: `${width}px`, height: `${height}px`
      });
    }

    /**
     *
     * @param {*} param0 
     * @param {boolean} cachePosition 是否记录当前位置
     */
    setCropPosition ({ x = 0, y = 0 }, recordPosition = true) {
      recordPosition && (this.$position = { x, y });
      setStyle(this.$el.cropBox, {
        transform: `translate3d(${x}px, ${y}px, 0px)`
      });
    }
    // 设置裁切框居中
    setCropBoxCenter () {
      // 默认缩小为视口的0.8
      const { preview, $rect } = this.$cropper;
      const imageRect = preview.getImageRect();

      const cropSize = {
        width: imageRect.cWidth * 0.8,
        height: imageRect.cHeight * 0.8
      };
      const position = {
        x: ($rect.width - cropSize.width) / 2,
        y: ($rect.height - cropSize.height) / 2
      };
      this.setCropSize(cropSize);
      this.setCropPosition(position);
    }
  }

  class EventEmitter {
    listeners = {}

    on (event, cb) {
      const listeners = this.listeners;
      if (listeners[event] instanceof Array) {
        if (listeners[event].indexOf(cb) === -1) {
          listeners[event].push(cb);
        }
      } else {
        listeners[event] =[ cb ];
      }
    }

    emit (event, ...args) {
      if (!this.listeners[event]) {
        return
      }
      this.listeners[event].forEach(cb => {
        cb.apply(null, args);
      });
    }

    removeListener (event, listener) {
      const listeners = this.listeners;
      const arr = listeners[event] || [];
      const index = arr.indexOf(listener);
      if (index >= 0) {
        listeners[event].splice(i, 1);
      }
    }

    once (event, cb) {
      const fn = (...args) => {
        cb.apply(null, args);
        this.removeListener(event, fn);
      };
      this.on(event, (...args) => {
        cb.apply(null, args);
        this.removeListener(event, fn);
      });
    }

    removeAllListener (event) {
      this.listeners[event] = [];
    }
  }

  class Cropper extends EventEmitter {
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

      super();
      this.$container = container;
      clearChildren(container);

      // 初始化容器宽高
      this.$rect = {
        width: container.offsetWidth,
        height: container.offsetHeight
      };
      this._initStyle();
      this._mountListener();

      this._initPreview();
      this._initContrller();
    }

    _initStyle () {
      setStyle(this.$container, {
        overflow: 'hidden',
        position: 'relative',
        touchAction: 'none'
      });
    }
    _mountListener () {
      const cb = (entries) => {
        for(const entry of entries) {
          if (entry.target === this.$container) {
            const { width = 0, height = 0 } = entry.contentRect;
            this.$rect = { width, height };
            this.emit(CROPPER_EVENT.SIZE_CHANGE, this.$rect);
          }
        }
      };
      const wrapperObserver = new ResizeObserver(cb);
      wrapperObserver
        .observe(this.$container);

      this.$container
        .addEventListener('wheel', e => {
          this.emit(CROPPER_EVENT.WHEEL, e);
        });

      this.on(CROPPER_EVENT.PREVIEW_LOAD, () => {
        this.controller.setCropBoxCenter();
      });
    }

    _initPreview () {
      this.preview = new Preview(this);

      this.$container
        .append(
          this.preview.getElement()
        );
    }

    _initContrller () {
      this.controller = new Controller(this);

      this.$container
        .append(
          this.controller.getElement()
        );
    }


    // methods
    loadResource (resource) {
      // TODO: 目前只加载远端url
      this.preview.setURL(resource);
    }

    destroy () {
      this.emit(CROPPER_EVENT.BEFORE_DESTROY);
      // TODO: 释放内存
    }
  }

  exports.Blob = blob;
  exports.Canvas = canvas;
  exports.Cropper = Cropper;
  exports.Image = image;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
