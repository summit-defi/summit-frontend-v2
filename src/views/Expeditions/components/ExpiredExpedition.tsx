import BigNumber from 'bignumber.js'
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Image, Flex, Text, HighlightedText, Heading, TokenSymbolImage, useModal } from 'uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import useStake from 'hooks/useStake'
import useWithdraw from 'hooks/useWithdraw'
import { useClaimPool } from 'hooks/useClaim'
import { ExpeditionInfo } from 'state/types'
import { FCard } from 'views/ElevationFarms/components/FCard'
import SummitButton from 'uikit/components/Button/SummitButton'
import { Elevation } from 'config/constants/types'
import CardValue from 'views/Home/components/CardValue'
import { getBalanceNumber, getFullDisplayBalance } from 'utils'
import useElevate from 'hooks/useElevate'
import ElevateModal from 'views/ElevationFarms/components/ElevateModal'
import { useSummitLp } from 'hooks/useContract'
import { useHistory } from 'react-router-dom'
import ExpeditionCardUserSection from './ExpeditionCardUserSection'

const ExpeditionWrapper = styled(FCard)`
  background: none;
  box-shadow: none;

  top: -100px;
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

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.EXPEDITION};
  height: 1px;
  margin-top: 32px;
  margin-bottom: 32px;
  width: 100%;
`

const Glow = styled(Flex)`
  margin-top: 48px;
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

interface ExpiredExpeditionProps {
  expedition: ExpeditionInfo
  summitAllowance: BigNumber
  summitBalance: BigNumber
  summitLpAllowance: BigNumber
  summitLpBalance: BigNumber
}

const ExpiredExpedition: React.FC<ExpiredExpeditionProps> = ({ expedition, summitAllowance, summitBalance, summitLpAllowance, summitLpBalance }) => {

  return null
  // const { pid, rewardToken, userData } = expedition
  // const { stakedSummit, stakedSummitLp, claimable } = userData || {}
  // const summitLpContract = useSummitLp()
  // const history = useHistory()

  // const zeroStaked = (stakedSummit || new BigNumber(0)).isEqualTo(0) && (stakedSummitLp || new BigNumber(0)).isEqualTo(0)
  // const zeroWon = (claimable || new BigNumber(0)).isEqualTo(0)


  // const { onWithdraw, pending: exitPending } = useWithdraw(Elevation.EXPEDITION, pid)

  // const winnings = (claimable || new BigNumber(0))
  // const rawWinnings = getBalanceNumber(winnings, rewardToken.decimals)
  // const rawSummitStaked = getBalanceNumber(stakedSummit)
  // const rawSummitLpStaked = getBalanceNumber(stakedSummitLp)

  // const { onElevate } = useElevate()

  // const openExpeditionPage = () => {
  //   history.push('/expedition')
  // }

  

  // if (zeroStaked && zeroWon) return null

  // return (
  //   <ExpeditionWrapper>
  //     <Glow justifyContent="center" flexDirection="column" alignItems="center">
  //       <TokenSymbolImage symbol={rewardToken.symbol} width={80} height={80} />
  //       <Text bold monospace fontSize="14px" letterSpacing="5px">
  //         FINISHED EXPEDITION:
  //       </Text>
  //       <Text bold monospace mb="48px" fontSize="24px" letterSpacing="5px">
  //         {rewardToken.symbol}
  //       </Text>
  //     </Glow>

  //     <InfoItem>
  //       <Text mt="4px" bold>
  //         WINNINGS:
  //       </Text>
  //       <Flex justifyContent="flex-end" alignItems="center">
  //         <CardValue value={rawWinnings} decimals={2} elevation={Elevation.EXPEDITION} fontSize="26px" />
  //         <HighlightedText bold monospace ml="6px" mt="4px">
  //           {rewardToken.symbol}
  //         </HighlightedText>
  //       </Flex>
  //     </InfoItem>

  //     <InfoItem>
  //       <Text mt="4px" bold>
  //         STAKED:
  //       </Text>
  //       <Flex justifyContent="flex-end" alignItems="center">
  //         <CardValue value={rawSummitStaked} decimals={2} elevation={Elevation.EXPEDITION} fontSize="26px" />
  //         <HighlightedText bold monospace ml="6px" mt="4px">
  //           SUMMIT
  //         </HighlightedText>
  //       </Flex>
  //       <Flex justifyContent="flex-end" alignItems="center">
  //         <CardValue value={rawSummitLpStaked} decimals={2} elevation={Elevation.EXPEDITION} fontSize="26px" />
  //         <HighlightedText bold monospace ml="6px" mt="4px">
  //           SUMMIT-FTM LP
  //         </HighlightedText>
  //       </Flex>
  //     </InfoItem>

  //     <ExpeditionCardUserSection
  //       expedition={expedition}
  //       summitAllowance={summitAllowance}
  //       summitLpAllowance={summitLpAllowance}
  //       summitBalance={summitBalance}
  //       summitLpBalance={summitLpBalance}
  //       expeditionLocked={false}
  //       expired
  //     />
  //   </ExpeditionWrapper>
  // )
}

const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 0;
  width: 100%;
  box-sizing: border-box;
`

const BalanceAndCompound = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
`

export default ExpiredExpedition
