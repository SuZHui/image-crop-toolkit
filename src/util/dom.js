function clearChildren (dom) {
  dom.innerHTML = ''
}

function setStyle (dom, props = {}) {
  for (const key in props) {
    dom.style[key] = props[key]
  }
}

const REGEXP_SPACES = /\s\s*/

function addListener (element, type, listener, options = {}) {
  let handler = listener

  type.trim().split(REGEXP_SPACES).forEach((event) => {
    if (options.once) {
      const { listeners = {} } = element

      handler = (...args) => {
        delete listeners[event][listener]
        element.removeEventListener(event, handler, options)
        listener.apply(element, args)
      };

      if (!listeners[event]) {
        listeners[event] = {}
      }

      if (listeners[event][listener]) {
        element.removeEventListener(event, listeners[event][listener], options)
      }

      listeners[event][listener] = handler
      element.listeners = listeners
    }

    element.addEventListener(event, handler, options)
  })
}

function removeListener (element, type, listener, options = {}) {
  let handler = listener

  type.trim().split(REGEXP_SPACES).forEach((event) => {
    if (!onceSupported) {
      const { listeners } = element

      if (listeners && listeners[event] && listeners[event][listener]) {
        handler = listeners[event][listener]
        delete listeners[event][listener]

        if (Object.keys(listeners[event]).length === 0) {
          delete listeners[event]
        }

        if (Object.keys(listeners).length === 0) {
          delete element.listeners
        }
      }
    }

    element.removeEventListener(event, handler, options)
  })
}

function moveable (element, {
  onMove = () => {},
  onStart = () => {},
  onEnd = () => {}
}, boundary) {
  let position = {
    x: 0, y: 0
  }
  let padding = null
  // 获取鼠标在四周碰撞区域的可移动范围
  const getBoundaryPadding = () => {
    const boundaryRect = boundary.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()
    // debugger
    const xMin = boundaryRect.left - elementRect.left
    const xMax = boundaryRect.right - elementRect.right
    const yMin = boundaryRect.top - elementRect.top
    const yMax = boundaryRect.bottom - elementRect.bottom

    return {
      xMin, xMax,
      yMin, yMax
    }
  }

  const handleMove = e => {
    e.preventDefault()

    let [x, y] = [e.pageX - position.x, e.pageY - position.y]
    if (boundary) {
      x = Math.min(Math.max(padding.xMin, x), padding.xMax)
      y = Math.min(Math.max(padding.yMin, y), padding.yMax)
    } 
    onMove({ x, y }, e)
  }
  const handleEnd = e => {
    let [x, y] = [e.pageX - position.x, e.pageY - position.y]
    if (boundary) {
      x = Math.min(Math.max(padding.xMin, x), padding.xMax)
      y = Math.min(Math.max(padding.yMin, y), padding.yMax)
    } 
    onEnd({ x, y }, e)
    window.removeEventListener('mousemove', handleMove)
    window.removeEventListener('mouseup', handleEnd)
  }

  const handleStart = e => {
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleEnd)
    if (boundary) {
      padding = getBoundaryPadding()
    }
    position = { x: e.pageX, y: e.pageY }
    onStart(position, e)
  }

  element.addEventListener('mousedown', handleStart)

  return function cancel () {
    element.removeEventListener('mousedown', handleStart)
    position = null
    padding = null
  }
}

export {
  clearChildren,
  setStyle,
  addListener,
  removeListener,
  moveable
}