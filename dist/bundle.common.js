'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * file转data url
 * @param {File} blob 
 */
function toDataURL(blob) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      resolve(reader);
    });
    reader.addEventListener('error', function (err) {
      reject(err);
    });
    reader.readAsDataURL(blob);
  });
}

function fromDataURL(dataUrl, type) {
  return new Promise(function (resolve, reject) {
    try {
      var data = dataUrl.split(',')[1];
      var mimePattern = /^data:(.*?)(;base64)?,/;
      var mime = dataUrl.match(mimePattern)[1];
      var binStr = atob(data);
      var length = binStr.length;
      var arr = new Uint8Array(length);

      for (var i = 0; i < length; i++) {
        arr[i] = binStr.charCodeAt(i);
      }

      resolve(new Blob([arr], {
        type: type || mime
      }));
    } catch (err) {
      reject(err);
    }
  });
}
/**
 * file转图片
 * @param {File} blob 
 * @param {width, height} params 
 */


function toImage(blob, _ref) {
  var width = _ref.width,
      height = _ref.height;
  return new Promise(function (resolve, reject) {
    var image = new Image(width, height);
    var URL = webkitURL || URL;
    var source = URL ? URL.createObjectURL(blob) : toDataURL(blob);
    image.src = source;
    image.addEventListener('load', function () {
      resolve(image);
      URL && URL.revokeObjectURL(source);
    });
    image.addEventListener('error', function (err) {
      return reject(err);
    });
  });
}

function fromCanvas(canvas, _ref2) {
  var _ref2$type = _ref2.type,
      type = _ref2$type === void 0 ? 'image/jpeg' : _ref2$type,
      _ref2$quality = _ref2.quality,
      quality = _ref2$quality === void 0 ? 0.8 : _ref2$quality;
  return new Promise(function (resolve) {
    canvas.toBlob(resolve, type, quality);
  });
}

var blob = {
  toDataURL: toDataURL,
  toImage: toImage,
  fromDataURL: fromDataURL,
  fromCanvas: fromCanvas
};

function fromURL(url) {
  return new Promise(function (resolve, reject) {
    var image = new Image();
    image.addEventListener('load', function () {
      resolve(image);
    });
    image.addEventListener('error', function (err) {
      return reject(err);
    });
    image.src = url;
    image.setAttribute('crossOrigin', 'anonymous');
  });
}

function fromDataURL$1(dataUrl) {
  return new Promise(function (resolve, reject) {
    var image = new Image();
    image.addEventListener('load', function () {
      resolve(image);
    });
    image.addEventListener('error', function (err) {
      return reject(err);
    });
    image.src = dataUrl;
  });
}

function toCanvas(image) {
  return new Promise(function (resolve) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    resolve(canvas);
  });
}

var image = {
  fromURL: fromURL,
  fromDataURL: fromDataURL$1,
  toCanvas: toCanvas
};

function toDataURL$1(canvas) {
  var quality = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.8;
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'image/jpeg';
  return new Promise(function (resolve) {
    resolve(canvas.toDataURL(type, quality));
  });
}

var canvas = {
  toDataURL: toDataURL$1
};

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = o[Symbol.iterator]();
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

function clearChildren(dom) {
  dom.innerHTML = '';
}

function setStyle(dom) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  for (var key in props) {
    dom.style[key] = props[key];
  }
}

function moveable(element, _ref) {
  var _ref$onMove = _ref.onMove,
      onMove = _ref$onMove === void 0 ? function () {} : _ref$onMove,
      _ref$onStart = _ref.onStart,
      onStart = _ref$onStart === void 0 ? function () {} : _ref$onStart,
      _ref$onEnd = _ref.onEnd,
      onEnd = _ref$onEnd === void 0 ? function () {} : _ref$onEnd;
  var position = {
    x: 0,
    y: 0
  };

  var handleMove = function handleMove(e) {
    e.preventDefault();
    var _ref2 = [position.x - e.pageX, position.y - e.pageY],
        x = _ref2[0],
        y = _ref2[1];
    onMove({
      x: x,
      y: y
    }, e);
  };

  var handleEnd = function handleEnd(e) {
    e.preventDefault();
    var _ref3 = [-(e.pageX - position.x), -(e.pageY - position.y)],
        x = _ref3[0],
        y = _ref3[1];
    onEnd({
      x: x,
      y: y
    }, e);
    window.removeEventListener('mousemove', handleMove);
    window.removeEventListener('mouseup', handleEnd);
  };

  var handleStart = function handleStart(e) {
    e.preventDefault();
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    position = {
      x: e.pageX,
      y: e.pageY
    };
    onStart(position, e);
  };

  element.addEventListener('mousedown', handleStart);
  return function cancel() {
    element.removeEventListener('mousedown', handleStart);
    position = null;
  };
}

