import { ftmExpeditions } from './chainFarms/ftm/expeditions'
import { getChainId } from './chainId'
import { ExpeditionConfig } from './types'

const chainExpeditions: { [key: string]: (chainId: string) => ExpeditionConfig[] } = {
  56: () => [],
  97: () => [],
  250: ftmExpeditions,
}

export const getExpeditionConfigs = () => {
  const chainId = getChainId()
  return chainExpeditions[chainId](chainId)
}
