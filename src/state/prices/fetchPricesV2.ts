import BigNumber from 'bignumber.js'
import { getPriceableTokens } from 'config/constants'
import { TokenAssetType, PriceableToken } from 'state/types'
import {
  retryableMulticall,
  abi,
  getNativePeggedLpAddress,
  getWrappedNativeTokenAddress,
  getPeggedTokenAddress,
  chunkArray,
  groupByAndMap,
  getBalancer2PoolPriceOracleAddress,
  getBalancerMultiPoolPriceOracleAddress,
} from 'utils'

export const fetchPricesV2 = async () => {
  const nativePeggedLpAddress = getNativePeggedLpAddress()
  const nativeAddress = getWrappedNativeTokenAddress()
  const peggedAddress = getPeggedTokenAddress()
  const priceableTokens = getPriceableTokens()
  const balancer2PoolPriceOracleAddress = getBalancer2PoolPriceOracleAddress()
  const balancerMultiPoolPriceOracleAddress = getBalancerMultiPoolPriceOracleAddress()
  const erc20Res = await retryableMulticall(
    abi.ERC20,
    [
      {
        address: nativeAddress,
        name: 'balanceOf',
        params: [nativePeggedLpAddress],
      },
      {
        address: peggedAddress,
        name: 'balanceOf',
        params: [nativePeggedLpAddress],
      },
      {
        address: nativeAddress,
        name: 'decimals',
      },
      {
        address: peggedAddress,
        name: 'decimals',
      },
    ],
    'fetchPricesV2',
  )

  if (erc20Res == null) return null

  const [
    nativeBalanceInNativeStableLp,
    peggedBalanceInNativeStableLp,
    nativeDecimals,
    peggedDecimals,
  ] = erc20Res

  const nativeAmount = new BigNumber(nativeBalanceInNativeStableLp).div(new BigNumber(10).pow(nativeDecimals))
  const peggedAmount = new BigNumber(peggedBalanceInNativeStableLp).div(new BigNumber(10).pow(peggedDecimals))

  const nativePrice = peggedAmount.div(nativeAmount)




  const {
    [TokenAssetType.SingleAsset]: singleAssetPriceables,
    [TokenAssetType.LP]: lpPriceables,
    [TokenAssetType.Stablecoin]: stablecoinPriceables,
    [TokenAssetType.WrappedNative]: wrappedNativePriceables,
    [TokenAssetType.Balancer2Pool]: balancer2PoolPriceables,
    [TokenAssetType.BalancerMultiPool]: balancerMultiPoolPriceables,
  } = priceableTokens.reduce((acc, priceableToken) => {
    acc[priceableToken.assetType].push(priceableToken)
    return acc
  }, {
    [TokenAssetType.SingleAsset]: [] as PriceableToken[],
    [TokenAssetType.LP]: [] as PriceableToken[],
    [TokenAssetType.Stablecoin]: [] as PriceableToken[],
    [TokenAssetType.WrappedNative]: [] as PriceableToken[],
    [TokenAssetType.Balancer2Pool]: [] as PriceableToken[],
    [TokenAssetType.BalancerMultiPool]: [] as PriceableToken[],
  })

  // SINGLE ASSETS AND LPS
  const fetchableTokens: PriceableToken[] = [...singleAssetPriceables, ...lpPriceables]
  const fetchableCalls = fetchableTokens.map((fetchableToken) => [
    {
      address: fetchableToken.tokenAddress || fetchableToken.lpAddress,
      name: 'balanceOf',
      params: [fetchableToken.lpAddress],
    },
    {
      address: nativeAddress,
      name: 'balanceOf',
      params: [fetchableToken.lpAddress],
    },
    {
      address: fetchableToken.lpAddress,
      name: 'totalSupply',
    },
    {
      address: fetchableToken.tokenAddress || fetchableToken.lpAddress,
      name: 'decimals',
    },
  ])
  const priceableRes = await retryableMulticall(abi.ERC20, fetchableCalls.flat(), 'fetchPricesV2FetchTokenInfo')

  const priceableResChunks = chunkArray(4, priceableRes)

  const fetchablePricesPerToken = groupByAndMap(
    priceableResChunks,
    (_, index) => fetchableTokens[index].symbol,
    (_, index) => {
    const fetchableToken = fetchableTokens[index]
    const [
      tokenBalanceInLp,
      nativeBalanceInLp,
      lpTotalSupply,
      tokenDecimals,
    ]: any[] = priceableResChunks[index]

    if (fetchableToken.assetType === TokenAssetType.LP) {
      // LP
      const fullNativeAmountInLp = new BigNumber(nativeBalanceInLp).times(2)
      const fullValueInLp = nativePrice.times(fullNativeAmountInLp)
      return fullValueInLp.div(new BigNumber(lpTotalSupply))
    }
    // SINGLE ASSET
    const nativeBalanceInLpDecCorrected = new BigNumber(nativeBalanceInLp).div(new BigNumber(10).pow(18))
    const tokenBalanceInLpDecCorrected = new BigNumber(tokenBalanceInLp).div(new BigNumber(10).pow(tokenDecimals))
    const tokenPriceVsNative = nativeBalanceInLpDecCorrected.div(tokenBalanceInLpDecCorrected)
    return nativePrice.times(tokenPriceVsNative)
  })


  // STABLE COINS
  const stableCoinPricesPerToken = groupByAndMap(
    stablecoinPriceables,
    (_, index) => stablecoinPriceables[index].symbol,
    (_) => new BigNumber(1),
  )

  // WRAPPED NATIVE
  const wrappedNativePricesPerToken = groupByAndMap(
    wrappedNativePriceables,
    (_, index) => wrappedNativePriceables[index].symbol,
    (_) => nativePrice,
  )

  let pricesPerToken = {
    ...fetchablePricesPerToken,
    ...stableCoinPricesPerToken,
    ...wrappedNativePricesPerToken,
  }



  // BALANCER 2 POOL
  const balancer2PoolPriceOracleCalls = balancer2PoolPriceables.map((balancer2PoolToken) => [
    {
      address: balancer2PoolPriceOracleAddress,
      name: 'calculateAssetPrice',
      params: [balancer2PoolToken.lpAddress],
    },
  ])
  const balancer2PoolPriceablesRes = await retryableMulticall(abi.Balancer2PoolPriceOracle, balancer2PoolPriceOracleCalls.flat(), 'fetchPricesV2Balancer2Pool')

  const balancer2PoolPricesPerToken = groupByAndMap(
    balancer2PoolPriceables,
    (_, index) => balancer2PoolPriceables[index].symbol,
    (_, index) => new BigNumber(balancer2PoolPriceablesRes[index]).div(new BigNumber(10).pow(18)),
  )

  

  // BALANCER MULTI POOL
  const balancerMultiPoolPriceOracleCalls = balancerMultiPoolPriceables.map((balancerMultiPoolToken) => [
    {
      address: balancerMultiPoolPriceOracleAddress,
      name: 'getPoolTokens',
      params: [balancerMultiPoolToken.balancerMultiPoolPid!],
    },
  ])
  const balancerMultiPoolPriceablesRes = await retryableMulticall(abi.BalancerMultiPoolPriceOracle, balancerMultiPoolPriceOracleCalls.flat(), 'fetchPricesV2BalancerMultiPoolTokens')

  const balancerMultiPoolTokenSuppliesCalls = balancerMultiPoolPriceables.map((balancerMultiPoolToken) => [
    {
      address: balancerMultiPoolToken.lpAddress,
      name: 'totalSupply',
    },
  ])
  const balancerMultiPoolTokenSuppliesRes = await retryableMulticall(abi.ERC20, balancerMultiPoolTokenSuppliesCalls.flat(), 'fetchPricesV2BalancerMultiPoolSupply')

  const balancerMultiPoolPricesPerToken = groupByAndMap(
    balancerMultiPoolPriceables,
    (_, index) => balancerMultiPoolPriceables[index].symbol,
    (balancerMultiPoolPriceable, index) => {
      const containingTokenValue = balancerMultiPoolPriceablesRes[index][1]
        .map((containingTokenBalance) => new BigNumber(containingTokenBalance._hex))
        .map((containingTokenBalance, containingTokenIndex) => {
          const containedTokenSymbol = balancerMultiPoolPriceable.containingTokens[containingTokenIndex]
          const containedToken = priceableTokens.find((token) => token.symbol === containedTokenSymbol)
          return new BigNumber(containingTokenBalance.div(new BigNumber(10).pow(containedToken.decimals)).times(pricesPerToken[containedTokenSymbol]))
        })
        .reduce((acc, containedTokenValue) => acc.plus(containedTokenValue), new BigNumber(0))

      const tokenSupply = new BigNumber(balancerMultiPoolTokenSuppliesRes[index]).div(new BigNumber(10).pow(18))
      return containingTokenValue.div(tokenSupply)
    },
  )

  pricesPerToken = {
    ...pricesPerToken,
    ...balancer2PoolPricesPerToken,
    ...balancerMultiPoolPricesPerToken
  }

  const pricesPerTokenDisplay = groupByAndMap(
    Object.keys(pricesPerToken),
    (symbol) => symbol,
    (symbol) => pricesPerToken[symbol].toNumber(),
  )

  return pricesPerToken
}
