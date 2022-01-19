import React from 'react'
import { BN_ZERO, Elevation, elevationUtils } from 'config/constants/types'
import { getFormattedBigNumber } from 'utils'
import { Flex, HighlightedText, Text } from 'uikit'
import { useIsElevationLockedUntilRollover, useTotalValue } from 'state/hooks'
import ElevationContributionBreakdown from './ElevationContributionBreakdown'

const ElevationYieldBet: React.FC = () => {
  const elevTVL = {}
  elevTVL[Elevation.OASIS] = useTotalValue(Elevation.OASIS)
  elevTVL[Elevation.PLAINS] = useTotalValue(Elevation.PLAINS)
  elevTVL[Elevation.MESA] = useTotalValue(Elevation.MESA)
  elevTVL[Elevation.SUMMIT] = useTotalValue(Elevation.SUMMIT)

  const totalTVL = elevationUtils.all.reduce((acc, elevation) => acc.plus(elevTVL[elevation]), BN_ZERO)

  console.log({
    totalTVL: totalTVL.toString(),
    oasisTVL: elevTVL[Elevation.OASIS].toString(),
    plainsTVL: elevTVL[Elevation.PLAINS].toString(),
    mesaTVL: elevTVL[Elevation.MESA].toString(),
    summitTVL: elevTVL[Elevation.SUMMIT].toString(),
  })

  const elevationContributions = elevationUtils.all
    .map((elevation, index) => {
      const perc = elevTVL[elevation].isGreaterThan(0) ? elevTVL[elevation].times(100).dividedBy(totalTVL).toNumber() : 0
      return {
        elevation,
        key: index,
        perc,
      }
    })
    .filter((contrib) => contrib.perc > 0)

  return (
    <Flex width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
      <Flex flexDirection='column' justifyContent='center' alignItems='center'>
        <Text bold monospace>TOTAL STAKED:</Text>
        <HighlightedText bold monospace style={{ display: 'flex', alignItems: 'center', lineHeight: '28px' }}>
          {'$'}{totalTVL.toFixed(2)}
        </HighlightedText>
      </Flex>
      <ElevationContributionBreakdown
        title='ELEVATION BREAKDOWN'
        contributions={elevationContributions}
      />
    </Flex>
  )
}

export default React.memo(ElevationYieldBet)
