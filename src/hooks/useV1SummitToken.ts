import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import { abi, getSummitTokenAddress, getTokenApproved, getTokenBalance, getV1SummitTokenAddress, retryableMulticall } from 'utils'
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