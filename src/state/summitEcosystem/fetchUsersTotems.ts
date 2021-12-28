import { retryableMulticall, abi, getSubCartographerAddress } from 'utils/'
import { Elevation, elevationUtils } from 'config/constants/types'

export const fetchUsersTotems = async (account) => {
  const elevCalls = elevationUtils.elevationOnly.map((elevation) => ({
    address: getSubCartographerAddress(elevation),
    name: 'userElevationInfo',
    params: [account],
  }))

  const res = await retryableMulticall(abi.cartographerElevation, elevCalls, 'fetchUserElevationInfo')
  if (res == null) return null

  const usersTotems = {
    [Elevation.OASIS]: {
      totem: 0,
      totemSelected: true,
      totemSelectionRound: 0,
    }
  }

  elevationUtils.elevationOnly.forEach((elevation, index) => {
    const { totemSelected, totem, totemSelectionRound } = res[index]
    usersTotems[elevation] = {
      totem,
      totemSelected,
      totemSelectionRound,
    }
  })

  return usersTotems
}
