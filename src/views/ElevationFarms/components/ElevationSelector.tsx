import React, { useCallback } from 'react'
import styled, { css } from 'styled-components'
import { Flex, Lock } from 'uikit'
import SummitButton from 'uikit/components/Button/SummitButton'
import { darken } from 'polished'
import { Elevation } from 'config/constants/types'
import { pressableMixin } from 'uikit/util/styledMixins'
import { SelectorWrapperBase } from 'uikit/widgets/Selector/styles'

const buttonWidth = 85
const buttonWidthVertical = 140
const buttonHeight = 28

const SelectorFlex = styled(Flex)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const StyledLock = styled(Lock)`
  position: absolute;
  align-self: center;
  transform: rotate(20deg);
  fill: white;
  filter: drop-shadow(0px 0px 8px black) drop-shadow(0px 0px 2px black);
  z-index: 4;
`

const SelectorWrapper = styled(SelectorWrapperBase)<{
  elevationsCount: number
  vertical: boolean
  desktopOnlyVertical: boolean
}>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: ${buttonHeight + 4}px;
  width: ${({ elevationsCount }) => buttonWidth * elevationsCount}px;
  border-radius: 16px;
  position: relative;

  ${({ vertical, elevationsCount }) =>
    vertical &&
    css`
      flex-direction: column;
      height: ${elevationsCount * buttonHeight + 4}px;
      width: ${buttonWidthVertical}px;
    `}

  ${({ desktopOnlyVertical, elevationsCount }) =>
    desktopOnlyVertical &&
    css`
      ${({ theme }) => theme.mediaQueries.nav} {
        flex-direction: column;
        height: ${elevationsCount * buttonHeight + 4}px;
        width: ${buttonWidthVertical}px;
      }
    `}

  ${({ isLocked }) =>
    isLocked &&
    css`
      filter: grayscale(1);
      opacity: 0.5;
    `}
`

const SelectedSummitButton = styled(SummitButton)<{
  selectedIndex: number
  vertical: boolean
  desktopOnlyVertical: boolean
}>`
  pointer-events: none;
  position: absolute;
  top: 2px;
  height: 28px;
  width: ${buttonWidth - 4}px;
  left: ${({ selectedIndex }) => selectedIndex * buttonWidth + 2}px;
  top: 2px;
  z-index: 3;

  ${({ vertical, selectedIndex }) =>
    vertical &&
    css`
      width: ${buttonWidthVertical - 4}px;
      left: 2px;
      top: ${selectedIndex * buttonHeight + 2}px;
    `}

  ${({ desktopOnlyVertical, selectedIndex }) =>
    desktopOnlyVertical &&
    css`
      ${({ theme }) => theme.mediaQueries.nav} {
        width: ${buttonWidthVertical - 4}px;
        left: 2px;
        top: ${selectedIndex * buttonHeight + 2}px;
      }
    `}
`

const TextButton = styled.div<{
  elevation: Elevation
  disabled: boolean
  strikethrough: boolean
  vertical: boolean
  desktopOnlyVertical: boolean
}>`
  width: ${buttonWidth}px;
  color: ${({ theme, elevation }) => darken(0.2, theme.colors[elevation])};
  text-shadow: 1px 1px 2px ${({ theme, elevation }) => darken(0.2, theme.colors[elevation])};
  font-family: Courier Prime, monospace;
  font-size: 14px;
  height: ${buttonHeight}px;
  line-height: 32px;
  text-align: center;

  ${({ strikethrough }) =>
    strikethrough &&
    css`
      text-decoration: line-through;
    `}

  ${({ theme, disabled }) =>
    pressableMixin({
      theme,
      disabled,
      disabledStyles: css`
        text-shadow: none;
      `,
    })}

  ${({ vertical }) =>
    vertical &&
    css`
      width: ${buttonWidthVertical}px;
    `}

  ${({ desktopOnlyVertical }) =>
    desktopOnlyVertical &&
    css`
      ${({ theme }) => theme.mediaQueries.nav} {
        width: ${buttonWidthVertical}px;
      }
    `}
`

interface Props {
  selected: Elevation
  vertical?: boolean
  desktopOnlyVertical?: boolean
  disabled?: boolean
  elevations: Elevation[]
  isLocked?: boolean
  disabledElevations?: Elevation[]
  selectElevation: (elevation: Elevation) => void
}

const FarmTypeSelector: React.FC<Props> = ({
  selected,
  vertical = false,
  desktopOnlyVertical = false,
  isLocked = false,
  disabled = false,
  elevations,
  disabledElevations = [],
  selectElevation,
}) => {
  const selectedIndex = elevations.findIndex((elevation) => elevation === selected)
  const handleSelectElevation = useCallback((elevation) => {
    if (isLocked || disabled || disabledElevations.includes(elevation)) return
    selectElevation(elevation)
  }, [isLocked, disabled, disabledElevations, selectElevation])

  return (
    <SelectorFlex>
      <SelectorWrapper
        elevationsCount={elevations.length}
        isLocked={isLocked}
        disabled={disabled}
        vertical={vertical}
        desktopOnlyVertical={desktopOnlyVertical}
      >
        {selected != null && (
          <SelectedSummitButton
            summitPalette={selected}
            selectedIndex={selectedIndex}
            vertical={vertical}
            disabled={disabled || isLocked}
            desktopOnlyVertical={desktopOnlyVertical}
            padding="0px"
          >
            {selected}
          </SelectedSummitButton>
        )}
        {elevations.map((elevation) => {
          const strikethrough = disabledElevations.includes(elevation)
          return (
            <TextButton
              key={elevation}
              elevation={elevation}
              disabled={disabled || isLocked || strikethrough}
              strikethrough={strikethrough}
              vertical={vertical}
              desktopOnlyVertical={desktopOnlyVertical}
              onClick={() => handleSelectElevation(elevation)}
            >
              {elevation}
            </TextButton>
          )
        })}
        {isLocked && <StyledLock width="28px" />}
      </SelectorWrapper>
    </SelectorFlex>
  )
}

export default React.memo(FarmTypeSelector)
