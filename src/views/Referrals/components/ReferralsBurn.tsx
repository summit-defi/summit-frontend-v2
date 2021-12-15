import BigNumber from 'bignumber.js'
import { getNativeTokenSymbol } from 'config/constants'
import React from 'react'
import { useRolloverRewards } from 'state/hooks'
import styled from 'styled-components'
import { Card, Text, Flex, HighlightedText } from 'uikit'
import { getBalanceNumber } from 'utils'
import CardValue from 'views/Home/components/CardValue'
import ReferralTimerAndRollover from './ReferralTimerAndRollover'

const HeaderWrapper = styled(Flex)`
  position: relative;
  z-index: 10;
  padding: 24px;
  height: 100%;
`

interface Props {
  rewardsToBeBurned: number
}

const ReferralsBurn: React.FC<Props> = ({ rewardsToBeBurned }) => {
  const { rolloverRewardInNativeToken, rolloverRewardInSummit } = useRolloverRewards()
  return (
    <Card>
      <HeaderWrapper flexDirection="column" alignItems="center" justifyContent="center">
        <HighlightedText header>BURN</HighlightedText>
        <Text textAlign="center" fontSize="small" mt="16px" mb="24px">
          2% of minted SUMMIT is marked for referral rewards.
          <br />
          Every 7 days all unclaimed referral rewards are burned.
          <br />
          <br />
          <b>
            Burning the rewards earns {getBalanceNumber(rolloverRewardInNativeToken)} {getNativeTokenSymbol()} worth of
            SUMMIT.
          </b>
        </Text>

        <Flex flexDirection="column" flex="1" justifyContent="center">
          <HighlightedText>UNCLAIMED REWARDS:</HighlightedText>
          <Flex justifyContent="center" mb="18px">
            <CardValue
              fontSize="22px"
              value={getBalanceNumber(new BigNumber(rewardsToBeBurned))}
              decimals={3}
              postfix="SUMMIT"
            />
          </Flex>

          <HighlightedText>REWARD FOR BURN:</HighlightedText>
          <Flex justifyContent="center">
            <CardValue fontSize="20px" value={getBalanceNumber(rolloverRewardInSummit)} decimals={3} postfix="SUMMIT" />
          </Flex>
        </Flex>

        <ReferralTimerAndRollover />
      </HeaderWrapper>
    </Card>
  )
}

export default React.memo(ReferralsBurn, (prev, next) => prev.rewardsToBeBurned === next.rewardsToBeBurned)
