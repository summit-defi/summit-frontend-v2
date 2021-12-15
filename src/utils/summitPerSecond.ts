import { useEffect, useState } from 'react'
import useRefresh from 'hooks/useRefresh'
import { retryableMulticall } from './multicall'
import { getCartographerAddress } from './addressHelpers'
import { abi } from './abi'
import BigNumber from 'bignumber.js'

export const useSummitPerSecond = () => {
  const [summitPerSecond, setSummitPerSecond] = useState({
    farm: new BigNumber(0),
    referrals: new BigNumber(0),
    treasury: new BigNumber(0),
  })
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    async function fetchSummitPerSecond() {
      const res = await retryableMulticall(
        abi.cartographer,
        [
          {
            address: getCartographerAddress(),
            name: 'summitPerSecond',
          },
          {
            address: getCartographerAddress(),
            name: 'referralsSummitPerSecond',
          },
          {
            address: getCartographerAddress(),
            name: 'devSummitPerSecond',
          },
        ],
        'useSummitPerSecond',
      )
      if (res == null) return
      const [farm, referrals, treasury] = res
      setSummitPerSecond({
        farm: new BigNumber(farm),
        referrals: new BigNumber(referrals),
        treasury: new BigNumber(treasury),
      })
    }
    fetchSummitPerSecond()
  }, [fastRefresh])

  return summitPerSecond
}
