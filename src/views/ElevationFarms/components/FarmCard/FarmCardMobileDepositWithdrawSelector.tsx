import React, { useEffect, useState } from 'react'
import { Flex } from 'uikit'
import { Elevation } from 'config/constants/types'
import styled, { css } from 'styled-components'
import SummitButton from 'uikit/components/Button/SummitButton'
import { pressableMixin } from 'uikit/util/styledMixins'
import { SelectorWrapperBase } from 'uikit/widgets/Selector/styles'

const buttonWidth = 117

const MobileOnlyFlex = styled(Flex)`
  display: flex;
  margin: 24px auto 12px auto;
  flex-direction: row;
  align-items: center;
  height: 32px;
  width: ${buttonWidth * 3}px;
  justify-content: center;
  ${({ theme }) => theme.mediaQueries.nav} {
    display: none;
  }
`

const SelectorWrapper = styled(SelectorWrapperBase)`
  display: flex;
  justify-content: center;
  margin: 4px 0px;
  border-radius: 22px;
  position: relative;
`

const SelectedSummitButton = styled(SummitButton)<{ selectedIndex: number }>`
  pointer-events: none;
  position: absolute;
  top: 2px;
  height: 28px;
  width: ${buttonWidth - 4}px;
  left: ${({ selectedIndex }) => selectedIndex * buttonWidth + 2}px;
  z-index: 3;
`

const TextButton = styled.div<{ disabled: boolean }>`
  width: ${buttonWidth}px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  text-shadow: ${({ theme }) => `1px 1px 2px ${theme.colors.textShadow}`};
  font-family: Courier Prime, monospace;
  font-size: 16px;
  height: 32px;
  line-height: 32px;
  text-align: center;

  ${({ theme, disabled }) =>
    pressableMixin({
      theme,
      disabled,
      disabledStyles: css`
        text-decoration: line-through;
      `,
    })}
`

interface Props {
  isApproved: boolean
  elevation: Elevation
  setMobileDepositWithdraw: (number) => void
}

const FarmCardMobileDepositWithdrawSelector: React.FC<Props> = ({
  isApproved,
  elevation,
  setMobileDepositWithdraw,
}) => {
  const [selected, setSelected] = useState(0)
  useEffect(() => {
    setMobileDepositWithdraw(0)
  }, [setMobileDepositWithdraw])

  const approveOrDeposit = isApproved ? 'DEPOSIT' : 'APPROVE'

  const handleSelect = (newSelected) => {
    if (newSelected === selected || (newSelected !== 0 && !isApproved)) return
    setSelected(newSelected)
    setMobileDepositWithdraw(newSelected)
  }

  const summitButtonText = () => {
    switch (selected) {
      case 1:
        return 'WITHDRAW'
      case 2:
        return 'ELEVATE'
      default:
      case 0:
        return approveOrDeposit
    }
  }

  return (
    <MobileOnlyFlex>
      <SelectorWrapper>
        <SelectedSummitButton elevation={elevation} selectedIndex={selected}>
          {summitButtonText()}
        </SelectedSummitButton>
        <TextButton onClick={() => handleSelect(0)} disabled={false}>
          {approveOrDeposit}
        </TextButton>
        <TextButton onClick={() => handleSelect(1)} disabled={!isApproved}>
          WITHDRAW
        </TextButton>
        <TextButton onClick={() => handleSelect(2)} disabled={!isApproved}>
          ELEVATE
        </TextButton>
      </SelectorWrapper>
    </MobileOnlyFlex>
  )
}

export default FarmCardMobileDepositWithdrawSelector
