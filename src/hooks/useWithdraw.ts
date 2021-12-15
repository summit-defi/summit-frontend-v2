import { useCallback, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync } from 'state/actions'
import { unstake } from 'utils/callHelpers'
import { useCartographer } from './useContract'
import useToast, { useTransactionToasts } from './useToast'
import { Elevation } from 'config/constants/types'
import { setPendingExpeditionTx } from 'state/summitEcosystem'

const useWithdraw = (elevation: Elevation, pid: number) => {
  const dispatch = useDispatch()
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useTransactionToasts()

  const { account } = useWallet()
  const cartographer = useCartographer()

  const handleWithdraw = useCallback(
    async (lpName: string, amount: string, amountSummitLp: string, decimals: number) => {
      const filteredAmount = amount || '0'
      const filteredAmountSummitLp = amountSummitLp || '0'
      try {
        setPending(true)
        if (elevation === Elevation.EXPEDITION) dispatch(setPendingExpeditionTx(true))
        await unstake(cartographer, pid, filteredAmount, filteredAmountSummitLp, account, decimals)
        toastSuccess(`${lpName} Withdraw Confirmed`)
      } catch (error) {
        toastError(`${lpName} Withdraw Failed`, (error as Error).message)
      } finally {
        setPending(false)
        if (elevation === Elevation.EXPEDITION) dispatch(setPendingExpeditionTx(true))
        dispatch(fetchFarmUserDataAsync(account))
      }
    },
    [elevation, account, dispatch, cartographer, pid, setPending, toastSuccess, toastError],
  )

  return { onWithdraw: handleWithdraw, pending }
}

export const useExpeditionWithdrawWithConfirm = (pid: number) => {
  const dispatch = useDispatch()
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useToast()

  const { account } = useWallet()
  const cartographer = useCartographer()

  const handleWithdraw = useCallback(
    async (lpName: string, amount: string, amountSummitLp: string, decimals: number) => {
      const filteredAmount = amount || '0'
      const filteredAmountSummitLp = amountSummitLp || '0'
      try {
        setPending(true)
        await unstake(cartographer, pid, filteredAmount, filteredAmountSummitLp, account, decimals)
        toastSuccess(`${lpName} Withdraw Confirmed`)
      } catch (error) {
        toastError(`${lpName} Withdraw Failed`, (error as Error).message)
      } finally {
        setPending(false)
        dispatch(fetchFarmUserDataAsync(account))
      }
    },
    [account, dispatch, cartographer, pid, setPending, toastSuccess, toastError],
  )

  return { onWithdraw: handleWithdraw, pending }
}

export default useWithdraw
