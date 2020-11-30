import { setStyle } from '../util/dom'
import { Cropper } from './Cropper'

export function initControllerNodes ($cropper: Cropper) {
  const wrapper = document.createElement('div')
  wrapper.classList.add('cropper_controller')

  const cropBox = document.createElement('div')
  cropBox.classList.add('crop-box')

  const cropFace = document.createElement('span')
  cropFace.classList.add('crop-face')

  const cropLineN = document.createElement('span')
  cropLineN.classList.add('crop-line', 'line-n')

  const cropLineW = document.createElement('span')
  cropLineW.classList.add('crop-line', 'line-w')

  const cropLineS = document.createElement('span')
  cropLineS.classList.add('crop-line', 'line-s')

  const cropLineE = document.createElement('span')
  cropLineE.classList.add('crop-line', 'line-e')

  const cropInfo = document.createElement('span')
  cropInfo.classList.add('crop-info')

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
  
  setStyle(cropLineN, {
    ...commonLineStyles,
    cursor: 'ns-resize',
    height: lineWeight,
    left: '0',
    top: '0px'
  })
  setStyle(cropLineW, {
    ...commonLineStyles,
    cursor: 'ew-resize',
    left: '0px',
    top: '0',
    width: lineWeight
  })
  setStyle(cropLineS, {
    ...commonLineStyles,
    bottom: '0px',
    cursor: 'ns-resize',
    height: lineWeight,
    left: '0'
  })
  setStyle(cropLineE, {
    ...commonLineStyles,
    cursor: 'ew-resize',
    right: '0px',
    top: '0',
    width: lineWeight
  })

  setStyle(cropInfo, {
    position: 'absolute',
    left: '0px',
    'min-width': '64px',
    'text-align': 'center',
    color: '#fff',
    'line-height': '20px',
    'background-color': 'rgba(0, 0, 0, 0.8)',
    'font-size': '12px'
  })

  cropBox
    .append(
      cropFace,
      cropLineN,
      cropLineS,
      cropLineW,
      cropLineE,
      cropInfo
    )
  wrapper
    .append(cropBox)

  return {
    wrapper,
    cropBox,
    cropFace,
    cropLineN,
    cropLineS,
    cropLineW,
    cropLineE,
    cropInfo
  }
}