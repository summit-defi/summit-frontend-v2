import { useCallback, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'
import { useDispatch } from 'react-redux'
import { approve } from 'utils/callHelpers'
import { useCartographer } from './useContract'
import useToast from './useToast'
import { fetchTokensUserDataAsync } from 'state/tokens'
import { fetchEverestDataAsync } from 'state/everest'

// Approve a Farm
export const useApprove = (lpContract: Contract, tokenName: string) => {
  const dispatch = useDispatch()
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { account } = useWeb3React()
  const cartographer = useCartographer()

  const handleApprove = useCallback(async () => {
    try {
      setPending(true)
      await approve(lpContract, cartographer.options.address, account)
      toastSuccess(`${tokenName} Approved`)
    } catch (error) {
      toastError(`${tokenName} Approval Failed`, (error as Error).message)
    } finally {
      setPending(false)
      dispatch(fetchTokensUserDataAsync(account))
      dispatch(fetchEverestDataAsync(account))
    }
  }, [account, dispatch, lpContract, cartographer, setPending, toastSuccess, toastError, tokenName])

  return { onApprove: handleApprove, pending }
}

// Approve a Farm
export const useApproveAddress = (lpContract: Contract, spender: string, tokenName: string) => {
  const dispatch = useDispatch()
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { account } = useWeb3React()

  const handleApprove = useCallback(async () => {
    try {
      setPending(true)
      await approve(lpContract, spender, account)
      toastSuccess(`${tokenName} Approved`)
    } catch (error) {
      toastError(`${tokenName} Approval Failed`, (error as Error).message)
    } finally {
      setPending(false)
      dispatch(fetchTokensUserDataAsync(account))
      dispatch(fetchEverestDataAsync(account))
    }
  }, [account, dispatch, lpContract, spender, setPending, toastSuccess, toastError, tokenName])

  return { onApprove: handleApprove, pending }
}
