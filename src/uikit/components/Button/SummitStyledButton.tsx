import { Elevation } from 'config/constants/types'
import { linearGradient } from 'polished'
import styled, { keyframes } from 'styled-components'
import { getElevationGradientStops } from 'utils'
import StyledButton from './StyledButton'

const Spin = keyframes`
  0%: {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const SummitStyledButton = styled(StyledButton)<{
  height?: number
  padding?: number
  secondary
  elevation: Elevation
  isLocked: boolean
  secondaryColor?: string
}>`
  position: relative;
  height: ${({ height }) => height || 36}px;
  border-radius: 22px;
  border: none;
  padding: 0px ${({ padding }) => padding || 38}px;
  text-shadow: ${({ theme }) => `1px 1px 2px ${theme.colors.textShadow}`};
  box-shadow: ${({ theme, disabled, isLocked }) =>
    disabled || isLocked ? 'none' : `3px 3px 6px ${theme.colors.textShadow}`};
  font-family: Courier Prime, monospace;
  opacity: ${({ disabled, isLocked }) => (disabled || isLocked ? 0.5 : 1)};
  background: ${({ secondary, elevation }) =>
    secondary
      ? 'none'
      : linearGradient({
          colorStops: getElevationGradientStops(elevation),
          toDirection: '120deg',
        })};
  border: ${({ theme, secondary, secondaryColor }) =>
    secondary ? `2px solid ${secondaryColor || theme.colors.text}` : 'none'};
  color: ${({ theme, secondary, secondaryColor }) => (secondary ? secondaryColor || theme.colors.text : '')};

  .spinner {
    fill: white;
    animation: ${Spin} 1.4s infinite linear;
  }
`

export default SummitStyledButton
