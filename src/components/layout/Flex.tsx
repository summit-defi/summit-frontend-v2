import styled from 'styled-components'

const FlexLayout = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
  margin-left: 0px;
  border-radius: 4px;
  margin-right: 0px;

  & > * {
    max-width: 950px;
  }
`

export default FlexLayout
