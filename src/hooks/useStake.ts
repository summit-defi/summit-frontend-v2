import { useCallback, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync } from 'state/actions'
import { stake } from 'utils/callHelpers'
import { useCartographer } from './useContract'
import { useTransactionToasts } from './useToast'
import { Elevation } from 'config/constants/types'
import { fetchTokensUserDataAsync } from 'state/tokens'
import BigNumber from 'bignumber.js'

const useStake = (farmToken: string, elevation: Elevation) => {
  const dispatch = useDispatch()
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useTransactionToasts()
  const { account } = useWallet()
  const cartographer = useCartographer()

  const handleStake = useCallback(
    async (symbol: string, amount: string, decimals: number) => {
      const filteredAmount = amount || '0'
      try {
        setPending(true)
        await stake(cartographer, farmToken, elevation, filteredAmount, account, decimals)
        toastSuccess(`${symbol} Deposit Confirmed`)
      } catch (error) {
        toastError(`${symbol} Deposit Failed`, (error as Error).message)
      } finally {
        setPending(false)
        dispatch(fetchFarmUserDataAsync(account))
        dispatch(fetchTokensUserDataAsync(account))
      }
    },
    [elevation, account, dispatch, cartographer, farmToken, setPending, toastSuccess, toastError],
  )

  return { onStake: handleStake, pending }
}

export default useStake
