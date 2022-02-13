import BigNumber from 'bignumber.js'
import { BN_ZERO, getPriceableTokens, PriceableToken, TokenAssetType, TokenSymbol } from 'config/constants'
import {
  retryableMulticall,
  abi,
  groupByAndMap,
  getBalancer2PoolPriceOracleAddress,
  getBalancerMultiPoolPriceOracleAddress,
  ChainUsesPricingData,
} from 'utils'

export const fetchPricesV2 = async () => {
  const priceableTokensMap = getPriceableTokens()
  const priceableTokens = Object.values(priceableTokensMap)

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
    [TokenAssetType.Summit]: summitPriceable,
    [TokenAssetType.Everest]: everestPriceable,
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
    [TokenAssetType.Summit]: [] as PriceableToken[],
    [TokenAssetType.Everest]: [] as PriceableToken[],
    [TokenAssetType.SingleAsset]: [] as PriceableToken[],
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
  const balancerMultiPoolPriceOracleCalls = [...balancerMultiPoolPriceables, ...summitPriceable].map((balancerMultiPoolToken) => [
    {
      address: balancerMultiPoolPriceOracleAddress,
      name: 'getPoolTokens',
      params: [balancerMultiPoolToken.balancerMultiPoolInfo.poolId],
    },
  ])

  const balancerMultiPoolPriceablesRes = await retryableMulticall(abi.BalancerMultiPoolPriceOracle, balancerMultiPoolPriceOracleCalls.flat(), 'fetchPricesV2BalancerMultiPoolTokens')

  const balancerMultiPoolTokenSuppliesCalls = [...balancerMultiPoolPriceables, ...summitPriceable].map((balancerMultiPoolToken) => [
    {
      address: balancerMultiPoolToken.tokenAddress,
      name: 'totalSupply',
    },
  ])
  const balancerMultiPoolTokenSuppliesRes = await retryableMulticall(abi.ERC20, balancerMultiPoolTokenSuppliesCalls.flat(), 'fetchPricesV2BalancerMultiPoolSupply')

  const balancerMultiPoolPricesPerToken = groupByAndMap(
    [...balancerMultiPoolPriceables, ...summitPriceable],
    (_, index) => [...balancerMultiPoolPriceables, ...summitPriceable][index].symbol,
    (priceable, index) => {

      // SUMMIT TOKEN
      if (priceable.symbol === 'SUMMIT') {
        let summitBalanceInPool
        const containingTokenValue = balancerMultiPoolPriceablesRes[index][1]
          .map((containingTokenBalance) => new BigNumber(containingTokenBalance._hex))
          .map((containingTokenBalance, containingTokenIndex) => {
            const indexToken = balancerMultiPoolPriceablesRes[index][0][containingTokenIndex]
            if (indexToken === priceable.tokenAddress) {
              summitBalanceInPool = containingTokenBalance
              return BN_ZERO
            }
            const indexPriceable = balancerMultiPoolContainedPriceableOptions.find((priceableOption) => priceableOption.tokenAddress.toLowerCase() === indexToken.toLowerCase())
            return new BigNumber(containingTokenBalance.div(new BigNumber(10).pow(indexPriceable.decimals)).times(balancerDirectPricesPerToken[indexPriceable.symbol]))
          })
          .reduce((acc, containedTokenValue) => acc.plus(containedTokenValue), new BigNumber(0))
          .times(new BigNumber(10).pow(18)).dividedBy(0.4).times(0.6)
        return containingTokenValue.dividedBy(summitBalanceInPool)
      }

      // MULTI POOL LP TOKENS
      let combinedWeight = 0
      let combinedVolume = BN_ZERO
      const { pricingTokens } = priceable.balancerMultiPoolInfo
      const pricingTokensList = pricingTokens.map((pricingToken) => pricingToken.token)

      balancerMultiPoolPriceablesRes[index][1]
        .map((containingTokenBalance) => new BigNumber(containingTokenBalance._hex))
        .forEach((containingTokenBalance, containingTokenIndex) => {
          const indexToken = balancerMultiPoolPriceablesRes[index][0][containingTokenIndex]
          const indexPriceable = balancerMultiPoolContainedPriceableOptions.find((priceableOption) => priceableOption.tokenAddress.toLowerCase() === indexToken.toLowerCase())
          const indexTokenPriceableIndex = pricingTokensList.indexOf(indexPriceable.symbol)

          // Exit if token isn't part of pricing calculation
          if (indexTokenPriceableIndex === -1) return

          // Add weight and volume to accumulators
          combinedWeight += pricingTokens[indexTokenPriceableIndex].weight
          const volume = new BigNumber(containingTokenBalance.div(new BigNumber(10).pow(indexPriceable.decimals)).times(balancerDirectPricesPerToken[indexPriceable.symbol]))
          combinedVolume = combinedVolume.plus(volume)
        })

      const tokenSupply = new BigNumber(balancerMultiPoolTokenSuppliesRes[index]).div(new BigNumber(10).pow(18))
      return combinedVolume.times(100).div(combinedWeight).div(tokenSupply).toNumber()
    },
  )

  const everestPricePerToken = {
    [everestPriceable[0].symbol]: balancerMultiPoolPricesPerToken[TokenSymbol.SUMMIT]
  }

  return {
    ...balancerDirectPricesPerToken,
    ...balancerMultiPoolPricesPerToken,
    ...everestPricePerToken,
  }
}
