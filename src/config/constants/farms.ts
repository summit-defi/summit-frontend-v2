import { ftmFarms } from './chainFarms/ftm/farms'
import { getChainId } from './chainId'
import { FarmConfig } from './types'

const chainFarms: { [key: string]: (chainId) => FarmConfig[] } = {
  56: () => [],
  97: () => [],
  250: ftmFarms,
}

export const getFarmConfigs = () => {
  const chainId = getChainId()
  return chainFarms[chainId](chainId)
}
