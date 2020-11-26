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

export {
  clearChildren,
  setStyle,
  addListener,
  removeListener
}
