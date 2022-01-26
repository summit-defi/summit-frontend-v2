import { elevationUtils, Elevation } from 'config/constants/types'
import styled from 'styled-components'

export const BaseDeity = styled.div<{ deity: number; selected: boolean }>`
  background-image: ${({ deity, selected }) =>
    `url("/images/expedition/${elevationUtils.getElevationTotemName(Elevation.EXPEDITION, deity)}_${
      selected ? 'FILLED' : 'HOLLOW'
    }.png")`};
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% auto;
  transition: all 0.6s;
  filter: ${({ deity, selected }) =>
    !selected
      ? 'none'
      : `
        drop-shadow(${deity === 0 ? '' : '-'}0.5vw 0.5vw 0.5vw white)
        drop-shadow(${deity === 0 ? '' : '-'}4vw 2vw 4vw #D89D5C)
        drop-shadow(${deity === 0 ? '-' : ''}4vw -2vw 4vw #A45C60)
    `};

  &:hover {
    filter: ${({ deity, selected }) =>
      selected
        ? undefined
        : `
            drop-shadow(${deity === 0 ? '' : '-'}0.5vw 0.5vw 0.5vw white)
            drop-shadow(${deity === 0 ? '' : '-'}1vw 0.5vw 1vw #D89D5C)
            drop-shadow(${deity === 0 ? '-' : ''}1vw -0.5vw 1vw #A45C60)
        `};
  }
`
