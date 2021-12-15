import BigNumber from "bignumber.js"
import { Elevation } from "config/constants/types"
import { useMemo } from "react"
import { useFarms, usePricesPerToken } from "state/hooks"

export const useUserTotalValue = (elevation?: Elevation): BigNumber => {
    const farms = useFarms()
    const pricesPerToken = usePricesPerToken()
  
    return useMemo(
      () => farms
        .filter((farm) => elevation == null ? true : farm.elevation === elevation)
        .reduce((accumValue, farm) => {
            return accumValue.plus((farm.userData?.stakedBalance || new BigNumber(0)).times(pricesPerToken != null && pricesPerToken[farm.symbol] ? pricesPerToken[farm.symbol] : new BigNumber(1)))
        }, new BigNumber(0)),
      [farms, pricesPerToken, elevation]
    )
  }