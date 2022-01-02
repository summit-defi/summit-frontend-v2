import { useCallback, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import {
  fetchElevationHelperInfoAsync,
  fetchExpeditionUserDataAsync,
  fetchFarmUserDataAsync,
  updateElevationInfoAsync,
} from 'state/actions'
import { rolloverElevation } from 'utils/callHelpers'
import { useCartographer } from './useContract'
import { Elevation } from 'config/constants/types'
import useToast from './useToast'
import { fetchTokensUserDataAsync } from 'state/tokens'

const useRolloverElevation = () => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const cartographer = useCartographer()
  const { toastError, toastSuccess } = useToast()
  const [pending, setPending] = useState(false)

  const handleRolloverElevation = useCallback(
    async (elevation: Elevation, isUnlock: boolean) => {
      setPending(true)
      try {
        await rolloverElevation(cartographer, elevation, account)
        toastSuccess(
          `THE ${elevation}: ${isUnlock ? 'Unlocked' : 'Rolled Over'}`,
          'You have been sent your SUMMIT reward',
        )
      } catch (error) {
        toastError(`THE ${elevation}: ${isUnlock ? 'Unlock' : 'Rollover'} Failed`, (error as Error).message)
      } finally {
        setPending(false)
        if (elevation === Elevation.EXPEDITION) {
          dispatch(fetchExpeditionUserDataAsync(account))
        } else {
          dispatch(fetchFarmUserDataAsync(account))
          dispatch(fetchTokensUserDataAsync(account))
        }
        dispatch(fetchElevationHelperInfoAsync())
        dispatch(updateElevationInfoAsync(elevation))
      }
    },
    [account, dispatch, cartographer, setPending, toastSuccess, toastError],
  )

  return { onRolloverElevation: handleRolloverElevation, pending }
}

export default useRolloverElevation
