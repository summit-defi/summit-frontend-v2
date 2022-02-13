import { useCallback, useState } from 'react'
import { getV1SummitTokenAddress, tokenSwapV1Summit, approve, getSummitTokenAddress } from 'utils'
import { useSummitToken, useV1SummitToken } from './useContract'
import useToast from './useToast'
import { useV1SummitTokenApproved, useV1SummitTokenBalance } from './useV1SummitToken'


export const useTokenSwapV1Summit = () => {
  const summitAddress = getSummitTokenAddress()
  const summitToken = useSummitToken()
  const [approvePending, setApprovePending] = useState(false)
  const [swapPending, setSwapPending] = useState(false)
  const { toastSuccess, toastError } = useToast()

  const v1SummitAddress = getV1SummitTokenAddress()
  const v1SummitContract = useV1SummitToken()

  const v1SummitApproved = useV1SummitTokenApproved()
  const v1SummitBalance = useV1SummitTokenBalance()
  const anythingToSwap = v1SummitBalance != null && v1SummitBalance.gt(0)


  const handleApproveSummitV1 = useCallback(async () => {
    try {
      setApprovePending(true)
      await approve(v1SummitContract, summitAddress)
      toastSuccess('SUMMIT V1 Approved')
    } catch (error) {
      toastError('Error Approving SUMMIT V1', (error as Error).message)
    } finally {
      setApprovePending(false)
    }
  }, [
    v1SummitContract,
    summitAddress,
    setApprovePending,
    toastSuccess,
    toastError,
  ])


  const handleTokenSwap = useCallback(async (amount: string) => {
    const filteredAmount = amount || '0'
    try {
      setSwapPending(true)
      await tokenSwapV1Summit(summitToken, filteredAmount)
      toastSuccess('SUMMIT token swap Succeeded')
    } catch (error) {
      toastError('Error in SUMMIT token swap', (error as Error).message)
    } finally {
      setSwapPending(false)
    }
  }, [
    summitToken,
    setSwapPending,
    toastSuccess,
    toastError,
  ])

  return { onApprove: handleApproveSummitV1, onTokenSwap: handleTokenSwap, approvePending, swapPending, v1SummitApproved, v1SummitBalance, anythingToSwap, v2SummitAddress: summitAddress, v1SummitAddress }
}
