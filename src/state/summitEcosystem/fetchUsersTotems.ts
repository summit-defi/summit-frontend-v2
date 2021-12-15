import { getCartographerAddress, retryableMulticall, abi, groupByAndMap } from 'utils/'
import { Elevation, elevationUtils } from 'config/constants/types'

export const fetchUsersTotems = async (account) => {
  const calls = elevationUtils.all.map((elevation) => ({
    address: getCartographerAddress(),
    name: 'userTotem',
    params: [elevationUtils.toInt(elevation), account],
  }))

  const res = await retryableMulticall(abi.cartographer, calls, 'fetchUsersTotems')
  if (res == null) return null

  return groupByAndMap(
    elevationUtils.all,
    (elevation) => elevation,
    (elevation, index) => {
      const [totemLockedIn, totem] = res[index]
      if (elevation === Elevation.OASIS) {
        return {
          totem: 0,
          totemLockedIn: true,
        }
      }
      return {
        totem: totemLockedIn ? totem : JSON.parse(localStorage.getItem(`${account}/${elevation}totem`)),
        totemLockedIn,
      }
    }
  )
}
