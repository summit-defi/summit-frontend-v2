import { useCallback, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { getV1SummitTokenAddress, tokenSwapV1Summit, approve, getSummitTokenAddress, getContract } from 'utils'
import { useERC20, useSummitToken } from './useContract'
import useToast from './useToast'
import { provider } from 'web3-core'
import { useV1SummitTokenApproved, useV1SummitTokenBalance } from './useV1SummitToken'


export const useTokenSwapV1Summit = () => {
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const summitAddress = getSummitTokenAddress()
  const summitToken = useSummitToken()
  const [approvePending, setApprovePending] = useState(false)
  const [swapPending, setSwapPending] = useState(false)
  const { toastSuccess, toastError } = useToast()

  const v1SummitAddress = getV1SummitTokenAddress()

  const v1SummitApproved = useV1SummitTokenApproved()
  const v1SummitBalance = useV1SummitTokenBalance()
  const anythingToSwap = v1SummitBalance != null && v1SummitBalance.gt(0)


  const handleApproveSummitV1 = useCallback(async () => {
    try {
      setApprovePending(true)
      const v1SummitToken = getContract(ethereum, v1SummitAddress)
      await approve(v1SummitToken, summitAddress, account)
      toastSuccess('SUMMIT V1 Approved')
    } catch (error) {
      toastError('Error Approving SUMMIT V1', (error as Error).message)
    } finally {
      setApprovePending(false)
    }
  }, [
    account,
    ethereum,
    v1SummitAddress,
    summitAddress,
    setApprovePending,
    toastSuccess,
    toastError,
  ])


  const handleTokenSwap = useCallback(async () => {
    try {
      setSwapPending(true)
      await tokenSwapV1Summit(summitToken, v1SummitBalance.toString(), account)
      toastSuccess('SUMMIT token swap Succeeded')
    } catch (error) {
      toastError('Error in SUMMIT token swap', (error as Error).message)
    } finally {
      setSwapPending(false)
    }
  }, [
    account,
    summitToken,
    v1SummitBalance,
    setSwapPending,
    toastSuccess,
    toastError,
  ])

  return { onApprove: handleApproveSummitV1, onTokenSwap: handleTokenSwap, approvePending, swapPending, v1SummitApproved, v1SummitBalance, anythingToSwap }
}
