import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { getSummitTokenAddress, getSummitTokenContract, getTokenApproved, getTokenBalance, getV1SummitTokenAddress } from 'utils'
import useRefresh from './useRefresh'
import { useSummitToken } from './useContract'

export const useV1SummitTokenBalance = () => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const v1SummitAddress = getV1SummitTokenAddress()

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getTokenBalance(v1SummitAddress, account)
      setBalance(new BigNumber(res))
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
    const paused: boolean = await contract.methods.paused().call()
    localStorage.setItem('SummitSwapEnabled', JSON.stringify(!paused, null, 2))
    return !paused
  } catch (e) {
    return null
  }
}

export const useSummitTokenSwapUnlocked = () => {
  const [swapUnlocked, setSwapUnlocked] = useState(JSON.parse(localStorage.getItem('SummitSwapEnabled') || 'false'))
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