import React from 'react'
import { elevationUtils } from 'config/constants/types'
import { getBalanceNumber } from 'utils'
import { Text, Flex } from 'uikit'
import { useClaimElevation } from 'hooks/useClaim'
import { useSelectedElevation, useIsElevationLockedUntilRollover } from 'state/hooks'
import CardValue from 'views/Home/components/CardValue'
import ContributionBreakdown from './ContributionBreakdown'
import SummitButton from 'uikit/components/Button/SummitButton'
import { useElevationWinningsContributions, useUserElevationClaimable } from 'state/hooksNew'

const ElevationWinnings: React.FC = () => {
  const elevation = useSelectedElevation()
  const elevationLocked = useIsElevationLockedUntilRollover(elevation)
  const winningsContributions = useElevationWinningsContributions(elevation)
  const claimable = useUserElevationClaimable(elevation)
  const rawClaimable = getBalanceNumber(claimable)
  const earningsOrWinnings = elevationUtils.winningsOrEarnings(elevation).toUpperCase()

  // CLAIMING ELEVATION
  const { onClaimElevation, claimPending } = useClaimElevation(elevation)
  const nothingToClaim = !claimable || claimable.isEqualTo(0)

  const handleClaimElevation = () => {
    if (nothingToClaim || elevationLocked || claimPending) return
    onClaimElevation()
  }


  return (
    <Flex width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
      <Flex alignItems='center' mb='12px' justifyContent='space-around' width='100%' maxWidth='400px'>
        <Flex flexDirection='column' justifyContent='center' alignItems='center'>
          <Text bold monospace>{elevation} {earningsOrWinnings}:</Text>
          <CardValue
            value={rawClaimable}
            decimals={3}
            summitPalette={elevation}
            fontSize="18"
            postfix='SUMMIT'
            postfixFontSize='14'
          />
        </Flex>
        <SummitButton
          summitPalette={elevation}
          isLocked={elevationLocked}
          isLoading={claimPending}
          disabled={nothingToClaim}
          width='200px'
          onClick={handleClaimElevation}
        >
          CLAIM {elevation}
          <br />
          {earningsOrWinnings}
        </SummitButton>
      </Flex>

      <ContributionBreakdown
        title={`${earningsOrWinnings} BY FARM:`}
        contributions={winningsContributions}
      />
      
      

    </Flex>
  )
}

export default React.memo(ElevationWinnings)
