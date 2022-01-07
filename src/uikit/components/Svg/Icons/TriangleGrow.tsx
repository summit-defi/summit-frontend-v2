import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

interface Props {
  left: number
  right: number
}

const Icon: React.FC<SvgProps & Props> = ({ left, right, ...props }) => {
  const max = Math.max(left, right)
  const scaledLeft = (left / max) * 100
  const scaledRight = (right / max) * 100
  const points = `0,${50 + (scaledLeft / 2)} 0,${50 - (scaledLeft / 2)} 100,${50 - (scaledRight / 2)} 100,${50 + (scaledRight / 2)}`
  // const points = 
  // "0,$ 0,6 15,0 15,15"
  return (
    <Svg viewBox="0 0 100 100" {...props} preserveAspectRatio='none'>
      <polygon points={points}/>
    </Svg>
  )
}

export default Icon
