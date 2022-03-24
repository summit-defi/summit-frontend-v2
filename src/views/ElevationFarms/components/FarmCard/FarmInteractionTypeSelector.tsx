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



export enum FarmInteractionType {
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
  Elevate = 'Elevate',
}

interface Props {
  isApproved: boolean
  elevation: Elevation
  farmInteractionType: FarmInteractionType
  setFarmInteractionType: (FarmInteractionType) => void
}

const FarmInteractionTypeSelector: React.FC<Props> = ({
  isApproved,
  elevation,
  farmInteractionType,
  setFarmInteractionType,
}) => {
  const approveOrDeposit = isApproved ? 'DEPOSIT' : 'APPROVE'
  const selectedIndex = farmInteractionType === FarmInteractionType.Deposit ? 0 :
    farmInteractionType === FarmInteractionType.Withdraw ? 1 : 2

  const summitButtonText = () => {
    switch (farmInteractionType) {
      case FarmInteractionType.Withdraw:
        return 'WITHDRAW'
      case FarmInteractionType.Elevate:
        return 'ELEVATE'
      default:
      case FarmInteractionType.Deposit:
        return approveOrDeposit
    }
  }

  return (
    <MobileOnlyFlex>
      <SelectorWrapper>
        <SelectedSummitButton elevation={elevation} selectedIndex={selectedIndex}>
          {summitButtonText()}
        </SelectedSummitButton>
        <TextButton onClick={() => setFarmInteractionType(FarmInteractionType.Deposit)} disabled={false}>
          {approveOrDeposit}
        </TextButton>
        <TextButton onClick={() => setFarmInteractionType(FarmInteractionType.Withdraw)} disabled={!isApproved}>
          WITHDRAW
        </TextButton>
        <TextButton onClick={() => setFarmInteractionType(FarmInteractionType.Elevate)} disabled={!isApproved}>
          ELEVATE
        </TextButton>
      </SelectorWrapper>
    </MobileOnlyFlex>
  )
}

export default FarmInteractionTypeSelector
