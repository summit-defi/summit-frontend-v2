import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import { getSummitTokenAddress, getSummitTokenContract, getTokenApproved, getTokenBalance, getV1SummitTokenAddress } from 'utils'
import useRefresh from './useRefresh'

export const useV1SummitTokenBalance = () => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const { fastRefresh } = useRefresh()
  const v1SummitAddress = getV1SummitTokenAddress()

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getTokenBalance(ethereum, v1SummitAddress, account)
      setBalance(new BigNumber(res))
    }

    if (account && ethereum) {
      fetchBalance()
    }
  }, [account, ethereum, v1SummitAddress, fastRefresh])

  return balance
}

export const useV1SummitTokenApproved = () => {
  const [approved, setApproved] = useState(false)
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const { fastRefresh } = useRefresh()
  const v1SummitAddress = getV1SummitTokenAddress()
  const summitAddress = getSummitTokenAddress()

  useEffect(() => {
    const fetchApproved = async () => {
      const res = await getTokenApproved(ethereum, v1SummitAddress, account, summitAddress)
      setApproved(res)
    }

    if (account && ethereum) {
      fetchApproved()
    }
  }, [account, ethereum, v1SummitAddress, summitAddress, fastRefresh])

  return approved
}

const getSummitSwapUnlocked = async (
  ethereum: provider,
  tokenAddress: string,
): Promise<boolean> => {
  const contract = getSummitTokenContract(ethereum, tokenAddress)
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
  const { ethereum }: { ethereum: provider } = useWallet()

  useEffect(() => {
    const fetchSwapUnlocked = async () => {
      const unlocked = await getSummitSwapUnlocked(ethereum, summitAddress)
      if (unlocked != null) {
        setSwapUnlocked(unlocked)
      }
    }

    fetchSwapUnlocked()
  }, [fastRefresh, setSwapUnlocked, ethereum, summitAddress])

  return swapUnlocked
}