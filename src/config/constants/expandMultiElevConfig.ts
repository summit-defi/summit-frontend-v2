import addresses from './contracts'
import { MultiElevFarmConfig, FarmConfig, elevationUtils, Elevation } from './types'

const replaceSummitAddresses = (tokenAddress: string, summitAddress: string, summitLpAddress: string): string => {
  if (tokenAddress === '0xSUMMIT') return summitAddress
  if (tokenAddress === '0xSUMMITLP') return summitLpAddress
  return tokenAddress
}

export const expandMultiElevConfig = (chainId: string, config: MultiElevFarmConfig): FarmConfig[] => {
  const { getUrl, elevationsExistAndLive, tokenAddress, lpAddress, allocation, ...farmConfig } = config
  const summitAddress = addresses.summitToken[chainId]
  const summitLpAddress = addresses.summitLpToken[chainId]
  const trueTokenAddress = replaceSummitAddresses(tokenAddress, summitAddress, summitLpAddress)
  const trueLpAddress = replaceSummitAddresses(lpAddress, summitAddress, summitLpAddress)
  const trueGetUrl = getUrl.replace('0xSUMMIT', summitAddress)
  return Object.entries(elevationsExistAndLive)
    .filter(([_, { exists }]) => exists)
    .map(([elevation, { live }]) => {
      const trueFarmWarning = config.farmWarning == null ? null : typeof config.farmWarning === 'string' ? config.farmWarning : config.farmWarning[elevation]
      const trueFarmComment = config.farmComment == null ? null : typeof config.farmComment === 'string' ? config.farmComment : config.farmComment[elevation]
      return {
        elevation: elevation as Elevation,
        allocation: allocation * elevationUtils.allocMultiplier(elevation as Elevation),
        tokenAddress: trueTokenAddress,
        lpAddress: trueLpAddress,
        live,
        ...farmConfig,
        getUrl: trueGetUrl,
        farmWarning: trueFarmWarning,
        farmComment: trueFarmComment,
      }
    })
}
