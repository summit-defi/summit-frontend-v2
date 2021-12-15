import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Spinner, Text } from 'uikit'

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  margin-bottom: 12px;
  width: 100%;
`

const Spin = keyframes`
    0%: {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`
const SpinnerWrapper = styled.div`
  svg {
    fill: ${({ theme }) => theme.colors.text};
    animation: ${Spin} 1.4s infinite linear;
  }
`

export const CardLoadingSpinner: React.FC = () => {
  return (
    <>
      <SpinnerWrapper>
        <Spinner width="32px" mt="16px" mb="12px" />
      </SpinnerWrapper>
      <Text mb="16px" bold monospace>
        LOADING...
      </Text>
      <Divider />
    </>
  )
}
