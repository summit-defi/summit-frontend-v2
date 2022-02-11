import { bscTestnetFarms, bscTestnetFarmTokens } from './chainFarms/bsc_testnet/farms'
import { FarmConfig } from './types'
import memoize from 'fast-memoize'
import { UserTokenData } from 'state/types'
import { CHAIN_ID } from './networks'

const chainFarms: { [key: string]: (chainId) => FarmConfig[] } = {
  56: () => [],
  97: bscTestnetFarms,
  250: () => [],
}

const getFarmConfigsMemoizable = () => {
  return chainFarms[CHAIN_ID](CHAIN_ID)
}

export const getFarmConfigs = memoize(getFarmConfigsMemoizable)

const chainFarmTokens: { [key: string]: (chainId) => UserTokenData[] } = {
  56: () => [],
  97: bscTestnetFarmTokens,
  250: () => [],
}

const getFarmTokensMemoizable = () => {
  return chainFarmTokens[CHAIN_ID](CHAIN_ID)
}

export const getFarmTokens = memoize(getFarmTokensMemoizable)
