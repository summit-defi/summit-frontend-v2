import React from 'react'
import styled from 'styled-components'
import { Flex, Text, TokenSymbolImage } from 'uikit'
import { getFormattedBigNumber } from 'utils/formatBalance'
import { Expedition } from 'state/types'
import UpcomingExpeditionTimer from './UpcomingExpeditionTimer'

const ExpeditionWrapper = styled.div`
  background: none;
  box-shadow: none;
  width: 100%;
  max-width: 500px;
  padding: 0px 24px;
  margin-bottom: 56px;

  top: -158px;
  ${({ theme }) => theme.mediaQueries.nav} {
    top: -158px;
  }
`

const InfoSection = styled(Flex)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.nav} {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-around;
    margin-bottom: 32px;
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
  expedition: Expedition
}

const UpcomingExpeditionCard: React.FC<Props> = ({ expedition }) => {
  return null
  // const { rewardToken, roundsRemaining, rewardsRemaining } = expedition

  // return (
  //   <ExpeditionWrapper>
  //     <Glow justifyContent="center" flexDirection="column" alignItems="center">
  //       <TokenSymbolImage symbol={rewardToken.symbol} width={80} height={80} />
  //       <Text bold monospace fontSize="14px">
  //         UPCOMING EXPEDITION:
  //       </Text>
  //       <Text bold monospace mb="48px" fontSize="24px" letterSpacing="5px">
  //         {rewardToken.symbol}
  //       </Text>
  //     </Glow>

  //     <InfoSection justifyContent="space-around" mb="64px" mt="36px">
  //       <InfoItem>
  //         <Text bold monospace fontSize="14px">
  //           Rounds:
  //         </Text>
  //         <Text bold monospace fontSize="24px">
  //           {roundsRemaining}
  //         </Text>
  //       </InfoItem>
  //       <InfoItem>
  //         <Text bold monospace fontSize="14px">
  //           Total Reward:
  //         </Text>
  //         <Text bold monospace fontSize="24px">
  //           {getFormattedBigNumber(rewardsRemaining, 3, rewardToken.decimals)} {rewardToken.symbol}
  //         </Text>
  //       </InfoItem>
  //     </InfoSection>

  //     <UpcomingExpeditionTimer />
  //   </ExpeditionWrapper>
  // )
}

export default UpcomingExpeditionCard
