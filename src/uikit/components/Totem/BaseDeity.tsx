import { elevationUtils, Elevation } from 'config/constants/types'
import styled, { css } from 'styled-components'

export const BaseDeity = styled.div<{ deity: number; selected: boolean, inverted?: boolean }>`
  /* background-image: url("/images/expedition/${({ selected }) => selected ? 'DEITY_GLOW' : 'EMPTY_DEITY_GLOW'}.png"); */
  background-color: transparent;

  /* background-image: ${({ deity, selected }) => `
    url("/images/expedition/${elevationUtils.getElevationTotemName(Elevation.EXPEDITION, deity)}_OUTLINE.png"),
    url("/images/expedition/${elevationUtils.getElevationTotemName(Elevation.EXPEDITION, deity)}_${selected ? 'FILL_GLOW' : 'OUTLINE'}.png")
  `}; */
  /* background-repeat: no-repeat;
  background-position: center;
  background-size: auto 200%;
  transition: background-image 250ms; */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  /* filter: ${({ deity, selected }) =>
    !selected
      ? 'none'
      : `
        drop-shadow(${deity === 0 ? '' : '-'}0.5vw 0.5vw 0.5vw white)
        drop-shadow(${deity === 0 ? '' : '-'}4vw 2vw 4vw #D89D5C)
        drop-shadow(${deity === 0 ? '-' : ''}4vw -2vw 4vw #A45C60)
    `};
  */

  &:hover:after {
    ${({ deity, selected }) => !selected && css`
      background-image:
        url("/images/expedition/${elevationUtils.getElevationTotemName(Elevation.EXPEDITION, deity)}_OUTLINE.png"),
        url("/images/expedition/${elevationUtils.getElevationTotemName(Elevation.EXPEDITION, deity)}_FILL_GLOW.png");
    `}
  }

  &:before {
    pointer-events: none;
    transition: background-image 0.6s;
    position: absolute;
    content: ' ';
    width: 185%;
    height: 185%;
    transform: scaleX(${({ deity }) => deity === 0 ? -1 : 1});
    background-image: url("/images/expedition/${({ selected, inverted }) => selected ? `${inverted ? 'INV_' : ''}DEITY_GLOW` : 'EMPTY_DEITY_GLOW'}.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: auto 100%;
  }

  &:after {
    transition: background-image 0.6s;
    position: absolute;
    content: ' ';
    width: 100%;
    height: 100%;
    background-image: ${({ deity, selected }) => `
      url("/images/expedition/${elevationUtils.getElevationTotemName(Elevation.EXPEDITION, deity)}_OUTLINE.png"),
      url("/images/expedition/${elevationUtils.getElevationTotemName(Elevation.EXPEDITION, deity)}_${selected ? 'FILL_GLOW' : 'OUTLINE'}.png")
    `};
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% auto;
  }
`
