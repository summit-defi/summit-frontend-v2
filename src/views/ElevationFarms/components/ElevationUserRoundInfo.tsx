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
import { useHarvestElevation } from 'hooks/useHarvest'
import TotemRoundRewardsBreakdown from './FarmCard/TotemRoundRewardsBreakdown'
import PageLoader from 'components/PageLoader'
import BigNumber from 'bignumber.js'
// import VestingAndAvailableTimeline from './VestingAndAvailableTimeline'

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
  const elevationLocked = useIsElevationLockedUntilRollover()
  const { userEarned, userVesting, userYieldContributed, roundRewards, totemsRoundRewards } = useElevationUserRoundInfo(
    elevation,
  )
  
  const rawEarned = getBalanceNumber(userEarned)

  // HARVESTING ELEVATION
  const { onHarvestElevation, harvestPending, crossCompoundPending } = useHarvestElevation(elevation)
  const nothingToClaim = !userEarned || userEarned.isEqualTo(0)

  if (elevation === Elevation.OASIS) {
    return (
      <>
        <Text textAlign="center" bold fontSize="small">
          The Otter represents you in all farms at the OASIS
          <br />
          <br />
          There are no other totems to compete against,
          <br />
          so any yield you generate is available immediately.
        </Text>
        <br />
        <br />
        <Text bold monospace textAlign="center">
          Earnings across the OASIS:
        </Text>
        <br />
        <CardValue value={rawEarned} decimals={2} fontSize="28px" elevation={Elevation.OASIS} />
        <HighlightedText bold monospace ml="8px" elevation={elevation}>
          SUMMIT
        </HighlightedText>
        <br />
        <Text textAlign="center" bold monospace fontSize="12px">
          Harvest earnings in each farm below
        </Text>
      </>
    )
  }

  if (!elevation || totemsRoundRewards.length === 0) {
    return <PageLoader fill={false} />
  }

  const earnLabel = 'SUMMIT'

  const rawVesting = getBalanceNumber(userVesting)
  const rawYieldContribution = getBalanceNumber(userYieldContributed)

  const expectedWinnings = (totemsRoundRewards[userTotem] || new BigNumber(0)).isEqualTo(0)
    ? 0
    : userYieldContributed.times(roundRewards).dividedBy(totemsRoundRewards[userTotem])
  const rawExpectedWinnings = getBalanceNumber(expectedWinnings)

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center" flex={1} width="100%">

      { ElevationPromoBanner[elevation] != null &&
        <PromoBanner banner={ElevationPromoBanner[elevation]}/>
      }
      <TotemRoundRewardsBreakdown
        elevation={elevation}
        userTotem={userTotem}
        roundRewards={roundRewards}
        totemsRoundRewards={totemsRoundRewards}
      />

      <Flex alignItems="center" justifyContent="space-around" width="100%" mb="24px">
        <FlexInfoItem>
          <Text bold fontSize="12px" textAlign="center">
            Your Yield
            <br />
            Contributed
          </Text>
          <InfoItemValue>
            <CardValue value={rawYieldContribution} decimals={3} elevation={elevation} fontSize="22px" />
            <HighlightedText bold monospace mt="-8px" elevation={elevation}>
              {earnLabel}
            </HighlightedText>
          </InfoItemValue>
        </FlexInfoItem>
        <FlexInfoItem>
          <Text bold fontSize="12px" textAlign="center">
            Expected Rewards
            <br />
            If Round Win
          </Text>
          <InfoItemValue>
            <CardValue value={rawExpectedWinnings} decimals={3} elevation={elevation} fontSize="22px" />
            <HighlightedText bold monospace mt="-8px" elevation={elevation}>
              {earnLabel}
            </HighlightedText>
          </InfoItemValue>
        </FlexInfoItem>
      </Flex>

      <Divider />

      <HighlightedText mb="8px" elevation={elevation}>
        Previous Rounds{'\''} Rewards:
      </HighlightedText>

      {/* <VestingAndAvailableTimeline
        userEarned={userEarned}        
        userVesting={userVesting}
      /> */}

      <Flex alignItems="center" justifyContent="space-around" width="100%">
        <FlexInfoItem>
          <Text bold fontSize="12px">
            Available Rewards
          </Text>
          <InfoItemValue>
            <CardValue value={rawEarned} decimals={3} elevation={elevation} fontSize="22px" />
            <HighlightedText bold monospace mt="-8px" elevation={elevation}>
              {earnLabel}
            </HighlightedText>
          </InfoItemValue>
        </FlexInfoItem>
        <FlexInfoItem>
          <Text bold fontSize="12px">
            Vesting Rewards
          </Text>
          <InfoItemValue>
            <CardValue value={rawVesting} decimals={3} elevation={elevation} fontSize="22px" />
            <HighlightedText bold monospace mt="-8px" elevation={elevation}>
              {earnLabel}
            </HighlightedText>
          </InfoItemValue>
        </FlexInfoItem>
      </Flex>

      <Flex flexDirection="column" mt="12px">
        <Flex alignItems="center" justifyContent="center" width="100%">
          <SummitButton
            elevation={elevation}
            isLocked={elevationLocked}
            isLoading={harvestPending}
            disabled={crossCompoundPending || nothingToClaim}
            mr="8px"
            onClick={() => onHarvestElevation(false)}
          >
            HARVEST
            <br />
            AVAIL REWARDS
          </SummitButton>
          <SummitButton
            elevation={elevation}
            isLocked={elevationLocked}
            isLoading={crossCompoundPending}
            disabled={harvestPending || nothingToClaim}
            onClick={() => onHarvestElevation(true)}
          >
            COMPOUND{'\u00A0'}*
            <br />
            AVAIL REWARDS
          </SummitButton>
        </Flex>
        <Text fontSize="13px" mt="8px" textAlign='center' bold monospace>
          * Compound: Harvest earned SUMMIT and
          <br />
          deposit in SUMMIT farm at this elevation
        </Text>
      </Flex>
    </Flex>
  )
}

export default React.memo(ElevationUserRoundInfo)
