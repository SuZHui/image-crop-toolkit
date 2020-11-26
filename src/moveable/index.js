const DEFAULT_OPTIONS = {
  onStart() {},
  onMove() {},
  onStop() {}
}

export function listenMouseMove (target, optons = DEFAULT_OPTIONS, boundary) {
  if (boundary && !boundary.contains(element)) {
    throw new Error('boundary不包含element')
  }
  
  const handleMove = e => {
    e.preventDefault()
    optons.onMove(e)
  }
  const handleEnd = e => {
    e.preventDefault()
    optons.onStop(e)
    window.removeEventListener('mousemove', handleMove)
    window.removeEventListener('mouseup', handleEnd)
  }

  const handleStart = e => {
    e.preventDefault()
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleEnd)
    optons.onStart(e)
  }

  target.addEventListener('mousedown', handleStart)

  function cancel () {
    target.removeEventListener('mousedown', handleStart)
  }

  return {
    cancel
  }
}