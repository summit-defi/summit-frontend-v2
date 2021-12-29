import { useEffect, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { abi, getSubCartographerAddress, groupByAndMap, retryableMulticall } from 'utils/'
import useRefresh from './useRefresh'
import BigNumber from 'bignumber.js'
import { useFarmConfigs } from 'state/hooks'
import { elevationUtils } from 'config/constants'

export const useAllElevsClaimable = () => {
  const [earnedAndVesting, setEarnedAndVesting] = useState<Map<string | number, BigNumber>>(null)
  const { account }: { account: string } = useWallet()
  const { fastRefresh } = useRefresh()
  const farmConfigs = useFarmConfigs()

  useEffect(() => {
    const fetchAllElevsClaimable = async () => {
      const calls = elevationUtils.all.map((elevation) => ({
        address: getSubCartographerAddress(elevation),
        name: 'elevClaimableRewards',
        params: [account],
      }))

      const res = await retryableMulticall(abi.cartographer, calls, 'useAllElevsClaimable')
      if (res == null) return

      setEarnedAndVesting(
        groupByAndMap(
          elevationUtils.all,
          (elevation) => elevation,
          (_, index) => new BigNumber(res[index]._hex),
        ),
      )
    }

    if (account) {
      fetchAllElevsClaimable()
    }
  }, [account, fastRefresh, farmConfigs])

  return earnedAndVesting
}
