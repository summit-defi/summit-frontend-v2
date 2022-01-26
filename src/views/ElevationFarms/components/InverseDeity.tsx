import styled from 'styled-components'
import { BaseDeity } from '../../../uikit/components/Totem/BaseDeity'

export const InverseDeity = styled(BaseDeity)`
  height: calc(250px / 1.358);
  width: 250px;
  margin-bottom: 64px;
  transition: none;
  transform: ${({ deity: totem }) => (totem === 0 ? 'scaleX(-1)' : 'none')};
  filter: none;

  ${({ theme }) => theme.mediaQueries.invNav} {
    height: calc(200px / 1.358);
    width: 200px;
  }
`
