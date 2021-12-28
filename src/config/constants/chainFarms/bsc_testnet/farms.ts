import { MultiElevFarmConfig } from '../../types'
import { expandMultiElevConfig } from '../../expandMultiElevConfig'
import { farmConfigs } from './farmConfigs'
import { NamedChainId } from 'state/types'
import { BscTestnetTokenSymbol, bscTestnetTokens } from './tokens'



const summitFarm: MultiElevFarmConfig = {
  symbol: BscTestnetTokenSymbol.SUMMIT,
  ...farmConfigs[BscTestnetTokenSymbol.SUMMIT],
  ...bscTestnetTokens[BscTestnetTokenSymbol.SUMMIT],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xSUMMIT',
}

const everestFarm: MultiElevFarmConfig = {
  symbol: BscTestnetTokenSymbol.EVEREST,
  ...farmConfigs[BscTestnetTokenSymbol.EVEREST],
  ...bscTestnetTokens[BscTestnetTokenSymbol.EVEREST],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xEVEREST',
}

const cakeFarm: MultiElevFarmConfig = {
  symbol: BscTestnetTokenSymbol.CAKE,
  ...farmConfigs[BscTestnetTokenSymbol.CAKE],
  ...bscTestnetTokens[BscTestnetTokenSymbol.CAKE],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xCAKE',
}

const bifiFarm: MultiElevFarmConfig = {
  symbol: BscTestnetTokenSymbol.BIFI,
  ...farmConfigs[BscTestnetTokenSymbol.BIFI],
  ...bscTestnetTokens[BscTestnetTokenSymbol.BIFI],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xBIFI',
}

const usdcFarm: MultiElevFarmConfig = {
  symbol: BscTestnetTokenSymbol.USDC,
  ...farmConfigs[BscTestnetTokenSymbol.USDC],
  ...bscTestnetTokens[BscTestnetTokenSymbol.USDC],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xUSDC',
}

const gs0Farm: MultiElevFarmConfig = {
  symbol: BscTestnetTokenSymbol.GS0,
  ...farmConfigs[BscTestnetTokenSymbol.GS0],
  ...bscTestnetTokens[BscTestnetTokenSymbol.GS0],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xGS0',
}

const gs1Farm: MultiElevFarmConfig = {
  symbol: BscTestnetTokenSymbol.GS1,
  ...farmConfigs[BscTestnetTokenSymbol.GS1],
  ...bscTestnetTokens[BscTestnetTokenSymbol.GS1],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xGS1',
}

const gs2Farm: MultiElevFarmConfig = {
  symbol: BscTestnetTokenSymbol.GS2,
  ...farmConfigs[BscTestnetTokenSymbol.GS2],
  ...bscTestnetTokens[BscTestnetTokenSymbol.GS2],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xGS2',
}

const gs3Farm: MultiElevFarmConfig = {
  symbol: BscTestnetTokenSymbol.GS3,
  ...farmConfigs[BscTestnetTokenSymbol.GS3],
  ...bscTestnetTokens[BscTestnetTokenSymbol.GS3],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xGS3',
}

const gs4Farm: MultiElevFarmConfig = {
  symbol: BscTestnetTokenSymbol.GS4,
  ...farmConfigs[BscTestnetTokenSymbol.GS4],
  ...bscTestnetTokens[BscTestnetTokenSymbol.GS4],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xGS4',
}

const gs5Farm: MultiElevFarmConfig = {
  symbol: BscTestnetTokenSymbol.GS5,
  ...farmConfigs[BscTestnetTokenSymbol.GS5],
  ...bscTestnetTokens[BscTestnetTokenSymbol.GS5],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xGS5',
}

export const bscTestnetFarms = (chainId) => {
  if (chainId !== NamedChainId.BSC_TESTNET) return []
  return [
    ...expandMultiElevConfig(chainId, summitFarm),
    ...expandMultiElevConfig(chainId, everestFarm),
    ...expandMultiElevConfig(chainId, cakeFarm),
    ...expandMultiElevConfig(chainId, bifiFarm),
    ...expandMultiElevConfig(chainId, usdcFarm),
    ...expandMultiElevConfig(chainId, gs0Farm),
    ...expandMultiElevConfig(chainId, gs1Farm),
    ...expandMultiElevConfig(chainId, gs2Farm),
    ...expandMultiElevConfig(chainId, gs3Farm),
    ...expandMultiElevConfig(chainId, gs4Farm),
    ...expandMultiElevConfig(chainId, gs5Farm),
  ]
}