var CROPPER_EVENT = {
  SIZE_CHANGE: 'sizeChange',
  PREVIEW_LOAD: 'previewLoad',
  WHEEL: 'wheel',
  BEFORE_DESTROY: 'beforeDestroy'
};

var Preview = /*#__PURE__*/function () {
  function Preview(crooper) {
    _classCallCheck(this, Preview);

    _defineProperty(this, "$cropper", null);

    _defineProperty(this, "$el", {
      wrapper: null,
      image: null
    });

    _defineProperty(this, "$rect", {
      image: {
        width: 0,
        height: 0
      }
    });

    _defineProperty(this, "$transform", {
      scale: 1
    });

    _defineProperty(this, "url", null);

    this.$cropper = crooper;

    this._init();
  }

  _createClass(Preview, [{
    key: "_init",
    value: function _init() {
      this.$el.wrapper = document.createElement('div');
      this.$el.image = new Image();
      this.$el.wrapper.append(this.$el.image);

      this._initStyle();

      this._mountEvent();
    }
  }, {
    key: "_initStyle",
    value: function _initStyle() {
      setStyle(this.$el.wrapper, {
        backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC")',
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      });
      setStyle(this.$el.image, {
        position: 'absolute',
        webkitUserDrag: 'none'
      });
    } // 挂载事件

  }, {
    key: "_mountEvent",
    value: function _mountEvent() {
      this.$cropper.on(CROPPER_EVENT.SIZE_CHANGE, this.onWrapperSizeChange.bind(this));
      this.$cropper.on(CROPPER_EVENT.WHEEL, this.onPreviewZoom.bind(this));
      var image = this.$el.image;
      this.onImageLoad = this.onImageLoad.bind(this);
      this.onImageError = this.onImageError.bind(this);
      image.addEventListener('load', this.onImageLoad);
      image.addEventListener('error', this.onImageError);
    } // internal event

  }, {
    key: "onWrapperSizeChange",
    value: function onWrapperSizeChange() {
      this.fullDisplayImage();
    }
  }, {
    key: "onImageLoad",
    value: function onImageLoad() {
      var _ref = [this.$el.image.naturalWidth, this.$el.image.naturalHeight],
          nw = _ref[0],
          nh = _ref[1];
      this.$rect.image = {
        width: nw,
        height: nh
      };
      this.$el.image.width = nw;
      this.$el.image.height = nh;
      this.fullDisplayImage();
      this.$cropper.emit(CROPPER_EVENT.PREVIEW_LOAD);
    }
  }, {
    key: "onImageError",
    value: function onImageError(err) {
      console.error(err);
    }
  }, {
    key: "onPreviewZoom",
    value: function onPreviewZoom(e) {
      var _this = this;

      var ratio = 0.1;
      var delta = 1;
      e.preventDefault(); // 限制滚轮速度防止缩放过快

      if (this.wheeling) return;
      this.wheeling = true;
      setTimeout(function () {
        _this.wheeling = false;
      }, 50);

      if (e.deltaY) {
        delta = e.deltaY > 0 ? 1 : -1;
      } else if (e.wheelDelta) {
        delta = -e.wheelDelta / 120;
      } else if (e.detail) {
        delta = e.detail > 0 ? 1 : -1;
      }

      this.zoom(-delta * ratio);
    } // internal method

  }, {
    key: "fullDisplayImage",
    value: function fullDisplayImage() {
      var imageRect = this.$rect.image;
      var wrapperRect = this.$cropper.$rect; // 完整显示图片

      var scaleRatio = Math.min(wrapperRect.width / imageRect.width, wrapperRect.height / imageRect.height);
      this.$transform.scale = scaleRatio;
      setStyle(this.$el.image, {
        left: "".concat((wrapperRect.width - imageRect.width) / 2, "px"),
        top: "".concat((wrapperRect.height - imageRect.height) / 2, "px"),
        transform: "scale(".concat(scaleRatio, ")")
      });
    }
    /**
     * Methods
     */

  }, {
    key: "getElement",
    value: function getElement() {
      return this.$el.wrapper;
    }
  }, {
    key: "getImageRect",
    value: function getImageRect() {
      var scale = this.$transform.scale;
      return {
        nWidth: this.$rect.image.width,
        nHeight: this.$rect.image.height,
        cWidth: this.$rect.image.width * scale,
        cHeight: this.$rect.image.height * scale
      };
    }
  }, {
    key: "setURL",
    value: function setURL(url) {
      this.url = url;
      this.$el.image.src = url;
    } // 缩放

  }, {
    key: "zoom",
    value: function zoom(ratio) {
      this.$transform.scale = this.$transform.scale * (1 + ratio);
      setStyle(this.$el.image, {
        transform: "scale(".concat(this.$transform.scale, ")")
      });
    }
  }]);

  return Preview;
}();

