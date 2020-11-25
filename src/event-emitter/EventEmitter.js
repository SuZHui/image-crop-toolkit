export class EventEmitter {
  listeners = {}

  on (event, cb) {
    const listeners = this.listeners
    if (listeners[event] instanceof Array) {
      if (listeners[event].indexOf(cb) === -1) {
        listeners[event].push(cb)
      }
    } else {
      listeners[event] =[ cb ]
    }
  }

  emit (event, ...args) {
    if (!this.listeners[event]) {
      return
    }
    this.listeners[event].forEach(cb => {
      cb.apply(null, args)
    })
  }

  removeListener (event, listener) {
    const listeners = this.listeners
    const arr = listeners[event] || []
    const index = arr.indexOf(listener)
    if (index >= 0) {
      listeners[event].splice(i, 1)
    }
  }

  once (event, cb) {
    const fn = (...args) => {
      cb.apply(null, args)
      this.removeListener(event, fn)
    }
    this.on(event, (...args) => {
      cb.apply(null, args)
      this.removeListener(event, fn)
    })
  }

  removeAllListener (event) {
    this.listeners[event] = []
  }
}
