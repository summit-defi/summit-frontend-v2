import { useCallback, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync } from 'state/actions'
import { elevate } from 'utils/callHelpers'
import { useCartographer } from './useContract'
import useToast from './useToast'
import { Elevation } from 'config/constants/types'
import { setPendingExpeditionTx } from 'state/summitEcosystem'

const useElevate = () => {
  const dispatch = useDispatch()
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { account } = useWallet()
  const cartographer = useCartographer()

  const handleElevate = useCallback(
    async (lpName: string, token: string, sourceElevation: string, targetElevation: number, amount: string, decimals: number) => {
      try {
        setPending(true)
        dispatch(setPendingExpeditionTx(true))
        await elevate(cartographer, token, sourceElevation, targetElevation, amount, account, decimals)
        toastSuccess(`${lpName} Elevate Confirmed`)
      } catch (error) {
        toastError(`${lpName} Elevate Failed`, (error as Error).message)
      } finally {
        setPending(false)
        dispatch(setPendingExpeditionTx(false))
        dispatch(fetchFarmUserDataAsync(account))
      }
    },
    [account, dispatch, cartographer, setPending, toastSuccess, toastError],
  )

  return { onElevate: handleElevate, pending }
}

export default useElevate
