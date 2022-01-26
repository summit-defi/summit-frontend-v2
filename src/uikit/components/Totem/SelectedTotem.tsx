import React from 'react'
import styled, { css } from 'styled-components'
import { Elevation } from 'config/constants/types'
import ArtworkTotem from './ArtworkTotem'
import { pressableMixin } from 'uikit/util/styledMixins'

const Clickable = styled.div<{ disabled?: boolean }>`
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  position: relative;
  transition: transform 0.2s;

  ${({ theme, disabled }) =>
    pressableMixin({
      theme,
      disabled,
      hoverStyles: css`
        transform: ${disabled ? 'none' : 'scale(1.05)'};
      `,
    })}
`

interface TotemProps {
  elevation: Elevation
  totem: number
  size?: string
  navSize?: string
  disabled?: boolean
  onSelect?: (totem: number) => void
}

const SelectedTotem: React.FC<TotemProps> = ({ elevation, totem, size, navSize, disabled, onSelect }) => {
  const handleSelectTotem = () => {
    if (!disabled && onSelect) {
      onSelect(totem)
    }
  }
  return (
    <Clickable onClick={handleSelectTotem} disabled={disabled}>
      <ArtworkTotem
        elevation={elevation}
        withName
        totem={totem}
        desktopSize={size}
        mobileSize={navSize}
        greyed={disabled}
      />
    </Clickable>
  )
}

export default React.memo(SelectedTotem)
