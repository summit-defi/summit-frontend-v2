import { useCallback, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync } from 'state/actions'
import { claimPool, claimElevation, capitalizeFirstLetter } from 'utils'
import { useCartographer } from './useContract'
import { useTransactionToasts } from './useToast'
import { Elevation } from 'config/constants/types'
import { fetchTokensUserDataAsync } from 'state/tokens'


export const useClaimPool = (farmToken: string, elevation: Elevation) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const cartographer = useCartographer()
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useTransactionToasts()

  const handleClaim = useCallback(async () => {
    try {
      setPending(true)
      await claimPool(cartographer, farmToken, elevation, account)
      toastSuccess('Rewards Claimed Successfully')
    } catch (error) {
      toastError('Error Claiming Rewards', (error as Error).message)
    } finally {
      dispatch(fetchFarmUserDataAsync(account))
      dispatch(fetchTokensUserDataAsync(account))
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

export const useClaimElevation = () => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const cartographer = useCartographer()
  const [claimPending, setClaimPending] = useState(false)
  const { toastSuccess, toastError } = useTransactionToasts()

  const handleClaimElevation = useCallback(
    async (elevation: Elevation) => {
      try {
        setClaimPending(true)

        await claimElevation(cartographer, elevation, account)

        toastSuccess(`${capitalizeFirstLetter(elevation)} Claimed`)
      } catch (error) {
        toastError(`Error Claiming ${capitalizeFirstLetter(elevation)}`, (error as Error).message)
      } finally {
        dispatch(fetchFarmUserDataAsync(account))
        dispatch(fetchTokensUserDataAsync(account))
        setClaimPending(false)
      }
    },
    [account, dispatch, cartographer, setClaimPending, toastSuccess, toastError],
  )

  return { onClaimElevation: handleClaimElevation, claimPending }
}
