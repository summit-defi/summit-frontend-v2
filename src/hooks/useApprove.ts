import { useCallback, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Contract } from 'web3-eth-contract'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync } from 'state/actions'
import { approve } from 'utils/callHelpers'
import { useCartographer } from './useContract'
import useToast from './useToast'
import { Elevation } from 'config/constants/types'
import { setPendingExpeditionTx } from 'state/summitEcosystem'

// Approve a Farm
export const useApprove = (elevation: Elevation, lpContract: Contract, tokenName: string) => {
  const dispatch = useDispatch()
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { account }: { account: string } = useWallet()
  const cartographer = useCartographer()

  const handleApprove = useCallback(async () => {
    try {
      setPending(true)
      if (elevation === Elevation.EXPEDITION) dispatch(setPendingExpeditionTx(true))
      await approve(lpContract, cartographer, account)
      toastSuccess(`${tokenName} Approved`)
    } catch (error) {
      toastError(`${tokenName} Approval Failed`, (error as Error).message)
    } finally {
      setPending(false)
      if (elevation === Elevation.EXPEDITION) dispatch(setPendingExpeditionTx(false))
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [elevation, account, dispatch, lpContract, cartographer, setPending, toastSuccess, toastError, tokenName])

  return { onApprove: handleApprove, pending }
}
