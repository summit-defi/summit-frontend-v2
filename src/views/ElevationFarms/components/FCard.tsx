import styled from 'styled-components'

export const FCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 16px;
  padding-top: 122px;
  position: relative;
  top: -34px;
  text-align: center;
  transition: all 0.2s;
  width: 100%;

  box-shadow: 2px 2px 12px -4px rgba(25, 19, 38, 0.4), 2px 2px 8px rgba(25, 19, 38, 0.2);
  .styledAccent {
    filter: blur(12px);
  }

  ${({ theme }) => theme.mediaQueries.nav} {
    max-width: 62%;
    margin: 0 8px;
  }
`
