import styled, { css } from 'styled-components'
import { flexbox } from 'styled-system'
import Box from './Box'
import { FlexProps } from './types'

const Flex = styled(Box)<FlexProps>`
  display: flex;
  ${flexbox}
  ${({ gap }) => gap != null && css`
    gap: ${gap};
  `}
`

export const MobileColumnFlex = styled(Flex)`
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.nav} {
    flex-direction: row;
  }
`

export const MobileRowFlex = styled(Flex)`
  flex-direction: row;

  ${({ theme }) => theme.mediaQueries.nav} {
    flex-direction: column;
  }
`

export default Flex
