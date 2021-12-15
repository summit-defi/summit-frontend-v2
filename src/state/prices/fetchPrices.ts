import BigNumber from 'bignumber.js'
import {
  retryableMulticall,
  abi,
  getNativePeggedLpAddress,
  getWrappedNativeTokenAddress,
  getPeggedTokenAddress,
  getCartographerExpeditionAddress,
  getSummitTokenAddress,
  getSummitLpAddress,
} from 'utils'

export const fetchPrices = async () => {
  const nativePeggedLpAddress = getNativePeggedLpAddress()
  const nativeAddress = getWrappedNativeTokenAddress()
  const peggedAddress = getPeggedTokenAddress()
  const summitAddress = getSummitTokenAddress()
  const summitLpAddress = getSummitLpAddress()
  const [bep20Res, cartExpedRes] = await Promise.all([
    await retryableMulticall(
      abi.BEP20,
      [
        // NATIVE TOKEN PRICE
        // Balance of token in the LP contract
        {
          address: nativeAddress,
          name: 'balanceOf',
          params: [nativePeggedLpAddress],
        },
        // Balance of quote token in LP contract
        {
          address: peggedAddress,
          name: 'balanceOf',
          params: [nativePeggedLpAddress],
        },
        // Native decimals
        {
          address: nativeAddress,
          name: 'decimals',
        },
        // Pegged decimals
        {
          address: peggedAddress,
          name: 'decimals',
        },

        // SUMMIT PRICE IN NATIVE TOKEN
        // Balance of Summit in LP contract
        {
          address: summitAddress,
          name: 'balanceOf',
          params: [summitLpAddress],
        },
        // Balance of native token in LP contract
        {
          address: nativeAddress,
          name: 'balanceOf',
          params: [summitLpAddress],
        },

        // TOTAL SUPPLY OF SUMMIT LP
        {
          address: summitLpAddress,
          name: 'totalSupply',
        },
      ],
      'fetchPrices',
    ),
    await retryableMulticall(
      abi.cartographerExpedition,
      [
        {
          address: getCartographerExpeditionAddress(),
          name: 'summitInLpIncentiveMultiplier',
        },
      ],
      'fetchPrices',
    ),
  ])

  if (bep20Res == null || cartExpedRes == null) return null

  const [
    nativeBalanceInLp,
    peggedBalanceInLp,
    nativeDecimals,
    peggedDecimals,
    summitBalanceInSummitLp,
    nativeBalanceInSummitLp,
    summitLpTotalSupply,
  ] = bep20Res
  const [rawSummitInLpIncentiveMultiplier] = cartExpedRes

  const nativeAmount = new BigNumber(nativeBalanceInLp).div(new BigNumber(10).pow(nativeDecimals))
  const peggedAmount = new BigNumber(peggedBalanceInLp).div(new BigNumber(10).pow(peggedDecimals))

  const nativePrice = peggedAmount.div(nativeAmount)

  const summitInLpAmount = (new BigNumber(summitBalanceInSummitLp).isGreaterThan(0)
    ? new BigNumber(summitBalanceInSummitLp)
    : new BigNumber(2)
  ).div(new BigNumber(10).pow(18))
  const nativeInSummitLpAmount = (new BigNumber(nativeBalanceInSummitLp).isGreaterThan(0)
    ? new BigNumber(nativeBalanceInSummitLp)
    : new BigNumber(1)
  ).div(new BigNumber(10).pow(new BigNumber(nativeDecimals).toNumber()))

  const summitPrice = nativeInSummitLpAmount.times(nativePrice).div(summitInLpAmount)

  const summitInLpIncentiveMultiplier = new BigNumber(rawSummitInLpIncentiveMultiplier)

  const expedSummitInLpMultiplier = new BigNumber(summitBalanceInSummitLp)
    .times(summitInLpIncentiveMultiplier)
    .div(100)
    .div(new BigNumber(summitLpTotalSupply))

  return { nativePrice, summitPrice, summitInLpIncentiveMultiplier, expedSummitInLpMultiplier }
}
