import BigNumber from 'bignumber.js'
import { getPriceableTokens, PriceableToken, TokenAssetType } from 'config/constants'
import {
  retryableMulticall,
  abi,
  groupByAndMap,
  getBalancer2PoolPriceOracleAddress,
  getBalancerMultiPoolPriceOracleAddress,
  ChainUsesPricingData,
} from 'utils'

export const fetchPricesV2 = async () => {
  const priceableTokens = Object.values(getPriceableTokens())
    .filter((priceable) => priceable.symbol !== 'SUMMIT' && priceable.symbol !== 'EVEREST')

  if (!ChainUsesPricingData()) {
    return groupByAndMap(
      priceableTokens,
      (token) => token.symbol,
      () => new BigNumber(1.5),
    )
  }

  const balancer2PoolPriceOracleAddress = getBalancer2PoolPriceOracleAddress()
  const balancerMultiPoolPriceOracleAddress = getBalancerMultiPoolPriceOracleAddress()

  const {
    [TokenAssetType.SingleAsset]: singleAssetPriceables,
    [TokenAssetType.Everest]: everestPriceable,
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
    [TokenAssetType.Everest]: [] as PriceableToken[],
    [TokenAssetType.LP]: [] as PriceableToken[],
    [TokenAssetType.Stablecoin]: [] as PriceableToken[],
    [TokenAssetType.WrappedNative]: [] as PriceableToken[],
    [TokenAssetType.Balancer2Pool]: [] as PriceableToken[],
    [TokenAssetType.BalancerMultiPool]: [] as PriceableToken[],
  })

  const balancerDirectPriceables = [
    ...singleAssetPriceables,
    ...lpPriceables,
    ...stablecoinPriceables,
    ...wrappedNativePriceables,
    ...balancer2PoolPriceables,
  ]
  const balancerMultiPoolContainedPriceableOptions = [
    ...singleAssetPriceables,
    ...stablecoinPriceables,
    ...wrappedNativePriceables
  ]

  const balancerDirectCalls = balancerDirectPriceables.map((priceable) => ({
    address: balancer2PoolPriceOracleAddress,
    name: 'calculateAssetPrice',
    params: [priceable.tokenAddress || priceable.lpAddress],
  }))

  const balancerDirectRes = await retryableMulticall(abi.Balancer2PoolPriceOracle, balancerDirectCalls, 'fetchPricesV2BalancerDirect')

  const balancerDirectPricesPerToken = groupByAndMap(
    balancerDirectPriceables,
    (_, index) => balancerDirectPriceables[index].symbol,
    (_, index) => new BigNumber(balancerDirectRes[index]).div(new BigNumber(10).pow(18))
  )

  // BALANCER MULTI POOL
  const balancerMultiPoolPriceOracleCalls = balancerMultiPoolPriceables.map((balancerMultiPoolToken) => [
    {
      address: balancerMultiPoolPriceOracleAddress,
      name: 'getPoolTokens',
      params: [balancerMultiPoolToken.balancerMultiPoolPid],
    },
  ])
  const balancerMultiPoolPriceablesRes = await retryableMulticall(abi.BalancerMultiPoolPriceOracle, balancerMultiPoolPriceOracleCalls.flat(), 'fetchPricesV2BalancerMultiPoolTokens')

  const balancerMultiPoolTokenSuppliesCalls = balancerMultiPoolPriceables.map((balancerMultiPoolToken) => [
    {
      address: balancerMultiPoolToken.tokenAddress,
      name: 'totalSupply',
    },
  ])
  const balancerMultiPoolTokenSuppliesRes = await retryableMulticall(abi.ERC20, balancerMultiPoolTokenSuppliesCalls.flat(), 'fetchPricesV2BalancerMultiPoolSupply')

  const balancerMultiPoolPricesPerToken = groupByAndMap(
    balancerMultiPoolPriceables,
    (_, index) => balancerMultiPoolPriceables[index].symbol,
    (_, index) => {
      const containingTokenValue = balancerMultiPoolPriceablesRes[index][1]
        .map((containingTokenBalance) => new BigNumber(containingTokenBalance._hex))
        .map((containingTokenBalance, containingTokenIndex) => {
          const indexToken = balancerMultiPoolPriceablesRes[index][0][containingTokenIndex]
          const indexPriceable = balancerMultiPoolContainedPriceableOptions.find((priceableOption) => priceableOption.tokenAddress.toLowerCase() === indexToken.toLowerCase())
          return new BigNumber(containingTokenBalance.div(new BigNumber(10).pow(indexPriceable.decimals)).times(balancerDirectPricesPerToken[indexPriceable.symbol]))
        })
        .reduce((acc, containedTokenValue) => acc.plus(containedTokenValue), new BigNumber(0))

      const tokenSupply = new BigNumber(balancerMultiPoolTokenSuppliesRes[index]).div(new BigNumber(10).pow(18))
      return containingTokenValue.div(tokenSupply)
    },
  )



  return {
    ...balancerDirectPricesPerToken,
    ...balancerMultiPoolPricesPerToken,
  }
}
