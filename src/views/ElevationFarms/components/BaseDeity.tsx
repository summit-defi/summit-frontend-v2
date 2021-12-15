import { elevationUtils, Elevation } from 'config/constants/types'
import styled from 'styled-components'

export const BaseDeity = styled.div<{ totem: number; selected: boolean }>`
  background-image: ${({ totem, selected }) =>
    `url("/images/expedition/${elevationUtils.getElevationTotemName(Elevation.EXPEDITION, totem)}_${
      selected ? 'FILLED' : 'HOLLOW'
    }.png")`};
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% auto;
  transition: all 0.6s;
  filter: ${({ totem, selected }) =>
    !selected
      ? 'none'
      : `
        drop-shadow(${totem === 0 ? '' : '-'}0.5vw 0.5vw 0.5vw white)
        drop-shadow(${totem === 0 ? '' : '-'}4vw 2vw 4vw #D89D5C)
        drop-shadow(${totem === 0 ? '-' : ''}4vw -2vw 4vw #A45C60)
    `};

  &:hover {
    filter: ${({ totem, selected }) =>
      selected
        ? undefined
        : `
            drop-shadow(${totem === 0 ? '' : '-'}0.5vw 0.5vw 0.5vw white)
            drop-shadow(${totem === 0 ? '' : '-'}1vw 0.5vw 1vw #D89D5C)
            drop-shadow(${totem === 0 ? '-' : ''}1vw -0.5vw 1vw #A45C60)
        `};
  }
`
