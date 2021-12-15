import { useCallback, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync } from 'state/actions'
import { stake } from 'utils/callHelpers'
import { useCartographer } from './useContract'
import { useTransactionToasts } from './useToast'
import { Elevation } from 'config/constants/types'
import { setPendingExpeditionTx } from 'state/summitEcosystem'

const useStake = (elevation: Elevation, pid: number) => {
  const dispatch = useDispatch()
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useTransactionToasts()
  const { account } = useWallet()
  const cartographer = useCartographer()

  const handleStake = useCallback(
    async (lpName: string, amount: string, amountSummitLp: string, totem: number, decimals: number) => {
      const filteredAmount = amount || '0'
      const filteredAmountSummitLp = amountSummitLp || '0'
      try {
        setPending(true)
        if (elevation === Elevation.EXPEDITION) dispatch(setPendingExpeditionTx(true))
        await stake(cartographer, pid, filteredAmount, filteredAmountSummitLp, totem, account, decimals)
        toastSuccess(`${lpName} Deposit Confirmed`)
      } catch (error) {
        toastError(`${lpName} Deposit Failed`, (error as Error).message)
      } finally {
        setPending(false)
        if (elevation === Elevation.EXPEDITION) dispatch(setPendingExpeditionTx(false))
        dispatch(fetchFarmUserDataAsync(account))
      }
    },
    [elevation, account, dispatch, cartographer, pid, setPending, toastSuccess, toastError],
  )

  return { onStake: handleStake, pending }
}

export default useStake
