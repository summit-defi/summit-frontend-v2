import React from 'react'
import styled from 'styled-components'
import { OpenNewIcon } from '../Svg'
import { darken } from 'polished'
import Link from './Link'
import { LinkProps } from './types'
import { ElevOrPalette } from 'config/constants/types'
import { pressableMixin } from 'uikit/util/styledMixins'

const StyledExternalIcon = styled(OpenNewIcon)<{ summitPalette?: ElevOrPalette }>`
  fill: ${({ theme, summitPalette: elevation }) =>
    darken(0.2, elevation ? theme.colors[elevation] : theme.colors.text)};
  filter: drop-shadow(1px 1px 2px ${({ theme }) => theme.colors.OASIS});
`

const StyleButton = styled(Link)<{ summitPalette?: ElevOrPalette }>`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${({ theme, summitPalette: elevation }) =>
    darken(0.2, elevation ? theme.colors[elevation] : theme.colors.text)};
  font-size: 13px;
  font-weight: bold;
  font-family: Courier Prime, monospace;

  ${pressableMixin}
`

const ExternalLinkButton: React.FC<LinkProps> = ({ children, summitPalette, ...props }) => {
  return (
    <StyleButton external summitPalette={summitPalette} rel="noreferrer noopener" target="_blank" {...props}>
      {children}
      <StyledExternalIcon width="20px" summitPalette={summitPalette} ml="8px" />
    </StyleButton>
  )
}

export default ExternalLinkButton
