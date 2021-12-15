import BigNumber from 'bignumber.js'
import { abi, getCartographerAddress, retryableMulticall } from 'utils'

export const fetchRolloverRewardInNativeToken = async () => {
  const res = await retryableMulticall(
    abi.cartographer,
    [
      {
        address: getCartographerAddress(),
        name: 'rolloverRewardInNativeToken',
      },
    ],
    'fetchRolloverRewardInNativeToken',
  )
  if (res == null) return null
  const [rolloverRewardInNativeToken] = res
  return new BigNumber(rolloverRewardInNativeToken)
}
