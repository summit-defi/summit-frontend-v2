import { ElevOrPalette } from 'config/constants/types'
import { darken } from 'polished'
import styled from 'styled-components'
import { Text } from './Text'

export const HighlightedText = styled(Text)<{
  summitPalette?: ElevOrPalette
  header?: boolean
  fontSize?: string
  gold?: boolean
  vertical?: boolean
}>`
  display: flex;
  flex-direction: ${({ vertical }) => vertical ? 'column' : 'row'};
  gap: 6px;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-style: italic;
  text-align: center;
  font-size: ${({ header, fontSize }) => fontSize || (header ? '22' : '16')}px !important;
  color: ${({ theme, gold }) => (gold ? theme.colors.textGold : theme.colors.text)};
  text-shadow: 1px 1px 2px
    ${({ theme, summitPalette: elevation, header, gold }) => {
      // eslint-disable-next-line no-nested-ternary
      if (gold) return darken(0.4, theme.colors.textGold)
      return theme.isDark
        ? 'BLACK'
        : elevation
        ? theme.colors[elevation]
        : theme.colors.text
    }};
`

HighlightedText.defaultProps = {
  header: false,
}
