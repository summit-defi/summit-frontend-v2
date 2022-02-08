import { useCallback, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync } from 'state/actions'
import { useCartographer } from './useContract'
import { useTransactionToasts } from './useToast'
import { Elevation } from 'config/constants/types'
import { fetchTokensUserDataAsync } from 'state/tokens'
import { fetchEverestDataAsync } from 'state/everest'
import { lockFarmSummitForEverest } from 'utils'

const useLockFarmSummitForEverest = () => {
  const dispatch = useDispatch()
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useTransactionToasts()
  const { account } = useWallet()
  const cartographer = useCartographer()

  const handleLockFarmSummitForEverest = useCallback(
    async (sourceElevation: Elevation, amount: string) => {
      const filteredAmount = amount || '0'
      try {
        setPending(true)
        await lockFarmSummitForEverest(cartographer, sourceElevation, filteredAmount, account)
        toastSuccess(`SUMMIT Locked for Everest`)
      } catch (error) {
        toastError(`SUMMIT Lock for Everest Failed`, (error as Error).message)
      } finally {
        setPending(false)
        dispatch(fetchFarmUserDataAsync(account))
        dispatch(fetchTokensUserDataAsync(account))
        dispatch(fetchEverestDataAsync(account))
      }
    },
    [account, dispatch, cartographer, setPending, toastSuccess, toastError],
  )

  return { onLockFarmSummitForEverest: handleLockFarmSummitForEverest, pending }
}

export default useLockFarmSummitForEverest
