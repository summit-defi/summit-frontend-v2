import { useCallback, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import { fetchElevationHelperInfoAsync } from 'state/actions'
import { burnReferralRewards, createReferral, claimReferralRewards } from 'utils/callHelpers'
import { useCartographer, useSummitReferrals } from './useContract'
import { fetchReferralsDataAsync } from 'state/referrals'
import useToast from './useToast'

export const useCreateReferral = () => {
  const dispatch = useDispatch()
  const { account }: { account: string } = useWallet()
  const summitReferrals = useSummitReferrals()
  const { toastSuccess, toastError } = useToast()
  const [pending, setPending] = useState(false)

  const handleCreateReferral = useCallback(
    async (referrerAddress: string) => {
      try {
        setPending(true)
        await createReferral(summitReferrals, referrerAddress, account)
        toastSuccess('Referral Created')
      } catch (error) {
        toastError('Referral Creation Failed', (error as Error).message)
      } finally {
        setPending(false)
        dispatch(fetchReferralsDataAsync(account))
      }
    },
    [account, dispatch, summitReferrals, setPending, toastSuccess, toastError],
  )

  return { onCreateReferral: handleCreateReferral, pending }
}

export const useClaimReferralRewards = () => {
  const dispatch = useDispatch()
  const { account }: { account: string } = useWallet()
  const summitReferrals = useSummitReferrals()
  const { toastSuccess, toastError } = useToast()
  const [pending, setPending] = useState(false)

  const handleClaimReferralRewards = useCallback(async () => {
    try {
      setPending(true)
      await claimReferralRewards(summitReferrals, account)
      toastSuccess('Referral Rewards Claimed')
    } catch (error) {
      toastError('Referral Reward Claim Failed', (error as Error).message)
    } finally {
      dispatch(fetchReferralsDataAsync(account))
      setPending(false)
    }
  }, [account, dispatch, summitReferrals, setPending, toastSuccess, toastError])

  return { onClaimReferralRewards: handleClaimReferralRewards, pending }
}

export const useBurnUnclaimedReferralRewards = () => {
  const dispatch = useDispatch()
  const { account }: { account: string } = useWallet()
  const cartographer = useCartographer()
  const { toastSuccess, toastError } = useToast()
  const [pending, setPending] = useState(false)

  const handleBurnUnclaimedReferralRewards = useCallback(async () => {
    try {
      setPending(true)
      await burnReferralRewards(cartographer, account)
      toastSuccess('Referral Rewards Burned', 'You have been awarded SUMMIT')
    } catch (error) {
      toastError('Referral Burn Failed', (error as Error).message)
    } finally {
      setPending(false)
      dispatch(fetchElevationHelperInfoAsync())
      dispatch(fetchReferralsDataAsync(account))
    }
  }, [account, dispatch, cartographer, setPending, toastSuccess, toastError])

  return { onBurnUnclaimedReferralRewards: handleBurnUnclaimedReferralRewards, pending }
}
