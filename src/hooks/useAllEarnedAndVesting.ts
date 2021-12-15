import { useEffect, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { abi, getCartographerAddress, groupByAndMap, retryableMulticall } from 'utils/'
import useRefresh from './useRefresh'
import BigNumber from 'bignumber.js'
import { useFarmConfigs } from 'state/hooks'

interface EarnedAndVestingData {
  earned: BigNumber
  vesting: BigNumber
}

export const useAllEarnedAndVesting = () => {
  const [earnedAndVesting, setEarnedAndVesting] = useState<Map<string | number, EarnedAndVestingData>>(null)
  const { account }: { account: string } = useWallet()
  const { fastRefresh } = useRefresh()
  const farmConfigs = useFarmConfigs()

  useEffect(() => {
    const fetchAllEarnedAndVesting = async () => {
      const calls = farmConfigs.map((farm) => ({
        address: getCartographerAddress(),
        name: 'rewards',
        params: [farm.pid, account],
      }))

      const res = await retryableMulticall(abi.cartographer, calls, 'useAllEarnedAndVesting')
      if (res == null) return

      setEarnedAndVesting(
        groupByAndMap(
          farmConfigs,
          (farm) => farm.pid,
          (_, index) => ({
            earned: new BigNumber(res[index][0]._hex),
            vesting: new BigNumber(res[index][1]._hex),
          }),
        ),
      )
    }

    if (account) {
      fetchAllEarnedAndVesting()
    }
  }, [account, fastRefresh, farmConfigs])

  return earnedAndVesting
}
