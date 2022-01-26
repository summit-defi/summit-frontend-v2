import React from 'react'
import styled from 'styled-components'
import { Elevation, ElevationPromoBanner } from 'config/constants/types'
import { Flex, HighlightedText, Text } from 'uikit'
import {
  useSelectedElevation,
  useElevationUserRoundInfo,
  useElevationTotem,
  useIsElevationLockedUntilRollover,
} from 'state/hooks'
import { getBalanceNumber } from 'utils'
import SummitButton from 'uikit/components/Button/SummitButton'
import CardValue from 'views/Home/components/CardValue'
import { useClaimElevation } from 'hooks/useClaim'
import TotemRoundRewardsBreakdown from './FarmCard/TotemRoundRewardsBreakdown'
import PageLoader from 'components/PageLoader'

const FlexInfoItem = styled(Flex)`
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`

const InfoItemValue = styled(Flex)`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50px;
`

const PromoBanner = styled(Flex)<{ banner: string }>`
  background-image: ${({ banner }) => `url("/images/promo/${banner}.png")`};
  width: calc(100% + 32px);
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  height: 230px;
  margin-top: 70px;
  margin-bottom: -30px;

  ${({ theme }) => theme.mediaQueries.nav} {
    height: 257px;
    margin-top: -30px;
  }
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  margin-bottom: 12px;
  width: 100%;
`

const ElevationUserRoundInfo: React.FC = () => {
  const elevation = useSelectedElevation()
  const userTotem = useElevationTotem(elevation)
  const elevationLocked = useIsElevationLockedUntilRollover(elevation)
  const { claimable, yieldContributed, potentialWinnings, roundRewards, totemRoundRewards } = useElevationUserRoundInfo(elevation)
  
  const rawClaimable = getBalanceNumber(claimable)

  // CLAIMING ELEVATION
  const { onClaimElevation, claimPending } = useClaimElevation(elevation)
  const nothingToClaim = !claimable || claimable.isEqualTo(0)

  if (!elevation) {
    return <PageLoader fill={false} />
  }

  const earnLabel = 'SUMMIT'

  const rawYieldContributed = getBalanceNumber(yieldContributed)
  const rawPotentialWinnings = getBalanceNumber(potentialWinnings)

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center" flex={1} width="100%">

      { ElevationPromoBanner[elevation] != null &&
        <PromoBanner banner={ElevationPromoBanner[elevation]}/>
      }
      <TotemRoundRewardsBreakdown
        elevation={elevation}
        userTotem={userTotem}
        roundRewards={roundRewards}
        totemRoundRewards={totemRoundRewards}
      />

      <Flex alignItems="center" justifyContent="space-around" width="100%" mb="24px">
        <FlexInfoItem width='200px'>
          <Text bold fontSize="12px" textAlign="center">
            Yield
            <br />
            Contributed
          </Text>
          <InfoItemValue>
            <CardValue value={rawYieldContributed} decimals={3} elevation={elevation} fontSize="22" />
            <HighlightedText bold monospace mt="-8px" summitPalette={elevation}>
              {earnLabel}
            </HighlightedText>
          </InfoItemValue>
        </FlexInfoItem>
        <FlexInfoItem width='200px'>
          <Text bold fontSize="12px" textAlign="center">
            Potential Winnings
            <br />
            (If Win)
          </Text>
          <InfoItemValue>
            <CardValue value={rawPotentialWinnings} decimals={3} elevation={elevation} fontSize="22" />
            <HighlightedText bold monospace mt="-8px" summitPalette={elevation}>
              {earnLabel}
            </HighlightedText>
          </InfoItemValue>
        </FlexInfoItem>
      </Flex>

      <Divider />

      <HighlightedText mb="8px" summitPalette={elevation}>
        Finished Rounds:
      </HighlightedText>


      <Flex alignItems='center' justifyContent='space-around' width="100%">
        <FlexInfoItem width='200px'>
          <Text bold fontSize="12px">
            Winnings
          </Text>
          <InfoItemValue>
            <CardValue value={rawClaimable} decimals={3} elevation={elevation} fontSize="22" />
            <HighlightedText bold monospace mt="-8px" summitPalette={elevation}>
              {earnLabel}
            </HighlightedText>
          </InfoItemValue>
        </FlexInfoItem>

        <Flex flexDirection="column" width='200px'>
          <SummitButton
            elevation={elevation}
            isLocked={elevationLocked}
            isLoading={claimPending}
            disabled={nothingToClaim}
            mr="8px"
            onClick={() => onClaimElevation()}
          >
            CLAIM
            <br />
            WINNINGS
          </SummitButton>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default React.memo(ElevationUserRoundInfo)
