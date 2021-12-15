import { getSummitReferralsAddress, retryableMulticall, abi } from 'utils/'
import BigNumber from 'bignumber.js'

export const fetchReferralsData = async (account) => {
  const summitReferralsAddress = getSummitReferralsAddress()
  const calls = [
    {
      address: summitReferralsAddress,
      name: 'referrerOf',
      params: [account],
    },
    {
      address: summitReferralsAddress,
      name: 'getPendingReferralRewards',
      params: [account],
    },
    {
      address: summitReferralsAddress,
      name: 'totalReferralRewards',
      params: [account],
    },
    {
      address: summitReferralsAddress,
      name: 'getReferralRewardsToBeBurned',
    },
  ]

  const res = await retryableMulticall(abi.summitReferrals, calls, 'fetchReferralsData')
  if (res == null) return null
  const [[referrer], [pendingRewards], [accumulatedRewards], [rewardsToBeBurned]] = res

  return {
    referrer,
    pendingRewards: new BigNumber(pendingRewards._hex).toNumber(),
    accumulatedRewards: new BigNumber(accumulatedRewards._hex).toNumber(),
    rewardsToBeBurned: new BigNumber(rewardsToBeBurned._hex).toNumber(),
  }
}
