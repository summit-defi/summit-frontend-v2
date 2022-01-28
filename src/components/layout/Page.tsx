import styled from 'styled-components'
import Container from './Container'

const Page = styled(Container)`
  min-height: calc(100vh - 64px);
  padding-top: 24px;
  padding-bottom: 128px;
  padding-left: 8px;
  padding-right: 8px;
  align-items: center;
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 16px;
    padding-bottom: 64px;
  }
`

export default Page
