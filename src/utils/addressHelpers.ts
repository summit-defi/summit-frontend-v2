import addresses from 'config/constants/contracts'

const getChainId = () => {
  return JSON.parse(localStorage.getItem('ChainId')) || '250'
}

export const getSummitTokenAddress = () => {
  const chainId = getChainId()
  return addresses.summitToken[chainId]
}
export const getEverestTokenAddress = () => {
  const chainId = getChainId()
  return addresses.everestToken[chainId]
}
export const getSummitLpAddress = () => {
  const chainId = getChainId()
  return addresses.summitLpToken[chainId]
}
export const getCartographerAddress = () => {
  const chainId = getChainId()
  return addresses.cartographer[chainId]
}
export const getCartographerOasisAddress = () => {
  const chainId = getChainId()
  return addresses.cartographerOasis[chainId]
}
export const getCartographerElevationAddress = () => {
  const chainId = getChainId()
  return addresses.cartographerElevation[chainId]
}
export const getExpeditionAddress = () => {
  const chainId = getChainId()
  return addresses.expedition[chainId]
}
export const getElevationHelperAddress = () => {
  const chainId = getChainId()
  return addresses.elevationHelper[chainId]
}
export const getSummitReferralsAddress = () => {
  const chainId = getChainId()
  return addresses.summitReferrals[chainId]
}
export const getSummitLockingAddress = () => {
  const chainId = getChainId()
  return addresses.summitLocking[chainId]
}
export const getMulticallAddress = () => {
  const chainId = getChainId()
  return addresses.multicall[chainId]
}
export const getAmmFactoryAddress = () => {
  const chainId = getChainId()
  return addresses.ammFactory[chainId]
}
export const getAmmRouterAddress = () => {
  const chainId = getChainId()
  return addresses.ammRouter[chainId]
}
export const getWrappedNativeTokenAddress = () => {
  const chainId = getChainId()
  return addresses.wrappedNativeToken[chainId]
}
export const getPeggedTokenAddress = () => {
  const chainId = getChainId()
  return addresses.peggedToken[chainId]
}
export const getNativePeggedLpAddress = () => {
  const chainId = getChainId()
  return addresses.nativePeggedLp[chainId]
}
export const getExpeditionTreasuryAddress = () => {
  const chainId = getChainId()
  return addresses.expeditionTreasury[chainId]
}
export const getBalancer2PoolPriceOracleAddress = () => {
  const chainId = getChainId()
  return addresses.beethoven2PoolOracle[chainId]
}
export const getBalancerMultiPoolPriceOracleAddress = () => {
  const chainId = getChainId()
  return addresses.beethovenMultiPoolOracle[chainId]
}
