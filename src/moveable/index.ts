type MouseMoveOptions = Partial<Record<'onStart'|'onMove'|'onStop', (e: MouseEvent) => void>>;

export function listenMouseMove (target: HTMLElement, optons: MouseMoveOptions = {}) {
  const handleMove = (e: MouseEvent) => {
    e.preventDefault()
    optons.onMove && optons.onMove(e)
  }
  const handleEnd = (e: MouseEvent) => {
    e.preventDefault()
    optons.onStop && optons.onStop(e)
    window.removeEventListener('mousemove', handleMove)
    window.removeEventListener('mouseup', handleEnd)
  }

  const handleStart = (e: MouseEvent) => {
    e.preventDefault()
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleEnd)
    optons.onStart && optons.onStart(e)
  }

  target.addEventListener('mousedown', handleStart)

  function cancel () {
    target.removeEventListener('mousedown', handleStart)
  }

  return {
    cancel
  }
}