import React, { useEffect, useState } from 'react'
import { Flex, Text } from 'uikit'
import { Elevation } from 'config/constants/types'
import styled from 'styled-components'
import { darken } from 'polished'
import SummitButton from 'uikit/components/Button/SummitButton'
import { getSummitLpSymbol } from 'config/constants'
import { pressableMixin } from 'uikit/util/styledMixins'

const summitButtonWidth = 140
const summitLpButtonWidth = 180

const OuterWrapperFlex = styled(Flex)`
  display: flex;
  margin: 0px auto 24px auto;
  flex-direction: column;
  align-items: center;
  width: ${summitButtonWidth + summitLpButtonWidth}px;
  justify-content: center;
`

const SelectorWrapper = styled(Flex)`
  justify-content: center;
  margin: 4px 0px;
  border-radius: 22px;
  background-color: ${({ theme }) => darken(0.1, theme.colors.background)};
  box-shadow: ${({ theme }) => `inset 2px 2px 4px ${theme.colors.textShadow}`};
  position: relative;
`

const SelectedSummitButton = styled(SummitButton)<{ selectedIndex: number }>`
  pointer-events: none;
  position: absolute;
  top: 2px;
  height: 28px;
  padding: 0px;
  width: ${({ selectedIndex }) => (selectedIndex === 0 ? summitButtonWidth : summitLpButtonWidth) - 4}px;
  left: ${({ selectedIndex }) => (selectedIndex === 1 ? summitButtonWidth : 0) + 2}px;
  z-index: 3;
`

const TextButton = styled.div<{ width: number }>`
  width: ${({ width }) => width}px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  text-shadow: ${({ theme }) => `1px 1px 2px ${theme.colors.textShadow}`};
  font-family: Courier Prime, monospace;
  font-size: 16px;
  height: 32px;
  line-height: 32px;
  text-align: center;

  transition: transform 0.2s;

  ${pressableMixin}
`

interface Props {
  deity: number
  setSelectedToken: (number) => void
  expired?: boolean
}

const ExpeditionTokenSelector: React.FC<Props> = ({ deity, setSelectedToken, expired }) => {
  const [selected, setSelected] = useState(0)
  const summitLpSymbol = getSummitLpSymbol()
  useEffect(() => {
    setSelectedToken(0)
  }, [setSelectedToken])

  const handleSelect = (newSelected) => {
    if (newSelected === selected) return
    setSelected(newSelected)
    setSelectedToken(newSelected)
  }

  const summitButtonText = () => {
    switch (selected) {
      case 1:
        return summitLpSymbol
      default:
      case 0:
        return 'SUMMIT'
    }
  }

  return (
    <OuterWrapperFlex>
      <Text bold monospace fontSize="14px" mt={expired ? '24px' : ''}>
        { expired ?
          <>
            Withdraw from the Expedition
            <br/>
            <Text italic monospace bold>(Your first exit transaction will harvest any winnings)</Text>
          </> :
          `Deposit to the Cosmic ${deity === 0 ? 'Bull' : 'Bear'}:`
        }
      </Text>
      <SelectorWrapper>
        <SelectedSummitButton elevation={Elevation.EXPEDITION} selectedIndex={selected}>
          {summitButtonText()}
        </SelectedSummitButton>
        <TextButton width={summitButtonWidth} onClick={() => handleSelect(0)}>
          SUMMIT
        </TextButton>
        <TextButton width={summitLpButtonWidth} onClick={() => handleSelect(1)}>
          {summitLpSymbol}
        </TextButton>
      </SelectorWrapper>
    </OuterWrapperFlex>
  )
}

export default ExpeditionTokenSelector
