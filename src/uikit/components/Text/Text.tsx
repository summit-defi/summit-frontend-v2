import React from 'react';
import styled, { DefaultTheme } from 'styled-components'
import { space, typography } from 'styled-system'
import getThemeValue from '../../util/getThemeValue'
import { TextProps } from './types'

interface ThemedProps extends TextProps {
  theme: DefaultTheme
}

const getColor = ({ color, gold, theme }: ThemedProps) => {
  if (gold) return theme.colors.textGold
  return getThemeValue(`colors.${color}`, color)(theme)
}

const getFontSize = ({ fontSize, small }: TextProps) => {
  return small ? '12px' : fontSize || '14px'
}

export const breakTextBr = (breakableText: string): Array<string | JSX.Element> => {
  return breakableText.split('|').map((text) => (text === 'br' ? <br key={text} /> : text))
}

export const Text = styled.div<TextProps>`
  color: ${getColor};
  font-size: ${getFontSize};
  font-weight: ${({ bold }) => (bold ? 600 : 400)};
  font-style: ${({ italic }) => (italic ? 'italic' : 'default')};
  text-decoration: ${({ underline }) => (underline ? 'underline' : 'default')};
  line-height: 1.5;
  font-family: ${({ monospace }) => (monospace ? 'Courier Prime, monospace' : 'inherit')};
  letter-spacing: 0.5px;
  ${({ textTransform }) => textTransform && `text-transform: ${textTransform};`}
  ${space}
  ${typography}
`

Text.defaultProps = {
  color: 'text',
  small: false,
}
