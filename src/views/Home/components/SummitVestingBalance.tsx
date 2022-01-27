import React from 'react'
import { Text } from 'uikit'
import CardValue from './CardValue'
import { Elevation } from 'config/constants/types'

interface Props {
  account: string | null
  vesting: number
}

const SummitVestingBalance: React.FC<Props> = ({ account, vesting }) => {
  if (!account) {
    return (
      <Text color="textDisabled" style={{ lineHeight: '60px' }}>
        Locked
      </Text>
    )
  }

  return <CardValue value={vesting} summitPalette={Elevation.OASIS} />
}

export default SummitVestingBalance
