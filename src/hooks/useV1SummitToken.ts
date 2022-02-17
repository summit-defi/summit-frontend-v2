import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { getSummitTokenAddress, getSummitTokenContract, getTokenApproved, getTokenBalance, getV1SummitTokenAddress, parseJSON } from 'utils'
import useRefresh from './useRefresh'
import { BN_ZERO } from 'config/constants'

export const useV1SummitTokenBalance = () => {
  const [balance, setBalance] = useState(BN_ZERO)
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const v1SummitAddress = getV1SummitTokenAddress()

  useEffect(() => {
    const fetchBalance = async () => {
      const bal = await getTokenBalance(v1SummitAddress, account)
      setBalance(bal)
    }

    if (account) {
      fetchBalance()
    }
  }, [account, v1SummitAddress, fastRefresh])

  return balance
}

export const useV1SummitTokenApproved = () => {
  const [approved, setApproved] = useState(false)
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const v1SummitAddress = getV1SummitTokenAddress()
  const summitAddress = getSummitTokenAddress()

  useEffect(() => {
    const fetchApproved = async () => {
      const res = await getTokenApproved(v1SummitAddress, account, summitAddress)
      setApproved(res)
    }

    if (account) {
      fetchApproved()
    }
  }, [account, v1SummitAddress, summitAddress, fastRefresh])

  return approved
}

const getSummitSwapUnlocked = async (): Promise<boolean> => {
  const contract = getSummitTokenContract()
  try {
    const paused: boolean = await contract.paused()
    localStorage.setItem('SummitSwapEnabled', JSON.stringify(!paused, null, 2))
    return !paused
  } catch (e) {
    return null
  }
}

export const useSummitTokenSwapUnlocked = () => {
  const [swapUnlocked, setSwapUnlocked] = useState(parseJSON(localStorage.getItem('SummitSwapEnabled'), false))
  const summitAddress = getSummitTokenAddress()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchSwapUnlocked = async () => {
      const unlocked = await getSummitSwapUnlocked()
      if (unlocked != null) {
        setSwapUnlocked(unlocked)
      }
    }

    fetchSwapUnlocked()
  }, [fastRefresh, setSwapUnlocked, summitAddress])

  return swapUnlocked
}