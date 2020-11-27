import { setStyle } from '../util/dom'
import { Cropper } from './Cropper'

export function initControllerNodes ($cropper: Cropper) {
  const wrapper = document.createElement('div')
  wrapper.classList.add('cropper_controller')

  const cropBox = document.createElement('div')
  cropBox.classList.add('crop-box')

  const cropFace = document.createElement('span')
  cropFace.classList.add('crop-face')

  const cropLineTop = document.createElement('span')
  cropLineTop.classList.add('crop-line', 'line-top')

  const cropLineLeft = document.createElement('span')
  cropLineLeft.classList.add('crop-line', 'line-left')

  const cropLineBottom = document.createElement('span')
  cropLineBottom.classList.add('crop-line', 'line-bottom')

  const cropLineRight = document.createElement('span')
  cropLineRight.classList.add('crop-line', 'line-right')

  setStyle(wrapper, {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    position: 'relative',
  })
  setStyle(cropBox, {
    willChange: 'transform',
    position: 'absolute',
    top: '0', right: '0', bottom: '0', left: '0',
    outline: `${Math.max($cropper.$rect.width, $cropper.$rect.height)}px solid rgba(0,0,0,0.5)`
  })
  setStyle(cropFace, {
    left: '0',
    top: '0',
    cursor: 'move',
    display: 'block',
    width: '100%',
    height: '100%'
  })
  
  const commonLineStyles = {
    'background-color': '#39f',
    display: 'block',
    height: '100%',
    opacity: '0.4',
    position: 'absolute',
    width: '100%'
  }
  // 线宽
  const lineWeight = '2px'
  
  setStyle(cropLineTop, {
    ...commonLineStyles,
    cursor: 'ns-resize',
    height: lineWeight,
    left: '0',
    top: '0px'
  })
  setStyle(cropLineLeft, {
    ...commonLineStyles,
    cursor: 'ew-resize',
    left: '0px',
    top: '0',
    width: lineWeight
  })
  setStyle(cropLineBottom, {
    ...commonLineStyles,
    bottom: '0px',
    cursor: 'ns-resize',
    height: lineWeight,
    left: '0'
  })
  setStyle(cropLineRight, {
    ...commonLineStyles,
    cursor: 'ew-resize',
    right: '0px',
    top: '0',
    width: lineWeight
  })

  cropBox
    .append(
      cropFace,
      cropLineTop,
      cropLineLeft,
      cropLineBottom,
      cropLineRight,
    )
  wrapper
    .append(cropBox)

  return {
    wrapper,
    cropBox,
    cropFace,
    cropLineTop,
    cropLineLeft,
    cropLineBottom,
    cropLineRight
  }
}