var Controller = /*#__PURE__*/function () {
  function Controller(container) {
    _classCallCheck(this, Controller);

    _defineProperty(this, "$cropper", null);

    _defineProperty(this, "$el", {
      wrapper: null,
      cropBox: null,
      cropFace: null,
      // 剪切的边框
      cropLineTop: null,
      cropLineBottom: null,
      cropLineLeft: null,
      cropLineRight: null
    });

    _defineProperty(this, "$position", {
      x: 0,
      y: 0
    });

    _defineProperty(this, "$rect", {
      cropBox: {
        width: 0,
        height: 0
      }
    });

    this.$cropper = container;

    this._init();
  }

  _createClass(Controller, [{
    key: "_init",
    value: function _init() {
      this._initDom();

      this._mountEvent();

      this._mountDom();
    }
  }, {
    key: "_initDom",
    value: function _initDom() {
      this.$el.wrapper = document.createElement('div');
      this.$el.cropBox = document.createElement('div');
      this.$el.cropBox.classList.add('crop-box');
      this.$el.cropFace = document.createElement('span');
      this.$el.cropLineTop = document.createElement('span');
      this.$el.cropLineTop.classList.add('crop-line', 'line-top');
      this.$el.cropLineLeft = document.createElement('span');
      this.$el.cropLineLeft.classList.add('crop-line', 'line-left');
      this.$el.cropLineBottom = document.createElement('span');
      this.$el.cropLineBottom.classList.add('crop-line', 'line-bottom');
      this.$el.cropLineRight = document.createElement('span');
      this.$el.cropLineRight.classList.add('crop-line', 'line-right');

      this._initStyle();
    }
  }, {
    key: "_mountDom",
    value: function _mountDom() {
      this.$el.cropBox.append(this.$el.cropFace, this.$el.cropLineTop, this.$el.cropLineLeft, this.$el.cropLineBottom, this.$el.cropLineRight);
      this.$el.wrapper.append(this.$el.cropBox);
    }
  }, {
    key: "_initStyle",
    value: function _initStyle() {
      setStyle(this.$el.wrapper, {
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        position: 'relative'
      });
      setStyle(this.$el.cropBox, {
        willChange: 'transform',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        outline: "".concat(Math.max(this.$cropper.$rect.width, this.$cropper.$rect.height), "px solid rgba(0,0,0,0.5)")
      });
      setStyle(this.$el.cropFace, {
        left: 0,
        top: 0,
        cursor: 'move',
        display: 'block',
        width: '100%',
        height: '100%'
      });
      var commonLineStyles = {
        backgroundColor: '#39f',
        display: 'block',
        height: '100%',
        opacity: 0.1,
        position: 'absolute',
        width: '100%'
      }; // 线宽

      var lineWeight = '5px';
      setStyle(this.$el.cropLineTop, _objectSpread2(_objectSpread2({}, commonLineStyles), {}, {
        cursor: 'ns-resize',
        height: lineWeight,
        left: 0,
        top: '-3px'
      }));
      setStyle(this.$el.cropLineLeft, _objectSpread2(_objectSpread2({}, commonLineStyles), {}, {
        cursor: 'ew-resize',
        left: '-3px',
        top: 0,
        width: lineWeight
      }));
      setStyle(this.$el.cropLineBottom, _objectSpread2(_objectSpread2({}, commonLineStyles), {}, {
        bottom: '-3px',
        cursor: 'ns-resize',
        height: '5px',
        left: 0
      }));
      setStyle(this.$el.cropLineRight, _objectSpread2(_objectSpread2({}, commonLineStyles), {}, {
        cursor: 'ew-resize',
        right: '-3px',
        top: 0,
        width: '5px'
      }));
    }
  }, {
    key: "_mountEvent",
    value: function _mountEvent() {
      var _this = this;

      var cancel = moveable(this.$el.cropBox, {
        onMove: function onMove(e) {
          var _ref = [_this.$position.x - e.x, _this.$position.y - e.y],
              x = _ref[0],
              y = _ref[1];

          _this.setCropPosition(_this._toSafePosition({
            left: x,
            top: y
          }), false);
        },
        onEnd: function onEnd(e) {
          _this.setCropPosition(_this._toSafePosition({
            left: _this.$position.x - e.x,
            top: _this.$position.y - e.y
          }));
        },
        onStart: function onStart() {
          console.log('move');
        }
      }, this.$cropper.$container);

      var cancelCropLineEvent = this._addCropLineEvent(); // 容器大小改变时调整遮罩大小


      this.$cropper.on(CROPPER_EVENT.SIZE_CHANGE, function (rect) {
        setStyle(_this.$el.cropBox, {
          outline: "".concat(Math.max(rect.width, rect.height), "px solid rgba(0,0,0,0.5)")
        });
      });
      this.$cropper.on(CROPPER_EVENT.BEFORE_DESTROY, function () {
        cancel();
        cancelCropLineEvent();
      });
    }
  }, {
    key: "_addCropLineEvent",
    value: function _addCropLineEvent() {
      var _this2 = this;

      var cancelTopLine = moveable(this.$el.cropLineTop, {
        onMove: function onMove(e) {
          if (_this2.$position.y - e.y <= 0 || _this2.$position.y - e.y >= _this2.$cropper.$rect.height) return;
          var _this2$$rect$cropBox = _this2.$rect.cropBox,
              height = _this2$$rect$cropBox.height,
              width = _this2$$rect$cropBox.width;

          _this2.setCropSize(_this2._toSafeSize({
            width: width,
            height: height + e.y
          }), false);

          _this2.setCropPosition(_this2._toSafePosition({
            left: _this2.$position.x,
            top: _this2.$position.y - e.y
          }, true), false);
        },
        onEnd: function onEnd(e) {
          _this2.setCropSize(_this2._toSafeSize({
            height: _this2.$rect.cropBox.height + e.y,
            width: _this2.$rect.cropBox.width
          }));

          _this2.setCropPosition(_this2._toSafePosition({
            left: _this2.$position.x,
            top: _this2.$position.y - e.y
          }));
        },
        onStart: function onStart(_, e) {
          // 阻止事件向下传播，阻止move事件触发
          e.stopImmediatePropagation();
        }
      });
      var cancelBottomLine = moveable(this.$el.cropLineBottom, {
        onMove: function onMove(e) {
          var _this2$$rect$cropBox2 = _this2.$rect.cropBox,
              height = _this2$$rect$cropBox2.height,
              width = _this2$$rect$cropBox2.width;
          if (_this2.$position.y + height - e.y <= 0 || _this2.$position.y + height - e.y >= _this2.$cropper.$rect.height) return;

          _this2.setCropSize(_this2._toSafeSize({
            width: width,
            height: height - e.y
          }), false);
        },
        onEnd: function onEnd(e) {
          _this2.setCropSize(_this2._toSafeSize({
            height: _this2.$rect.cropBox.height - e.y,
            width: _this2.$rect.cropBox.width
          }));

          _this2.setCropPosition(_this2._toSafePosition({
            left: _this2.$position.x,
            top: _this2.$position.y - e.y
          }));
        },
        onStart: function onStart(_, e) {
          // 阻止事件向下传播，阻止move事件触发
          e.stopImmediatePropagation();
        }
      });
      return function cancel() {
        cancelTopLine();
        cancelBottomLine();
      };
    }
    /**
     * 传入给定的左上角坐标点 转换为安全位置
     * @param {*} param0 
     * @param {boolean} isPoint 是否以一个点为区域内的移动元素
     */

  }, {
    key: "_toSafePosition",
    value: function _toSafePosition(_ref2) {
      var _ref2$left = _ref2.left,
          left = _ref2$left === void 0 ? 0 : _ref2$left,
          _ref2$top = _ref2.top,
          top = _ref2$top === void 0 ? 0 : _ref2$top;
      var isPoint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var cropBoxRect = this.$rect.cropBox;
      var rootRect = this.$cropper.$rect;

      var _ref3 = isPoint ? [rootRect.width, rootRect.height] : [rootRect.width - cropBoxRect.width, rootRect.height - cropBoxRect.height],
          _ref4 = _slicedToArray(_ref3, 2),
          width = _ref4[0],
          height = _ref4[1];

      return {
        x: Math.max(Math.min(width, left), 0),
        y: Math.max(Math.min(height, top), 0)
      };
    }
  }, {
    key: "_toSafeSize",
    value: function _toSafeSize(_ref5) {
      var _ref5$width = _ref5.width,
          width = _ref5$width === void 0 ? 0 : _ref5$width,
          _ref5$height = _ref5.height,
          height = _ref5$height === void 0 ? 0 : _ref5$height;
      var rootRect = this.$cropper.$rect; // const cropBoxRect = this.$rect.cropBox
      // const [cWidth, cHeight] = isPoint
      //   ? []
      //   : []

      return {
        width: Math.min(rootRect.width, width),
        height: Math.min(rootRect.height, height)
      };
    }
    /**
     * Method
     */

  }, {
    key: "getElement",
    value: function getElement() {
      return this.$el.wrapper;
    }
    /**
     * 
     * @param {*} param0 
     * @param {boolean} recordSize 是否记录当前大小
     */

  }, {
    key: "setCropSize",
    value: function setCropSize(_ref6) {
      var _ref6$width = _ref6.width,
          width = _ref6$width === void 0 ? 0 : _ref6$width,
          _ref6$height = _ref6.height,
          height = _ref6$height === void 0 ? 0 : _ref6$height;
      var recordSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      recordSize && (this.$rect.cropBox = {
        width: width,
        height: height
      });
      setStyle(this.$el.cropBox, {
        width: "".concat(width, "px"),
        height: "".concat(height, "px")
      });
    }
    /**
     *
     * @param {*} param0 
     * @param {boolean} cachePosition 是否记录当前位置
     */

  }, {
    key: "setCropPosition",
    value: function setCropPosition(_ref7) {
      var _ref7$x = _ref7.x,
          x = _ref7$x === void 0 ? 0 : _ref7$x,
          _ref7$y = _ref7.y,
          y = _ref7$y === void 0 ? 0 : _ref7$y;
      var recordPosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      recordPosition && (this.$position = {
        x: x,
        y: y
      });
      setStyle(this.$el.cropBox, {
        transform: "translate3d(".concat(x, "px, ").concat(y, "px, 0px)")
      });
    } // 设置裁切框居中

  }, {
    key: "setCropBoxCenter",
    value: function setCropBoxCenter() {
      // 默认缩小为视口的0.8
      var _this$$cropper = this.$cropper,
          preview = _this$$cropper.preview,
          $rect = _this$$cropper.$rect;
      var imageRect = preview.getImageRect();
      var cropSize = {
        width: imageRect.cWidth * 0.8,
        height: imageRect.cHeight * 0.8
      };
      var position = {
        x: ($rect.width - cropSize.width) / 2,
        y: ($rect.height - cropSize.height) / 2
      };
      this.setCropSize(cropSize);
      this.setCropPosition(position);
    }
  }]);

  return Controller;
}();

