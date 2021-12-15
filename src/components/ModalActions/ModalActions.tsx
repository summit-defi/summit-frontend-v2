import React from 'react'
import styled from 'styled-components'

const ModalActions: React.FC = ({ children }) => {
  return (
    <StyledModalActions>
      {React.Children.map(children, (child) => (
        <>
          <StyledModalAction>{child}</StyledModalAction>
        </>
      ))}
    </StyledModalActions>
  )
}

const StyledModalActions = styled.div`
  align-items: center;
  background-color: ${(props) => props.theme.colors.primaryDark}00;
  display: flex;
  margin: 0;
  padding-top: ${(props) => props.theme.spacing[4]}px;
  padding-bottom: 0px;
`

const StyledModalAction = styled.div`
  flex: 1;
  text-align: center;
`

export default ModalActions
