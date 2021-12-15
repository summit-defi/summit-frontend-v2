import React from 'react'
import styled from 'styled-components'
import { OpenNewIcon } from '../Svg'
import { darken } from 'polished'
import Link from './Link'
import { LinkProps } from './types'
import { Elevation, elevationUtils } from 'config/constants/types'
import { pressableMixin } from 'uikit/util/styledMixins'

const StyledExternalIcon = styled(OpenNewIcon)<{ elevation?: Elevation }>`
  fill: ${({ theme, elevation }) =>
    darken(0.2, elevation ? elevationUtils.backgroundColor(elevation, theme) : theme.colors.text)};
  filter: drop-shadow(1px 1px 2px ${({ theme }) => theme.colors.OASIS});
`

const StyleButton = styled(Link)<{ elevation?: Elevation }>`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${({ theme, elevation }) =>
    darken(0.2, elevation ? elevationUtils.backgroundColor(elevation, theme) : theme.colors.text)};
  transition: transform 0.2s;
  font-size: 13;
  font-weight: bold;
  font-family: Courier Prime, monospace;

  ${pressableMixin}
`

const ExternalLinkButton: React.FC<LinkProps> = ({ children, elevation, ...props }) => {
  return (
    <StyleButton external elevation={elevation} rel="noreferrer noopener" target="_blank" {...props}>
      {children}
      <StyledExternalIcon width="20px" elevation={elevation} ml="8px" />
    </StyleButton>
  )
}

export default ExternalLinkButton
