import styled, { DefaultTheme } from 'styled-components'
import getColor from '../../util/getColor'
import { TagProps } from './types'

interface ThemedProps extends TagProps {
  theme: DefaultTheme
}

const getThemeTextColor = ({ outline, variant = 'primary', theme }: ThemedProps) =>
  outline ? getColor(variant, theme) : '#ffffff'

export const StyledTag = styled.div<ThemedProps>`
  align-items: center;
  background-color: ${({ outline, theme, elevation, variant = 'primary' }) =>
    // eslint-disable-next-line no-nested-ternary
    outline ? 'transparent' : elevation ? theme.colors[elevation] : getColor(variant, theme)};
  border: 2px solid
    ${({ variant = 'primary', elevation, theme }) => (elevation ? theme.colors[elevation] : getColor(variant, theme))};
  border-radius: 16px;
  color: ${({ elevation, theme, outline, variant }) =>
    elevation && outline ? theme.colors[elevation] : getThemeTextColor({ outline, variant, theme })};
  display: inline-flex;
  font-size: 14px;
  font-weight: 400;
  height: 28px;
  line-height: 1.5;
  padding: 0 8px;
  white-space: nowrap;
  box-shadow: 1px 1px 3px ${({ theme }) => theme.colors.textShadow};

  svg {
    fill: ${({ elevation, theme, outline, variant }) =>
      elevation && outline ? theme.colors[elevation] : getThemeTextColor({ outline, variant, theme })};
  }
`

export default null
