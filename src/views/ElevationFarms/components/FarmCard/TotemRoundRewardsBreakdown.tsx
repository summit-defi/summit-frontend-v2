import React from 'react'
import { Elevation, elevationUtils } from 'config/constants/types'
import styled from 'styled-components'
import { elevationPalette } from 'theme/colors'
import { chunkArray } from 'utils'
import { Text } from 'uikit'
import Totem from '../Totem'
import chroma from 'chroma-js'
import BigNumber from 'bignumber.js'

const TotemBreakdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 32px;
  margin-bottom: 32px;
`

const TotemBreakdownRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const TotemWithStatsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 6px;
`

interface Props {
  elevation: Elevation
  userTotem: number
  roundRewards: BigNumber
  totemsRoundRewards: BigNumber[]
}

const TotemRoundRewardsBreakdown: React.FC<Props> = ({ elevation, userTotem, roundRewards, totemsRoundRewards }) => {
  const totemsArray = elevationUtils.totemsArray(elevation)
  const chunkedTotems = chunkArray(5, totemsArray)
  const colorGradient = chroma
    .scale([elevationPalette[elevation][2], elevationPalette[elevation][4]])
    .mode('lch')
    .colors(totemsArray.length)
  return (
    <TotemBreakdownWrapper>
      <Text>LIVE YIELD MULTIPLIERS:</Text>
      {chunkedTotems.map((rowTotems) => (
        <TotemBreakdownRow key={rowTotems[0]}>
          {rowTotems.map((totem) => {
            const totemRoundRewards = totemsRoundRewards[totem] || new BigNumber(0)
            const stakedBalance = totemRoundRewards.div(new BigNumber(10).pow(18)).toNumber()
            const perc = totemRoundRewards.isEqualTo(0) ? 0 : roundRewards.dividedBy(totemRoundRewards).toNumber()
            return (
              <TotemWithStatsWrapper key={totem}>
                <Totem
                  elevation={elevation}
                  totem={totem}
                  color={colorGradient[totem]}
                  selected={totem === userTotem}
                  pressable={false}
                />
                <Text monospace bold fontSize="12px" textAlign="center">
                  {stakedBalance.toFixed(2)}
                </Text>
                <Text monospace bold fontSize="10px" textAlign="center">
                  YIELD
                </Text>
                <Text monospace bold>
                  {perc.toFixed(1)}X
                </Text>
              </TotemWithStatsWrapper>
            )
          })}
        </TotemBreakdownRow>
      ))}
    </TotemBreakdownWrapper>
  )
}

export default TotemRoundRewardsBreakdown
