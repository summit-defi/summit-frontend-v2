import React from 'react'
import styled from 'styled-components'
import { BaseLayout } from 'uikit'
import Page from 'components/layout/Page'
import UserReferrals from './components/UserReferrals'
import { useReferrals } from 'state/hooks'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import ReferralsBurn from './components/ReferralsBurn'

const StyledPage = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 48px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`

const Referrals: React.FC = () => {
  const { account } = useWallet()
  const { referrer, pendingRewards, accumulatedRewards, rewardsToBeBurned } = useReferrals(account)

  return (
    <StyledPage>
      <Cards>
        <UserReferrals referrer={referrer} pendingRewards={pendingRewards} accumulatedRewards={accumulatedRewards} />
        <ReferralsBurn rewardsToBeBurned={rewardsToBeBurned} />
      </Cards>
    </StyledPage>
  )
}

export default Referrals