var EventEmitter = /*#__PURE__*/function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);

    _defineProperty(this, "listeners", {});
  }

  _createClass(EventEmitter, [{
    key: "on",
    value: function on(event, cb) {
      var listeners = this.listeners;

      if (listeners[event] instanceof Array) {
        if (listeners[event].indexOf(cb) === -1) {
          listeners[event].push(cb);
        }
      } else {
        listeners[event] = [cb];
      }
    }
  }, {
    key: "emit",
    value: function emit(event) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (!this.listeners[event]) {
        return;
      }

      this.listeners[event].forEach(function (cb) {
        cb.apply(null, args);
      });
    }
  }, {
    key: "removeListener",
    value: function removeListener(event, listener) {
      var listeners = this.listeners;
      var arr = listeners[event] || [];
      var index = arr.indexOf(listener);

      if (index >= 0) {
        listeners[event].splice(i, 1);
      }
    }
  }, {
    key: "once",
    value: function once(event, cb) {
      var _this = this;

      var fn = function fn() {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        cb.apply(null, args);

        _this.removeListener(event, fn);
      };

      this.on(event, function () {
        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        cb.apply(null, args);

        _this.removeListener(event, fn);
      });
    }
  }, {
    key: "removeAllListener",
    value: function removeAllListener(event) {
      this.listeners[event] = [];
    }
  }]);

  return EventEmitter;
}();

