import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import { getTokenBalance } from 'utils/erc20'
import { abi, getSummitTokenAddress, retryableMulticall } from 'utils'
import useRefresh from './useRefresh'

const useSummitTokenBalance = () => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const { fastRefresh } = useRefresh()
  const summitAddress = getSummitTokenAddress()

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getTokenBalance(ethereum, summitAddress, account)
      setBalance(new BigNumber(res))
    }

    if (account && ethereum) {
      fetchBalance()
    }
  }, [account, ethereum, summitAddress, fastRefresh])

  return balance
}

export const useTotalSummitSupply = () => {
  const { slowRefresh } = useRefresh()
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const summitAddress = getSummitTokenAddress()

  useEffect(() => {
    async function fetchTotalSupply() {
      const res = await retryableMulticall(
        abi.ERC20,
        [
          {
            address: summitAddress,
            name: 'totalSupply',
          },
        ],
        'useTotalSummitSupply',
      )
      if (res == null) return
      const [[supply]] = res
      setTotalSupply(new BigNumber(supply._hex))
    }

    fetchTotalSupply()
  }, [slowRefresh, summitAddress])

  return totalSupply
}

export const useBurnedSummitBalance = () => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { slowRefresh } = useRefresh()
  const summitAddress = getSummitTokenAddress()

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await retryableMulticall(
        abi.ERC20,
        [
          {
            address: summitAddress,
            name: 'balanceOf',
            params: ['0x000000000000000000000000000000000000dEaD'],
          },
        ],
        'fetchBalance',
      )
      if (res == null) return
      const [[bal]] = res
      setBalance(new BigNumber(bal._hex))
    }

    fetchBalance()
  }, [summitAddress, slowRefresh])

  return balance
}

export default useSummitTokenBalance
