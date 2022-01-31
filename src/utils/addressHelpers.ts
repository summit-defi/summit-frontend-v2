import addresses from 'config/constants/contracts'
import { Elevation } from 'config/constants/types'

const getChainId = () => {
  return JSON.parse(localStorage.getItem('ChainId')) || '97'
}

export const getSummitTokenAddress = () => {
  const chainId = getChainId()
  return addresses.summitToken[chainId]
}
export const getV1SummitTokenAddress = () => {
  const chainId = getChainId()
  return addresses.oldSummitToken[chainId]
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
export const getCartographerPlainsAddress = () => {
  const chainId = getChainId()
  return addresses.cartographerPlains[chainId]
}
export const getCartographerMesaAddress = () => {
  const chainId = getChainId()
  return addresses.cartographerMesa[chainId]
}
export const getCartographerSummitAddress = () => {
  const chainId = getChainId()
  return addresses.cartographerSummit[chainId]
}
export const getSubCartographerAddress = (elevation: Elevation) => {
  const chainId = getChainId()
  switch (elevation) {
    case Elevation.OASIS: return addresses.cartographerOasis[chainId]
    case Elevation.PLAINS: return addresses.cartographerPlains[chainId]
    case Elevation.MESA: return addresses.cartographerMesa[chainId]
    case Elevation.SUMMIT: return addresses.cartographerSummit[chainId]
    default: return ''
  }
}
export const getExpeditionAddress = () => {
  const chainId = getChainId()
  return addresses.expedition[chainId]
}
export const getElevationHelperAddress = () => {
  const chainId = getChainId()
  return addresses.elevationHelper[chainId]
}
export const getSummitGlacierAddress = () => {
  const chainId = getChainId()
  return addresses.summitGlacier[chainId]
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
