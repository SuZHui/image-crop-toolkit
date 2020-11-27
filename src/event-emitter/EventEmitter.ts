export class EventEmitter {
  listeners: {[key: string]: Function[]} = {}

  on (event: string, cb: Function) {
    const listeners = this.listeners
    if (listeners[event] instanceof Array) {
      if (listeners[event].indexOf(cb) === -1) {
        listeners[event].push(cb)
      }
    } else {
      listeners[event] =[ cb ]
    }
  }

  emit (event: string, ...args: any[]) {
    if (!this.listeners[event]) {
      return
    }
    this.listeners[event].forEach(cb => {
      cb.apply(null, args)
    })
  }

  removeListener (event: string, listener: Function) {
    const listeners = this.listeners
    const arr = listeners[event] || []
    const index = arr.indexOf(listener)
    if (index >= 0) {
      listeners[event].splice(index, 1)
    }
  }

  once (event: string, cb: Function) {
    const fn = (...args: any[]) => {
      cb.apply(null, args)
      this.removeListener(event, fn)
    }
    this.on(event, (...args: any[]) => {
      cb.apply(null, args)
      this.removeListener(event, fn)
    })
  }

  removeAllListener (event: string) {
    this.listeners[event] = []
  }
}
