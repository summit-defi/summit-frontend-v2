import React from 'react'
import { elevationUtils } from 'config/constants/types'
import styled from 'styled-components'
import { HighlightedText } from 'uikit/components/Text'

interface Props {
  elevation?: string
  top?: number
}

const PuckSize = 180

const HeaderCircleWrapper = styled.div<{ top?: number }>`
  z-index: 3;
  height: ${PuckSize + 12}px;
  position: absolute;
  width: ${PuckSize + 12}px;
  top: ${({ top }) => top != null ? top : -(PuckSize + 12) / 2}px;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`

const HeaderCircleBackground = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${PuckSize}px;
  box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};
  position: absolute;
  width: ${PuckSize + 12}px;
  height: ${PuckSize + 12}px;
`

export const HeaderArtwork = styled.div<{ elevation: string }>`
  position: relative;
  background-image: ${({ elevation }) =>
    `url("/images/summit/elevationArtwork${elevation || 'BASE'}.jpg")`};
  filter: drop-shadow(3px 3px 6px black);
  border-radius: ${PuckSize}px;
  background-size: cover;
  width: ${PuckSize}px;
  height: ${PuckSize}px;
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

export const ElevationPuck: React.FC<Props> = ({ elevation, children, top }) =>
  !elevation ? null : (
    <HeaderCircleWrapper top={top}>
      <HeaderCircleBackground />
      <HeaderArtwork elevation={elevation} />
      <HeaderElevationName header elevationName={elevation}>
        {children}
      </HeaderElevationName>
    </HeaderCircleWrapper>
  )
