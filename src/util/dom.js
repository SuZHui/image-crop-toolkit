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
}, boundary = null) {
  const position = {
    x: 0, y: 0
  }

  const handleMove = e => {
    e.preventDefault()
    if (boundary) {
      // TODO: 设置边界判断
      console.dir(boundary.getBoundingClientRect())
    } else {
      onMove({
        x: -(position.x - e.pageX),
        y: -(position.y - e.pageY)
      }, e)
    }
  }
  const handleEnd = e => {
    onEnd({
      x: -(position.x - e.pageX),
      y: -(position.y - e.pageY)
    }, e)
    window.removeEventListener('mousemove', handleMove)
    window.removeEventListener('mouseup', handleEnd)
  }

  const handleStart = e => {
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleEnd)
    position.x = e.pageX
    position.y = e.pageY
    onStart(position, e)
  }

  element.addEventListener('mousedown', handleStart)
}

export {
  clearChildren,
  setStyle,
  addListener,
  removeListener,
  moveable
}