var Cropper = /*#__PURE__*/function (_EventEmitter) {
  _inherits(Cropper, _EventEmitter);

  var _super = _createSuper(Cropper);

  // 主容器
  // 图片预览窗口
  // 裁切栏
  function Cropper(container) {
    var _this;

    _classCallCheck(this, Cropper);

    if (!container) {
      throw new Error('container不存在！');
    }

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "$container", null);

    _defineProperty(_assertThisInitialized(_this), "preview", null);

    _defineProperty(_assertThisInitialized(_this), "controller", null);

    _defineProperty(_assertThisInitialized(_this), "$rect", {
      width: 0,
      height: 0
    });

    _this.$container = container;
    clearChildren(container); // 初始化容器宽高

    _this.$rect = {
      width: container.offsetWidth,
      height: container.offsetHeight
    };

    _this._initStyle();

    _this._mountListener();

    _this._initPreview();

    _this._initContrller();

    return _this;
  }

  _createClass(Cropper, [{
    key: "_initStyle",
    value: function _initStyle() {
      setStyle(this.$container, {
        overflow: 'hidden',
        position: 'relative',
        touchAction: 'none'
      });
    }
  }, {
    key: "_mountListener",
    value: function _mountListener() {
      var _this2 = this;

      var cb = function cb(entries) {
        var _iterator = _createForOfIteratorHelper(entries),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var entry = _step.value;

            if (entry.target === _this2.$container) {
              var _entry$contentRect = entry.contentRect,
                  _entry$contentRect$wi = _entry$contentRect.width,
                  width = _entry$contentRect$wi === void 0 ? 0 : _entry$contentRect$wi,
                  _entry$contentRect$he = _entry$contentRect.height,
                  height = _entry$contentRect$he === void 0 ? 0 : _entry$contentRect$he;
              _this2.$rect = {
                width: width,
                height: height
              };

              _this2.emit(CROPPER_EVENT.SIZE_CHANGE, _this2.$rect);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      };

      var wrapperObserver = new ResizeObserver(cb);
      wrapperObserver.observe(this.$container);
      this.$container.addEventListener('wheel', function (e) {
        _this2.emit(CROPPER_EVENT.WHEEL, e);
      });
      this.on(CROPPER_EVENT.PREVIEW_LOAD, function () {
        _this2.controller.setCropBoxCenter();
      });
    }
  }, {
    key: "_initPreview",
    value: function _initPreview() {
      this.preview = new Preview(this);
      this.$container.append(this.preview.getElement());
    }
  }, {
    key: "_initContrller",
    value: function _initContrller() {
      this.controller = new Controller(this);
      this.$container.append(this.controller.getElement());
    } // methods

  }, {
    key: "loadResource",
    value: function loadResource(resource) {
      // TODO: 目前只加载远端url
      this.preview.setURL(resource);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.emit(CROPPER_EVENT.BEFORE_DESTROY); // TODO: 释放内存
    }
  }]);

  return Cropper;
}(EventEmitter);

exports.Blob = blob;
exports.Canvas = canvas;
exports.Cropper = Cropper;
exports.Image = image;
