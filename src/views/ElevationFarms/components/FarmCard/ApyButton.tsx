import React from 'react'
import BigNumber from 'bignumber.js'
import { CalculateIcon, IconButton, useModal } from 'uikit'
import { Address } from 'config/constants/types'
import ApyCalculatorModal from './ApyCalculatorModal'

export interface ApyButtonProps {
  symbol?: string
  summitPrice?: BigNumber
  apy?: BigNumber
  getUrl?: string
}

const ApyButton: React.FC<ApyButtonProps> = ({ symbol, summitPrice, apy, getUrl }) => {
  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal symbol={symbol} summitPrice={summitPrice} apy={apy} getUrl={getUrl} />,
  )

  const handlePress = (event) => {
    event.stopPropagation()
    event.preventDefault()
    onPresentApyModal()
  }

  return (
    <IconButton
      onClick={handlePress}
      variant="text"
      size="sm"
      padding="0px"
      style={{ width: '20px', height: '20px' }}
      margin="0px"
    >
      <CalculateIcon />
    </IconButton>
  )
}

export default ApyButton
