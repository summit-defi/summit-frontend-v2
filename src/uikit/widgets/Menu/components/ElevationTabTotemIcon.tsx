import React from 'react'
import { MENU_ENTRY_HEIGHT } from '../config'
import styled from 'styled-components'
import { Elevation, elevationUtils } from 'config/constants'

interface Props {
  elevation: Elevation
  totem: number
  selected: boolean
}

const Wrapper = styled.div`
  width: ${MENU_ENTRY_HEIGHT + 4}px;
  height: ${MENU_ENTRY_HEIGHT + 4}px;
  align-items: center;
  justify-content: center;
  position: relative;
`

const Background = styled.div<{ elevation: string }>`
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  bottom: 12px;
  background-color: ${({ theme, elevation }) => theme.colors[elevation]};
  transform: all 300ms;
  border-radius: 50px;
  box-shadow: 1px 1px 2px ${({ theme }) => theme.colors.textShadow};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`

const Icon = styled.div<{ elevation: Elevation, totem: number, selected: boolean }>`
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  background-image: ${({ elevation, totem }) => `url("/images/totemIcons/${elevationUtils.getElevationTotemName(elevation, totem)}.png")`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  transition: opacity 200ms;
  opacity: ${({ selected }) => selected ? 0 : 1};
`

const ElevationTabTotemIcon: React.FC<Props> = ({
  elevation,
  totem,
  selected,
}) => (
  <Wrapper className="selectableIcon">
    <Background elevation={elevation} />
    <Icon selected={selected} elevation={elevation} totem={totem} />
  </Wrapper>
)

export default React.memo(
  ElevationTabTotemIcon,
  (prev, next) => prev.totem === next.totem && prev.selected === next.selected
)
