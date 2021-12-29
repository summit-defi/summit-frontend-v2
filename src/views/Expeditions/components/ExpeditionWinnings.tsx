import React from 'react'
import styled from 'styled-components'
import { Flex, HighlightedText } from 'uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { Expedition } from 'state/types'
import { Elevation } from 'config/constants/types'
import CardValue from 'views/Home/components/CardValue'
import BigNumber from 'bignumber.js'
import { useClaimPool } from 'hooks/useClaim'
import SummitButton from 'uikit/components/Button/SummitButton'

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 56px;
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 32px;
  margin-top: 24px;
  margin-bottom: 12px;

  ${({ theme }) => theme.mediaQueries.nav} {
    flex-direction: column;
    justify-content: center;
    width: auto;
    height: auto;
  }
`

interface ClaimProps {
  expedition: Expedition
}

const ExpeditionWinnings: React.FC<ClaimProps> = ({ expedition }) => {

  return null
  // const { pid, userData, rewardToken } = expedition
  // const { claimable } = userData || {}
  // const winnings = (claimable || new BigNumber(0))

  // const rawWinnings = getBalanceNumber(winnings, rewardToken.decimals)
  // const { onClaim, pending: claimPending } = useClaimPool(pid)

  // if (rawWinnings === 0) return null

  // return (
  //   <InfoSection>
  //     <InfoItem>
  //       <HighlightedText mt="4px" fontSize="14px" bold textAlign="center">
  //         REWARDS:
  //       </HighlightedText>
  //       <Flex justifyContent="flex-end" alignItems="center">
  //         <CardValue value={rawWinnings} decimals={2} elevation={Elevation.EXPEDITION} fontSize="26px" />
  //         <HighlightedText bold monospace ml="6px" mt="4px">
  //           {rewardToken.symbol}
  //         </HighlightedText>
  //       </Flex>
  //     </InfoItem>
  //     <SummitButton elevation="GOLD" isLoading={claimPending} mr="8px" onClick={onClaim}>
  //       COLLECT REWARDS
  //     </SummitButton>
  //   </InfoSection>
  // )
}

export default ExpeditionWinnings
