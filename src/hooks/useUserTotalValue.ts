import BigNumber from "bignumber.js"
import { Elevation, elevationUtils } from "config/constants/types"
import { useMemo } from "react"
import { useFarms, usePricesPerToken } from "state/hooks"

export const useUserTotalValue = (elevation?: Elevation): BigNumber => {
    const farms = useFarms()
    const pricesPerToken = usePricesPerToken()
  
    return useMemo(
      () => farms
        .reduce((accumValue, farm) => {
            let crossElevSupplyRaw = new BigNumber(0)
            elevationUtils.all
              .filter((elev) => elevation == null ? true : elev === elevation)
              .forEach((elev) => {
                crossElevSupplyRaw = crossElevSupplyRaw.plus(farm.elevations[elev].userData?.stakedBalance || new BigNumber(0))
              })
            return accumValue.plus((crossElevSupplyRaw || new BigNumber(0)).div(new BigNumber(10).pow(farm.decimals || 18)).times(pricesPerToken != null && pricesPerToken[farm.symbol] ? pricesPerToken[farm.symbol] : new BigNumber(1)))
          }, new BigNumber(0)),
      [farms, pricesPerToken, elevation]
    )
  }