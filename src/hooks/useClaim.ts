import { useCallback, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync } from 'state/actions'
import { claimPool, claimElevation } from 'utils'
import { useCartographer } from './useContract'
import useToast from './useToast'
import { Elevation, elevationUtils } from 'config/constants/types'


export const useClaimPool = (farmToken: string, elevation: Elevation) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const cartographer = useCartographer()
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useToast()

  const handleClaim = useCallback(async () => {
    try {
      setPending(true)
      await claimPool(cartographer, farmToken, elevationUtils.toInt(elevation), account)
      toastSuccess('Rewards Claimed Successfully')
    } catch (error) {
      toastError('Error Claiming Rewards', (error as Error).message)
    } finally {
      dispatch(fetchFarmUserDataAsync(account))
      setPending(false)
    }
  }, [
    farmToken,
    elevation,
    account,
    dispatch,
    cartographer,
    setPending,
    toastSuccess,
    toastError,
  ])

  return { onClaim: handleClaim, pending }
}

export const useClaimElevation = (elevation: Elevation) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const cartographer = useCartographer()
  const [claimPending, setClaimPending] = useState(false)
  const { toastSuccess, toastError } = useToast()

  const handleClaimElevation = useCallback(
    async () => {
      try {
        setClaimPending(true)

        await claimElevation(cartographer, elevation, account)

        toastSuccess(`Winnings Claimed`)
      } catch (error) {
        toastError(`Error Claiming Winnings`, (error as Error).message)
      } finally {
        dispatch(fetchFarmUserDataAsync(account))
        setClaimPending(false)
      }
    },
    [account, dispatch, elevation, cartographer, setClaimPending, toastSuccess, toastError],
  )

  return { onClaimElevation: handleClaimElevation, claimPending }
}
