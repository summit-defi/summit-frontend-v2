import { bscTestnetFarms, bscTestnetFarmTokens } from './chainFarms/bsc_testnet/farms'
import { getChainId } from './chainId'
import { FarmConfig } from './types'
import memoize from 'fast-memoize'
import { UserTokenData } from 'state/types'

const chainFarms: { [key: string]: (chainId) => FarmConfig[] } = {
  56: () => [],
  97: bscTestnetFarms,
  250: () => [],
}

const getFarmConfigsMemoizable = () => {
  const chainId = getChainId()
  return chainFarms[chainId](chainId)
}

export const getFarmConfigs = memoize(getFarmConfigsMemoizable)

const chainFarmTokens: { [key: string]: (chainId) => UserTokenData[] } = {
  56: () => [],
  97: bscTestnetFarmTokens,
  250: () => [],
}

const getFarmTokensMemoizable = () => {
  const chainId = getChainId()
  return chainFarmTokens[chainId](chainId)
}

export const getFarmTokens = memoize(getFarmTokensMemoizable)
