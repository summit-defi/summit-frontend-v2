import React, { useCallback, useState } from 'react'
import { getBalanceNumber } from 'utils'
import { Text, Flex, Skeleton, HighlightedText, useModal, MobileColumnFlex } from 'uikit'
import styled from 'styled-components'
import { useAllElevationsClaimable } from 'state/hooks'
import CardValue from 'views/Home/components/CardValue'
import ContributionBreakdown from './ContributionBreakdown'
import BigNumber from 'bignumber.js'
import { Elevation, elevationUtils, SummitPalette } from 'config/constants'
import { useClaimElevation } from 'hooks/useClaim'
import SummitButton from 'uikit/components/Button/SummitButton'
import { useAnyElevationInteractionsLocked, useElevationInteractionsLocked, useFarmsUserDataLoaded } from 'state/hooksNew'
import { FreezeWithBonusesModal } from './FreezeWithBonusesModal'
import ElevationWinnings from './ElevationWinnings'

const ButtonsRow = styled(Flex)`
  gap: 32px;
  margin-top: 18px;
  justify-content: space-around;
  flex-wrap: wrap;
`


const NoTextShadowFlex = styled(Flex)`
  gap: 4px;
  > * {
    text-shadow: none !important;
  }
`

interface TheBigFreezeProps {
  claimables: {
    elevation: Elevation,
    claimable: BigNumber,
    claimableBonus: BigNumber
  }[]
}

const TheBigFreezeButton: React.FC<TheBigFreezeProps> = React.memo(({claimables}) => {
  const elevations = claimables.map((claimable) => claimable.elevation)
  const anyElevationLocked = useAnyElevationInteractionsLocked(elevations)

  const { onClaimElevation, claimPending } = useClaimElevation()

  const [onPresentFreezeElev] = useModal(
    <FreezeWithBonusesModal
      elevations={elevations}
      onFreezeWinnings={onClaimElevation}
    />
  )
  const handlePresentFreezeElev = useCallback(() => {
    if (claimPending || anyElevationLocked) return
    onPresentFreezeElev()
  }, [claimPending, anyElevationLocked, onPresentFreezeElev])

  return (
    <SummitButton
      isLocked={anyElevationLocked}
      isLoading={claimPending}
      width='200px'
      style={{padding: '0px'}}
      freezeSummitButton
      onClick={handlePresentFreezeElev}
    >
      <Text bold monospace fontSize='12px' color='white' textAlign='center' lineHeight='12px'>
        THE BIG FREEZE
        <br />
        (FREEZE ALL ELEVATIONS)
      </Text>
    </SummitButton>
  )
})

interface ElevProps {
  elevation: Elevation
  claimable: BigNumber
}

const ElevClaim: React.FC<ElevProps> = React.memo(({ elevation, claimable }) => {
  const elevationLocked = useElevationInteractionsLocked(elevation)
  const earningsOrWinnings = elevationUtils.winningsOrEarnings(elevation).toUpperCase()

  const { onClaimElevation, claimPending } = useClaimElevation()
  const nothingToClaim = !claimable || claimable.isEqualTo(0)

  const [onPresentFreezeElev] = useModal(
    <FreezeWithBonusesModal
      elevations={[elevation]}
      onFreezeWinnings={onClaimElevation}
    />
  )
  const handlePresentFreezeElev = useCallback(() => {
    if (claimPending || elevationLocked || nothingToClaim) return
    onPresentFreezeElev()
  }, [claimPending, elevationLocked, nothingToClaim, onPresentFreezeElev])

  return (
    <SummitButton
      summitPalette={elevation}
      isLocked={elevationLocked}
      isLoading={claimPending}
      disabled={nothingToClaim}
      width='200px'
      style={{padding: '0px'}}
      freezeSummitButton
      onClick={handlePresentFreezeElev}
    >
      FREEZE {elevation}
      <br />
      {earningsOrWinnings}
    </SummitButton>
  )
})

const MultiElevWinningsAndClaim: React.FC = () => {
  const { totalClaimable, totalClaimableBonus, elevationsClaimable, claimableBreakdown } = useAllElevationsClaimable()
  const rawTotalClaimable = getBalanceNumber(totalClaimable)
  const rawTotalClaimableBonus = getBalanceNumber(totalClaimableBonus)
  const userDataLoaded = useFarmsUserDataLoaded()
  const nothingToClaim = totalClaimable.isEqualTo(0)
  const [elevToBreakdown, setElevToBreakdown] = useState<string | undefined>(undefined)

  return (
    <Flex width='100%' alignItems='center' justifyContent='center' flexDirection='column' mb='18px'>
      <MobileColumnFlex alignItems='flex-start' mb='18px' justifyContent='flex-start' width='100%' gap='6px'>

        <Flex flexDirection='column' alignItems='flex-start' justifyContent='flex-start'>
          <Flex justifyContent='center' alignItems='center' height='20px' gap='4px'>
            <Text bold monospace>WINNINGS:</Text>
            { userDataLoaded ?
              <CardValue
                value={rawTotalClaimable}
                decimals={3}
                fontSize="18"
                postfix='SUMMIT'
                postfixFontSize='14'
              /> :
              <Skeleton height={24} width={180}/>
            }
          </Flex>
          <Flex justifyContent='center' alignItems='center' height='20px' gap='4px'>
            <Text bold monospace gold small>BONUSES:</Text>
            { userDataLoaded ?
              <NoTextShadowFlex>
                <HighlightedText bold monospace gold fontSize='14px'>+</HighlightedText>
                <CardValue
                  value={rawTotalClaimableBonus}
                  decimals={3}
                  fontSize="14"
                  gold
                />
                <HighlightedText bold monospace gold fontSize='14px' ml='8px'>BONUS</HighlightedText>
              </NoTextShadowFlex> :
              <Skeleton height={24} width={180}/>
            }
          </Flex>
        </Flex>
        <SummitButton
          summitPalette={SummitPalette.BASE}
          disabled={nothingToClaim}
          width='200px'
          onClick={() => null}
        >
          MANAGE WINNINGS
        </SummitButton>
      </MobileColumnFlex>

      <ContributionBreakdown
        loaded={userDataLoaded}
        contributions={claimableBreakdown}
        selectable
        selectedIndex={elevToBreakdown}
        onSelect={setElevToBreakdown}
      />

      {elevToBreakdown != null &&
        <ElevationWinnings elevation={elevToBreakdown}/>
      }
    </Flex>
  )
}

export default React.memo(MultiElevWinningsAndClaim)
