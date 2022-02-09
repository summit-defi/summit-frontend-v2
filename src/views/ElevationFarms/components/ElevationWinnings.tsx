import React from 'react'
import { elevationUtils } from 'config/constants/types'
import { getBalanceNumber } from 'utils'
import { Text, Flex, HighlightedText, Skeleton, useModal } from 'uikit'
import { useClaimElevation } from 'hooks/useClaim'
import { useSelectedElevation } from 'state/hooks'
import CardValue from 'views/Home/components/CardValue'
import ContributionBreakdown from './ContributionBreakdown'
import SummitButton from 'uikit/components/Button/SummitButton'
import { useElevationWinningsContributions, useUserElevationClaimable, useElevationInteractionsLocked, useFarmsUserDataLoaded } from 'state/hooksNew'
import styled from 'styled-components'
import { FreezeWithBonusesModal } from './FreezeWithBonusesModal'

const NoTextShadowFlex = styled(Flex)`
  gap: 4px;
  margin-top: -4px;
  > * {
    text-shadow: none !important;
  }
`

const ElevationWinnings: React.FC = () => {
  const elevation = useSelectedElevation()
  const elevationLocked = useElevationInteractionsLocked(elevation)
  const {
    winningsContributions,
    elevClaimable,
    elevClaimableBonus,
  } = useElevationWinningsContributions(elevation)

  const userDataLoaded = useFarmsUserDataLoaded()

  const rawElevClaimable = getBalanceNumber(elevClaimable)
  const rawElevClaimableBonus = getBalanceNumber(elevClaimableBonus)
  const earningsOrWinnings = elevationUtils.winningsOrEarnings(elevation).toUpperCase()

  // FREEZING ELEVATION
  const { onClaimElevation, claimPending } = useClaimElevation()
  const nothingToClaim = !elevClaimable || elevClaimable.isEqualTo(0)

  const [onPresentFreezeElev] = useModal(
    <FreezeWithBonusesModal
      elevation={elevation}
      onFreezeWinnings={onClaimElevation}
    />
  )
  const handlePresentFreezeElev = () => {
    if (claimPending || elevationLocked || nothingToClaim) return
    onPresentFreezeElev()
  }


  return (
    <Flex width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
      <Flex alignItems='center' mb='12px' justifyContent='space-around' width='100%' maxWidth='400px'>
        <Flex flexDirection='column' justifyContent='center' alignItems='center'>
          <Text bold monospace>{elevation} {earningsOrWinnings}:</Text>
          { userDataLoaded ?
            <>
              <CardValue
                value={rawElevClaimable}
                decimals={3}
                summitPalette={elevation}
                fontSize="18"
                postfix='SUMMIT'
                postfixFontSize='14'
              />
              { elevClaimableBonus.isGreaterThan(0) &&
                <NoTextShadowFlex>
                  <HighlightedText bold monospace gold fontSize='14px'>+</HighlightedText>
                  <CardValue
                    value={rawElevClaimableBonus}
                    decimals={3}
                    fontSize="14"
                    gold
                  />
                  <HighlightedText bold monospace gold fontSize='14px' ml='8px'>BONUS</HighlightedText>
                </NoTextShadowFlex>
              }
            </> :
            <Skeleton height={24} width={180}/>
          }
        </Flex>
        <SummitButton
          summitPalette={elevation}
          isLocked={elevationLocked}
          isLoading={claimPending}
          disabled={nothingToClaim}
          width='200px'
          onClick={handlePresentFreezeElev}
        >
          FREEZE {elevation}
          <br />
          {earningsOrWinnings}
        </SummitButton>
      </Flex>

      <ContributionBreakdown
        loaded={userDataLoaded}
        breakingDownTitle={earningsOrWinnings}
        breakdownType='FARM'
        contributions={winningsContributions}
      />
      
      

    </Flex>
  )
}

export default React.memo(ElevationWinnings)
