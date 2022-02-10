import { ElevOrPalette } from 'config/constants/types'
import styled from 'styled-components'
import { paletteLinearGradientBackground } from 'uikit/util/styledMixins'
import { SpinnerKeyframes } from '../Svg/Icons/Spinner'
import StyledButton from './StyledButton'

const SummitStyledButton = styled(StyledButton)<{
  height?: number
  padding?: number
  $secondary: boolean
  $summitPalette?: ElevOrPalette
  $isLocked: boolean
}>`
  position: relative;
  height: ${({ height }) => height || 36}px;
  border-radius: 22px;
  border: none;
  
  padding: 0px ${({ padding }) => padding || 38}px;
  box-shadow: ${({ theme, disabled, $isLocked }) => disabled || $isLocked ? 'none' : `1px 1px 2px ${theme.colors.textShadow}`};
  
  opacity: ${({ disabled, $isLocked }) => (disabled || $isLocked ? 0.5 : 1)};
  ${({ theme, $secondary, $summitPalette }) => paletteLinearGradientBackground({ theme, secondary: $secondary, summitPalette: $summitPalette })}
  
  > * {
    text-align: center;
    font-family: Courier Prime, monospace;
    color: ${({ theme, $secondary }) => ($secondary ? theme.colors.text : '')};
  }

  .spinner {
    fill: white;
    animation: ${SpinnerKeyframes} 1.4s infinite linear;
  }
`

export default SummitStyledButton
