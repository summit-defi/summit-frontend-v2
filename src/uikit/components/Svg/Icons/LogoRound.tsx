import React from 'react'
import styled from 'styled-components'
import { SvgProps } from '../types'

const ShadowSvg = styled.svg`
  box-shadow: 1px 1px 2px ${({ theme }) => theme.colors.textShadow};
  border-radius: 50px;
`

const LogoRound: React.FC<SvgProps> = (props) => {
  return (
    <ShadowSvg viewBox="0 0 36 36" {...props}>
      <image height="36" href="/images/summit/token.png" />
    </ShadowSvg>
  )
}

export default LogoRound
