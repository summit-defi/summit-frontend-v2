import { Elevation, elevationUtils } from 'config/constants/types'
import { darken } from 'polished'
import styled from 'styled-components'
import { Text } from './Text'

export const HighlightedText = styled(Text)<{
  elevation?: Elevation
  header?: boolean
  fontSize?: string
  gold?: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-style: italic;
  text-align: center;
  font-size: ${({ header, fontSize }) => fontSize || (header ? '22' : '16')}px !important;
  color: ${({ theme, gold }) => (gold ? theme.colors.textGold : theme.colors.text)};
  text-shadow: 1px 1px 2px
    ${({ theme, elevation, header, gold }) => {
      // eslint-disable-next-line no-nested-ternary
      if (gold) return darken(0.4, theme.colors.textGold)
      const color = theme.isDark
        ? 'BLACK'
        : elevation
        ? elevationUtils.backgroundColor(elevation, theme)
        : theme.colors.text
      const darkenAmt = header && !theme.isDark ? 0.2 : 0
      return darken(darkenAmt, color)
    }};
`

HighlightedText.defaultProps = {
  header: false,
}
