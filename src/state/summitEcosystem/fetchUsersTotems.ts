import { retryableMulticall, abi, groupByAndMap, getSubCartographerAddress } from 'utils/'
import { Elevation, elevationUtils } from 'config/constants/types'

export const fetchUsersTotems = async (account) => {
  const calls = elevationUtils.elevationOnly.map((elevation) => ({
    address: getSubCartographerAddress(elevation),
    name: 'userElevationInfo',
    params: [account],
  }))

  const res = await retryableMulticall(abi.cartographerElevation, calls, 'fetchUserElevationInfo')
  if (res == null) return null

  return groupByAndMap(
    elevationUtils.all,
    (elevation) => elevation,
    (elevation, index) => {
      const [totemSelected, totem, totemSelectionRound] = res[index]
      if (elevation === Elevation.OASIS) {
        return {
          totem: 0,
          totemSelected: true,
          totemSelectionRound: 0,
        }
      }
      return {
        totem: totemSelected ? totem : JSON.parse(localStorage.getItem(`${account}/${elevation}totem`)),
        totemSelected,
        totemSelectionRound,
      }
    }
  )
}
