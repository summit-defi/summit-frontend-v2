import React from 'react'
import { linearGradient, transparentize } from 'polished'
import styled, { css, DefaultTheme } from 'styled-components'
import { MENU_ENTRY_HEIGHT, MENU_ENTRY_TEXT_ITEM, MENU_GAP_HEIGHT } from '../config'
import { pressableMixin } from 'uikit/util/styledMixins'

export interface Props {
  isActive?: boolean
  theme: DefaultTheme
  textItem: boolean
  isPushed: boolean
  elevation?: string
  disabled?: boolean
}

const LinkLabel = styled.div<{ isPushed: boolean; isActive: boolean; elevation?: string }>`
  transition: color 0.2s;
  flex-grow: 1;
  padding-left: 8px;
  font-weight: ${({ isActive }) => (isActive ? 'bold' : '400')};
  color: ${({ isActive, elevation, theme }) => (isActive && elevation ? theme.colors[elevation] : theme.colors.text)};
  text-shadow: 1px 1px 2px
    ${({ theme, isActive, elevation }) => (isActive && elevation ? theme.colors[elevation] : theme.colors.textShadow)};
`

const MenuEntry = styled.div<Props>`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')} !important;
  opacity: ${({ disabled }) => (disabled ? '0.6' : '1')};
  display: flex;
  align-items: center;
  height: ${({ textItem }) => (textItem ? MENU_ENTRY_TEXT_ITEM : MENU_ENTRY_HEIGHT)}px;
  padding: 0;
  font-size: 12px;
  letter-spacing: 1px;
  border-left: 3px solid transparent;
  color: ${({ isActive, theme }) => (isActive ? theme.colors.text : theme.colors.textSubtle)};
  transition: all 0.2s;

  a {
    display: flex;
    align-items: center;
    min-width: 250px;
    height: 100%;
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')} !important;
    pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')} !important;
  }

  svg {
    fill: ${({ isActive, theme }) => (isActive ? theme.colors.primary : theme.colors.textSubtle)};
  }

  .selectableIcon {
    transition: transform 0.2s;
  }

  ${({ theme, disabled, elevation }) =>
    pressableMixin({
      theme,
      disabled,
      hoverStyles: css`
        border-left-color: ${theme.colors[elevation] || theme.colors.text};
        background-color: ${linearGradient({
          colorStops: [
            transparentize(0.8, theme.colors[elevation] || theme.colors.text),
            transparentize(1, theme.colors[elevation] || theme.colors.text),
          ],
          toDirection: 'to right',
          fallback: transparentize(0.8, theme.colors[elevation] || theme.colors.text),
        })};
        color: ${theme.colors.text};
        .selectableIcon {
          transform: scale(1.1);
        }
        transform: none;
      `,
    })}

  // Safari fix
  flex-shrink: 0;
`
MenuEntry.defaultProps = {
  isActive: false,
  role: 'button',
}

const LinkLabelMemo = React.memo(LinkLabel, (prev, next) => prev.isActive === next.isActive)

const MenuGap = styled.div`
  height: ${MENU_GAP_HEIGHT}px;
  padding: 0 16px;
`

export { MenuEntry, MenuGap, LinkLabelMemo as LinkLabel }
