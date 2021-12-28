import { bscTestnetFarms } from './chainFarms/bsc_testnet/farms'
import { getChainId } from './chainId'
import { FarmConfig } from './types'

const chainFarms: { [key: string]: (chainId) => FarmConfig[] } = {
  56: () => [],
  97: bscTestnetFarms,
  250: () => [],
}

export const getFarmConfigs = () => {
  const chainId = getChainId()
  return chainFarms[chainId](chainId)
}
