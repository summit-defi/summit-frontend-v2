import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, HighlightedText } from 'uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { Expedition } from 'state/types'
import { Elevation } from 'config/constants/types'
import CardValue from 'views/Home/components/CardValue'
import { useElevationTotem, usePricesPerToken, useSummitPrice } from 'state/hooks'
import ExpeditionTokenSelector from './ExpeditionTokenSelector'
import ExpeditionTokenManagement from './ExpeditionTokenManagement'
import PageLoader from 'components/PageLoader'

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.nav} {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-around;
  }
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 32px;
  margin-top: 24px;

  ${({ theme }) => theme.mediaQueries.nav} {
    flex-direction: column;
    justify-content: center;
    width: auto;
    height: auto;
  }
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.EXPEDITION};
  height: 1px;
  margin-top: 32px;
  margin-bottom: 32px;
  width: 100%;
`

interface HarvestProps {
  expedition: Expedition
  summitAllowance: BigNumber
  summitBalance: BigNumber
  summitLpAllowance: BigNumber
  summitLpBalance: BigNumber
  expeditionLocked: boolean
  expired?: boolean
}

const ExpeditionCardUserSection: React.FC<HarvestProps> = ({
  expedition,
  summitAllowance,
  summitLpAllowance,
  summitBalance,
  summitLpBalance,
  expeditionLocked,
  expired = false,
}) => {

  return null
  // const { userData, roundEmission, totemWinMultipliers } = expedition
  // const { stakedSummit, stakedSummitLp, effectiveStakedSummit } = userData || {}

  // const userDeity = useElevationTotem(Elevation.EXPEDITION)
  // const summitPrice = useSummitPrice()
  // const userDepositValue: number = useMemo(
  //   () => {
  //     return (effectiveStakedSummit || new BigNumber(0)).div(new BigNumber(10).pow(18)).times(summitPrice).toNumber()
  //   },
  //   [summitPrice, effectiveStakedSummit]
  // )
  // const userExpectedWinValue: number = useMemo(
  //   () => {
  //     return (effectiveStakedSummit || new BigNumber(0)).div(new BigNumber(10).pow(18)).times(totemWinMultipliers != null ? totemWinMultipliers[userDeity] : 0).toNumber()
  //   },
  //   [effectiveStakedSummit, totemWinMultipliers, userDeity]
  // )

  // // const rawYieldOnWin = getBalanceNumber(roundEmission, rewardToken.decimals)

  // // MOBILE TOKEN TYPE SELECTOR
  // const [mobileSelectedToken, setMobileSelectedToken] = useState(0)

  // const mobileTokenSelector = useCallback(
  //   () => <ExpeditionTokenSelector deity={userDeity} setSelectedToken={setMobileSelectedToken} expired={expired} />,
  //   [userDeity, setMobileSelectedToken, expired],
  // )

  // const stakedToDepositInfo = useCallback(() => <ExpeditionStakedToDepositedInfo />, [])

  // // SUMMIT TOKEN MANAGEMENT
  // const summitTokenManagementSection = useCallback(
  //   () => (
  //     <ExpeditionTokenManagement
  //       pid={pid}
  //       userDeity={userDeity}
  //       isSummitLp={false}
  //       allowance={summitAllowance}
  //       staked={stakedSummit}
  //       balance={summitBalance}
  //       expeditionLocked={expeditionLocked}
  //       expired={expired}
  //     />
  //   ),
  //   [pid, userDeity, summitAllowance, stakedSummit, summitBalance, expeditionLocked, expired],
  // )

  // // SUMMIT LP TOKEN MANAGEMENT
  // const summitLpManagementSection = useCallback(
  //   () => (
  //     <ExpeditionTokenManagement
  //       pid={pid}
  //       userDeity={userDeity}
  //       isSummitLp
  //       allowance={summitLpAllowance}
  //       staked={stakedSummitLp}
  //       balance={summitLpBalance}
  //       expeditionLocked={expeditionLocked}
  //       expired={expired}
  //     />
  //   ),
  //   [pid, userDeity, summitLpAllowance, stakedSummitLp, summitLpBalance, expeditionLocked, expired],
  // )

  // if (userData == null) {
  //   return <PageLoader fill={false} />
  // }

  // return (
  //   <>
  //     { !expired &&
  //       <>
  //         <InfoSection>
  //           <InfoItem>
  //             <Text mt="4px" bold textAlign="center">
  //               Combined
  //               <br />
  //               Deposit:
  //             </Text>
  //             <Flex justifyContent="flex-end" alignItems="center">
  //               <CardValue value={userDepositValue} prefix='$' decimals={2} elevation={Elevation.EXPEDITION} fontSize="22px" />
  //             </Flex>
  //           </InfoItem>
  //           <InfoItem>
  //             <Text mt="4px" bold textAlign="center">
  //               Expected Rewards:
  //               <br />
  //               (If Win)
  //             </Text>
  //             <Flex justifyContent="flex-end" alignItems="center">
  //               <CardValue value={userExpectedWinValue} decimals={3} elevation={Elevation.EXPEDITION} fontSize="22px" />
  //               <HighlightedText bold monospace ml="6px" mt="4px">
  //                 {rewardToken.symbol}
  //               </HighlightedText>
  //             </Flex>
  //           </InfoItem>
  //         </InfoSection>

  //         <Divider />
  //       </>
  //     }

  //     {mobileTokenSelector()}

  //     { !expired && stakedToDepositInfo() }

  //     {mobileSelectedToken === 0 ? summitTokenManagementSection() : summitLpManagementSection()}

  //     { !expired &&
  //       <Divider />
  //     }
  //   </>
  // )
}

export default ExpeditionCardUserSection
