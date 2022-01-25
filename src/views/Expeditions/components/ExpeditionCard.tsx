import BigNumber from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'
import { Flex, Text, TokenSymbolImage } from 'uikit'
import { getFormattedBigNumber } from 'utils/formatBalance'
import { ExpeditionInfo } from 'state/types'
import ElevationTimerAndRollover from 'views/ElevationFarms/components/ElevationTimerAndRollover'
import ExpeditionCardUserSection from './ExpeditionCardUserSection'
import ExpeditionWinnings from './ExpeditionWinnings'
import { useSummitPrice } from 'state/hooks'

const ExpeditionWrapper = styled.div`
  background: none;
  box-shadow: none;

  top: -158px;
  ${({ theme }) => theme.mediaQueries.nav} {
    top: -158px;
  }
`

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.nav} {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-around;
    max-width: 550px;
    margin: 0px auto 32px auto;
  }
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 32px;

  ${({ theme }) => theme.mediaQueries.nav} {
    flex-direction: column;
    justify-content: center;
    width: auto;
    height: auto;
    width: 50%;
  }
`

const Glow = styled(Flex)`
  filter: drop-shadow(0vw 0vw 2vw white);
  animation: rewardTokenFloat 4s ease-in-out infinite;
  @keyframes rewardTokenFloat {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(7.5px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`

interface Props {
  expedition: ExpeditionInfo
  summitAllowance: BigNumber
  summitBalance: BigNumber
  summitLpAllowance: BigNumber
  summitLpBalance: BigNumber
  expeditionLocked: boolean
}

const ExpeditionCard: React.FC<Props> = ({
  expedition,
  summitAllowance,
  summitLpAllowance,
  summitBalance,
  summitLpBalance,
  expeditionLocked,
}) => {
  return null
  // const {
  //   rewardToken,
  //   roundsRemaining,
  //   roundEmission: rewardEmission,
  //   rewardsRemaining,
  //   totalDeposited,
  // } = expedition

  // const rewardTokenPrice = new BigNumber(1)
  // const summitPrice = useSummitPrice()

  // const totalValue = totalDeposited && summitPrice ? totalDeposited.times(summitPrice) : undefined
  
  // const totalValueFormatted = totalValue ? `$${getFormattedBigNumber(totalValue, 2)}` : '-'

  // return (
  //   <ExpeditionWrapper>
  //     <Glow justifyContent="center" flexDirection="column" alignItems="center">
  //       <TokenSymbolImage symbol={rewardToken.symbol} width={80} height={80} />
  //       <Text bold monospace mb="48px" fontSize="24px" letterSpacing="5px">
  //         {rewardToken.symbol}
  //       </Text>
  //     </Glow>

  //     <ExpeditionWinnings expedition={expedition} />

  //     <ElevationTimerAndRollover />

  //     <ExpeditionCardUserSection
  //       expedition={expedition}
  //       summitAllowance={summitAllowance}
  //       summitLpAllowance={summitLpAllowance}
  //       summitBalance={summitBalance}
  //       summitLpBalance={summitLpBalance}
  //       expeditionLocked={expeditionLocked}
  //     />

  //     <InfoSection>
  //       <InfoItem>
  //         <Text>Rounds Remaining</Text>
  //         <Text bold monospace>
  //           {roundsRemaining}
  //         </Text>
  //       </InfoItem>
  //       <InfoItem>
  //         <Text>TVL</Text>
  //         <Text bold monospace style={{ display: 'flex', alignItems: 'center', height: '48px' }}>
  //           {totalValueFormatted}
  //         </Text>
  //       </InfoItem>
  //     </InfoSection>

  //     <InfoSection>
  //       <InfoItem>
  //         <Text>{rewardToken.symbol} / ROUND</Text>
  //         <Text bold monospace>
  //           {getFormattedBigNumber(rewardEmission, 3, rewardToken.decimals)} {rewardToken.symbol}
  //         </Text>
  //       </InfoItem>
  //       <InfoItem>
  //         <Text>REWARDS REMAINING</Text>
  //         <Text bold monospace>
  //           {getFormattedBigNumber(rewardsRemaining, 3, rewardToken.decimals)} {rewardToken.symbol}
  //         </Text>
  //       </InfoItem>
  //     </InfoSection>
  //   </ExpeditionWrapper>
  // )
}

export default ExpeditionCard
