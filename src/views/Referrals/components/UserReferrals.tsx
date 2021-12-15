import BigNumber from 'bignumber.js'
import { ZEROADD } from 'config/constants/types'
import { useCreateReferral, useHarvestReferralRewards } from 'hooks/useCreateOrBurnReferrals'
import React from 'react'
import styled from 'styled-components'
import { Flex, Text, HighlightedText, Card, useModal } from 'uikit'
import SummitButton from 'uikit/components/Button/SummitButton'
import { getBalanceNumber } from 'utils'
import CardValue from 'views/Home/components/CardValue'
import ReferralAccountEntryModal from './ReferralAccountEntryModal'

const HeaderWrapper = styled(Flex)`
  position: relative;
  z-index: 10;
  padding: 24px;
`
const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  margin-bottom: 20px;
  width: 100%;
`

interface Props {
  referrer: string
  pendingRewards: number
  accumulatedRewards: number
}

const UserReferrals: React.FC<Props> = ({ referrer, pendingRewards, accumulatedRewards }) => {
  const { onCreateReferral, pending: createReferralPending } = useCreateReferral()
  const { onHarvestReferralRewards, pending: harvestReferralRewardsPending } = useHarvestReferralRewards()
  const [onPresentAccountEntry] = useModal(<ReferralAccountEntryModal onCreateReferral={onCreateReferral} />)

  return (
    <Card>
      <HeaderWrapper flexDirection="column" alignItems="center" justifyContent="center">
        <HighlightedText header>REFERRALS</HighlightedText>
        <Text textAlign="center" fontSize="small" mt="16px" mb="24px">
          Refer friends to each earn bonuses:
          <br />
          <b>Earn 1% bonus on your own staking rewards.</b>
          <br />
          <b>Earn 1% bonus of staking rewards of each address you refer.</b>
          <br />
          <br />
          Share your address to refer friends,
          <br />
          or add a referral address below.
          <br />
          <br />
          <b>Unclaimed referral bonuses are burned every 7 days.</b>
          <br />
          <br />
          (no limit on number of addresses referred)
          <br />
          (cant refer yourself)
          <br />
          (can only be referred by one address)
          <br />
          (cant refer the address that referred you)
        </Text>
        <Divider />
        {referrer === ZEROADD && true ? (
          <SummitButton isLoading={createReferralPending} size="lg" onClick={onPresentAccountEntry} mb="12px" mt="16px">
            ENTER REFERRAL ADDRESS
          </SummitButton>
        ) : (
          <Text bold textAlign="center" fontSize="small" mb="16px">
            Referrer:
            <br />
            {referrer.substring(0, 4)}...{referrer.substring(referrer.length - 4)}
          </Text>
        )}

        <Text bold textAlign="center" fontSize="small">
          Lifetime Rewards:
        </Text>
        <Text bold italic textAlign="center" mb="16px">
          <CardValue
            fontSize="16px"
            value={getBalanceNumber(new BigNumber(accumulatedRewards))}
            decimals={3}
            postfix="SUMMIT"
          />
        </Text>

        <HighlightedText>AVAILABLE REWARDS:</HighlightedText>
        <CardValue
          fontSize="22px"
          value={getBalanceNumber(new BigNumber(pendingRewards))}
          decimals={3}
          postfix="SUMMIT"
        />
        <SummitButton
          isLoading={harvestReferralRewardsPending}
          disabled={pendingRewards === 0}
          size="lg"
          onClick={onHarvestReferralRewards}
          mt="8px"
        >
          CLAIM REWARDS
        </SummitButton>
      </HeaderWrapper>
    </Card>
  )
}

export default UserReferrals
