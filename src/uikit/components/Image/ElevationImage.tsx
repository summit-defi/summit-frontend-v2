import { transparentize } from 'polished'
import React from 'react'
import styled from 'styled-components'

const LpSymbolWrapper = styled.div<{ width: number; height: number }>`
  position: relative;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`

const BaseSymbolIcon = styled.div<{ elevation: string; width: number; height: number }>`
  position: absolute;
  background-image: ${({ elevation }) => `url("/images/summit/elevationArtwork${elevation}.jpg")`};
  border-radius: 50px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  box-shadow: 1px 1px 2px ${({ theme }) => theme.colors.textShadow};
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`

const SingleSymbolIcon = styled(BaseSymbolIcon)`
  width: ${({ width }) => width * 0.85}px;
  height: ${({ height }) => height * 0.85}px;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
`

interface Props {
  elevation: string
  width: number
  height: number
}

const ElevationImage: React.FC<Props> = ({ elevation, width, height }) => {
  return (
    <LpSymbolWrapper width={width} height={height}>
      <SingleSymbolIcon elevation={elevation} width={width} height={height} />
    </LpSymbolWrapper>
  )
}

export default ElevationImage
