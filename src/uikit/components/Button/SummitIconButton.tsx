import { Elevation } from 'config/constants/types'
import styled, { css } from 'styled-components'
import { pressableMixin } from 'uikit/util/styledMixins'

const SummitIconButton = styled.div<{ elevation: Elevation; isLocked?: boolean }>`
  cursor: pointer;
  position: relative;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 200px;
  box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};
  width: 64px;
  height: 64px;
  margin-left: 10px;
  margin-right: 10px;
  transition: all 0.2s;

  ${({ theme, isLocked }) =>
    pressableMixin({
      theme,
      disabled: isLocked,
      disabledStyles: css`
        filter: grayscale(1) brightness(1.2);
      `,
      enabledStyles: css`
        transform: scale(1.1);
        background: ${theme.colors.cardHover};
        box-shadow: ${`2px 2px 8px ${theme.colors.textShadow}`};
      `,
    })}

  &::after {
    position: absolute;
    top: 5px;
    right: 5px;
    bottom: 5px;
    left: 5px;
    content: '';
    background-color: ${({ theme, elevation }) => theme.colors[elevation]};
    border-radius: 50px;
    box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};
  }
`

export default SummitIconButton
