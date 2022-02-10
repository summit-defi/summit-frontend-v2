import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import { fetchFarmUserDataAsync } from 'state/actions'
import { withdraw } from 'utils/callHelpers'
import { useCartographer } from './useContract'
import { useTransactionToasts } from './useToast'
import { Elevation } from 'config/constants/types'
import { fetchTokensUserDataAsync } from 'state/tokens'

const useWithdraw = (farmToken: string, elevation: Elevation) => {
  const dispatch = useDispatch()
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useTransactionToasts()

  const { account } = useWeb3React()
  const cartographer = useCartographer()

  const handleWithdraw = useCallback(
    async (symbol: string, amount: string, decimals: number) => {
      const filteredAmount = amount || '0'
      try {
        setPending(true)
        await withdraw(cartographer, farmToken, elevation, filteredAmount, decimals)
        toastSuccess(`${symbol} Withdraw Confirmed`)
      } catch (error) {
        toastError(`${symbol} Withdraw Failed`, (error as Error).message)
      } finally {
        setPending(false)
        dispatch(fetchFarmUserDataAsync(account))
        dispatch(fetchTokensUserDataAsync(account))
      }
    },
    [elevation, account, dispatch, cartographer, farmToken, setPending, toastSuccess, toastError],
  )

  return { onWithdraw: handleWithdraw, pending }
}

export default useWithdraw
