import React from 'react'
import { elevationUtils } from 'config/constants/types'
import styled from 'styled-components'
import { HighlightedText } from 'uikit/components/Text'

interface Props {
  elevation?: string
}

const HeaderCircleWrapper = styled.div`
  z-index: 3;
  height: 212px;
  position: absolute;
  left: 0;
  right: 0;
  top: -106px;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`

const HeaderCircleBackground = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 200px;
  box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};
  position: absolute;
  width: 212px;
  height: 212px;
`

export const HeaderArtwork = styled.div<{ elevation: string }>`
  position: relative;
  background-image: ${({ elevation }) =>
    `url("/images/summit/elevationArtwork${elevationUtils.isElevation(elevation) ? elevation : 'BASE'}.jpg")`};
  filter: drop-shadow(3px 3px 6px black);
  border-radius: 200px;
  background-size: cover;
  width: 200px;
  height: 200px;
`

export const HeaderElevationName = styled(HighlightedText)<{ elevationName: string }>`
  position: absolute;
  color: ${({ elevationName, theme }) => (elevationUtils.isElevation(elevationName) ? 'white' : theme.colors.text)};
  text-shadow: 1px 1px 2px ${({ theme }) => theme.colors.textShadow};
  text-transform: uppercase;
  margin: auto;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  flex-direction: column;
`

export const ElevationPuck: React.FC<Props> = ({ elevation, children }) =>
  !elevation ? null : (
    <HeaderCircleWrapper>
      <HeaderCircleBackground />
      <HeaderArtwork elevation={elevation} />
      <HeaderElevationName header elevationName={elevation}>
        {children}
      </HeaderElevationName>
    </HeaderCircleWrapper>
  )
