import { useCallback, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Contract } from 'web3-eth-contract'
import { useDispatch } from 'react-redux'
import { approve } from 'utils/callHelpers'
import { useCartographer } from './useContract'
import useToast from './useToast'
import { fetchTokensUserDataAsync } from 'state/tokens'

// Approve a Farm
export const useApprove = (lpContract: Contract, tokenName: string) => {
  const dispatch = useDispatch()
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { account }: { account: string } = useWallet()
  const cartographer = useCartographer()

  const handleApprove = useCallback(async () => {
    try {
      setPending(true)
      await approve(lpContract, cartographer, account)
      toastSuccess(`${tokenName} Approved`)
    } catch (error) {
      toastError(`${tokenName} Approval Failed`, (error as Error).message)
    } finally {
      setPending(false)
      dispatch(fetchTokensUserDataAsync(account))
    }
  }, [account, dispatch, lpContract, cartographer, setPending, toastSuccess, toastError, tokenName])

  return { onApprove: handleApprove, pending }
}
