import { setStyle } from '../util/dom'
import { Cropper } from './Cropper'

function initPoint () {
  const cropPointN = document.createElement('span')
  cropPointN.classList.add('crop-point', 'point-n')

  const cropPointW = document.createElement('span')
  cropPointW.classList.add('crop-point', 'point-w')

  const cropPointS = document.createElement('span')
  cropPointS.classList.add('crop-point', 'point-s')

  const cropPointE = document.createElement('span')
  cropPointE.classList.add('crop-point', 'point-e')

  const cropPointNE = document.createElement('span')
  cropPointNE.classList.add('crop-point', 'point-ne')

  const cropPointNW = document.createElement('span')
  cropPointNW.classList.add('crop-point', 'point-nw')

  const cropPointSW = document.createElement('span')
  cropPointSW.classList.add('crop-point', 'point-sw')

  const cropPointSE = document.createElement('span')
  cropPointSE.classList.add('crop-point', 'point-se')

  const commonStyle = {
    'background-color': '#39f',
    height: '5px',
    opacity: '0.75',
    width: '5px',
    position: 'absolute'
  }

  const padding = '-2px'

  setStyle(cropPointN, {
    ...commonStyle,
    cursor: 'ns-resize',
    left: '50%',
    'margin-left': padding,
    top: padding
  })
  setStyle(cropPointW, {
    ...commonStyle,
    cursor: 'ew-resize',
    top: '50%',
    'margin-top': padding,
    left: padding
  })
  setStyle(cropPointE, {
    ...commonStyle,
    cursor: 'ew-resize',
    top: '50%',
    'margin-top': padding,
    right: padding
  })
  setStyle(cropPointS, {
    ...commonStyle,
    cursor: 's-resize',
    left: '50%',
    'margin-left': padding,
    bottom: padding
  })
  setStyle(cropPointNE, {
    ...commonStyle,
    cursor: 'nesw-resize',
    top: padding,
    right: padding
  })
  setStyle(cropPointNW, {
    ...commonStyle,
    cursor: 'nwse-resize',
    top: padding,
    left: padding
  })
  setStyle(cropPointSW, {
    ...commonStyle,
    cursor: 'nesw-resize',
    bottom: padding,
    left: padding
  })
  setStyle(cropPointSE, {
    ...commonStyle,
    cursor: 'nwse-resize',
    bottom: padding,
    right: padding
  })

  return {
    cropPointN,
    cropPointW,
    cropPointS,
    cropPointE,
    cropPointNE,
    cropPointNW,
    cropPointSW,
    cropPointSE
  }
}

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
  // 线宽
  const lineWeight = '1px'
  // 可触碰宽度
  const lineOperableWeight = '4px'
  setStyle(cropFace, {
    left: '0',
    top: '0',
    cursor: 'move',
    display: 'block',
    width: '100%',
    height: '100%',
    border: `${lineWeight} solid rgba(51, 153, 255, 0.6)`,
    'box-sizing': 'border-box'
  })
  
  const commonLineStyles = {
    display: 'block',
    height: '100%',
    position: 'absolute',
    width: '100%'
  }
  
  setStyle(cropLineN, {
    ...commonLineStyles,
    cursor: 'ns-resize',
    height: lineOperableWeight,
    left: '0',
    top: '-1px'
  })
  setStyle(cropLineW, {
    ...commonLineStyles,
    cursor: 'ew-resize',
    left: '-1px',
    top: '0',
    width: lineOperableWeight
  })
  setStyle(cropLineS, {
    ...commonLineStyles,
    bottom: '-1px',
    cursor: 'ns-resize',
    height: lineOperableWeight,
    left: '0'
  })
  setStyle(cropLineE, {
    ...commonLineStyles,
    cursor: 'ew-resize',
    right: '-1px',
    top: '0',
    width: lineOperableWeight
  })

  setStyle(cropInfo, {
    'user-select': 'none',
    position: 'absolute',
    left: '0px',
    'min-width': '64px',
    'text-align': 'center',
    color: '#fff',
    'line-height': '20px',
    'background-color': 'rgba(0, 0, 0, 0.6)',
    'font-size': '12px'
  })

  const points = initPoint()

  cropBox
    .append(
      cropFace,
      cropLineN,
      cropLineS,
      cropLineW,
      cropLineE,
      ...Object.values(points),
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
    cropInfo,
    ...points
  }
}