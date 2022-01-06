import { Elevation } from 'config/constants/types'
import { darken } from 'polished'
import React from 'react'
import styled from 'styled-components'
import SummitButton from 'uikit/components/Button/SummitButton'
import { pressableMixin } from 'uikit/util/styledMixins'
import { SunIcon, MoonIcon } from '../icons'

interface Props {
  elevation: Elevation
  isDark: boolean
  toggleTheme: () => void
}

const ToggleWrapper = styled.div<{ disabled: boolean }>`
  position: relative;
  background-color: ${({ theme }) => darken(0.1, theme.colors.background)};
  box-shadow: ${({ theme }) => `inset 2px 2px 4px ${theme.colors.textShadow}`};
  width: 58px;
  height: 32px;
  border-radius: 20px;
  transition: all 300ms;

  ${({ theme, disabled }) =>
    pressableMixin({
      theme,
      disabled
    })};
`

const BGSunIcon = styled(SunIcon)`
  position: absolute;
  width: 20px;
  height: 20px;
  top: 6px;
  right: 6px;
`
const BGMoonIcon = styled(MoonIcon)`
  position: absolute;
  width: 20px;
  height: 20px;
  top: 6px;
  left: 6px;
`

const StyledSummitButton = styled(SummitButton)<{ visible: boolean }>`
  position: absolute;
  width: 28px;
  height: 28px;
  top: 2px;
  left: ${({ visible }) => (visible ? 28 : 2)}px;
  padding: 0px;

  transition: all 300ms;
  pointer-events: none;
`

const StyledSunIcon = styled(SunIcon)<{ visible: boolean }>`
  position: absolute;
  width: 24px;
  height: 24px;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  margin: auto;
  transition: opacity 300ms;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
`
const StyledMoonIcon = styled(MoonIcon)<{ visible: boolean }>`
  position: absolute;
  width: 24px;
  height: 24px;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  margin: auto;
  transition: opacity 300ms;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
`

const DarkModeToggle: React.FC<Props> = ({ elevation, isDark, toggleTheme }) => {
  const handleToggleTheme = () => {
    if (elevation === Elevation.EXPEDITION) return
    toggleTheme()
  }
  return (
    <ToggleWrapper disabled={elevation === Elevation.EXPEDITION} onClick={handleToggleTheme}>
      <BGSunIcon color="white" />
      <BGMoonIcon color="#575757" />
      <StyledSummitButton elevation={elevation} visible={!isDark} onClick={() => null}>
        <StyledSunIcon color="white" visible={!isDark} />
        <StyledMoonIcon color="white" visible={isDark} />
      </StyledSummitButton>
    </ToggleWrapper>
  )
}

export default DarkModeToggle
