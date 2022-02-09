import React from 'react'
import { getBalanceNumber } from 'utils'
import { Text, Flex, Skeleton, HighlightedText } from 'uikit'
import styled from 'styled-components'
import { useAllElevationsClaimable } from 'state/hooks'
import CardValue from 'views/Home/components/CardValue'
import ContributionBreakdown from './ContributionBreakdown'
import BigNumber from 'bignumber.js'
import { Elevation, elevationUtils } from 'config/constants'
import { useClaimElevation } from 'hooks/useClaim'
import SummitButton from 'uikit/components/Button/SummitButton'
import { useElevationInteractionsLocked, useFarmsUserDataLoaded } from 'state/hooksNew'

const ButtonsRow = styled(Flex)`
  gap: 12px;
  margin-top: 18px;
  justify-content: space-around;
  flex-wrap: wrap;
`


const NoTextShadowFlex = styled(Flex)`
  gap: 4px;
  margin-top: -4px;
  > * {
    text-shadow: none !important;
  }
`

interface ElevProps {
  elevation: Elevation
  claimable: BigNumber
}

const ElevClaim: React.FC<ElevProps> = ({ elevation, claimable }) => {
  const elevationLocked = useElevationInteractionsLocked(elevation)
  const earningsOrWinnings = elevationUtils.winningsOrEarnings(elevation).toUpperCase()

  const { onClaimElevation, claimPending } = useClaimElevation(elevation)
  const nothingToClaim = !claimable || claimable.isEqualTo(0)

  const handleClaimElevation = () => {
    if (nothingToClaim || elevationLocked || claimPending) return
    onClaimElevation()
  }

  return (
    <SummitButton
      summitPalette={elevation}
      isLocked={elevationLocked}
      isLoading={claimPending}
      disabled={nothingToClaim}
      width='170px'
      style={{padding: '0px'}}
      onClick={handleClaimElevation}
    >
      FREEZE {elevation}
      <br />
      {earningsOrWinnings}
    </SummitButton>
  )
}

const MultiElevWinningsAndClaim: React.FC = () => {
  const { totalClaimable, totalClaimableBonus, elevationsClaimable, claimableBreakdown } = useAllElevationsClaimable()
  const rawTotalClaimable = getBalanceNumber(totalClaimable)
  const rawTotalClaimableBonus = getBalanceNumber(totalClaimableBonus)
  const userDataLoaded = useFarmsUserDataLoaded()

  return (
    <Flex width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
      
      <Flex alignItems='center' mb='12px' justifyContent='space-around' width='100%' maxWidth='400px'>
        <Flex flexDirection='column' justifyContent='center' alignItems='center'>
          <Text bold monospace>WINNINGS:</Text>
          { userDataLoaded ?
            <>
              <CardValue
                value={rawTotalClaimable}
                decimals={3}
                fontSize="18"
                postfix='SUMMIT'
                postfixFontSize='14'
              />
              { totalClaimableBonus.isGreaterThan(0) &&
                <NoTextShadowFlex>
                  <HighlightedText bold monospace gold fontSize='14px'>+</HighlightedText>
                  <CardValue
                    value={rawTotalClaimableBonus}
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
      </Flex>

      <ContributionBreakdown
        loaded={userDataLoaded}
        breakingDownTitle='WINNINGS'
        contributions={claimableBreakdown}
      />

      <ButtonsRow>
        { elevationsClaimable.map((elevationClaimable) => (
          <ElevClaim
            key={elevationClaimable.elevation}
            {...elevationClaimable}
          />
        ))}
      </ButtonsRow>
    </Flex>
  )
}

export default React.memo(MultiElevWinningsAndClaim)
