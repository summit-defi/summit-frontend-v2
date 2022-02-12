import { MultiElevFarmConfig } from '../../types'
import { expandMultiElevConfig, multiElevConfigTokenInfo } from '../../expandMultiElevConfig'
import { farmConfigs } from './farmConfigs'
import { NamedChainId, UserTokenData } from 'state/types'
import { ftmTokens } from './tokens'
import { TokenSymbol } from 'config/constants/tokenSymbols'



const summitFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.SUMMIT,
  ...farmConfigs[TokenSymbol.SUMMIT],
  ...ftmTokens[TokenSymbol.SUMMIT],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xSUMMIT',
}

const everestFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.EVEREST,
  ...farmConfigs[TokenSymbol.EVEREST],
  ...ftmTokens[TokenSymbol.EVEREST],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xEVEREST',
}

const tombFtmFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.TOMB_FTM,
  ...farmConfigs[TokenSymbol.TOMB_FTM],
  ...ftmTokens[TokenSymbol.TOMB_FTM],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xCAKE',
}

const tshareFtmFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.TSHARE_FTM,
  ...farmConfigs[TokenSymbol.TSHARE_FTM],
  ...ftmTokens[TokenSymbol.TSHARE_FTM],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xCAKE',
}

const ftmBooFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.FTM_BOO,
  ...farmConfigs[TokenSymbol.FTM_BOO],
  ...ftmTokens[TokenSymbol.FTM_BOO],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xCAKE',
}

const fidelioDuettoFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.BPT_BEETS_FTM,
  name: 'Fidelio Duetto',
  ...farmConfigs[TokenSymbol.BPT_BEETS_FTM],
  ...ftmTokens[TokenSymbol.BPT_BEETS_FTM],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xCAKE',
}

const fantomOfTheOperaFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.FANTOM_OF_THE_OPERA,
  name: 'Fantom of the Opera',
  ...farmConfigs[TokenSymbol.FANTOM_OF_THE_OPERA],
  ...ftmTokens[TokenSymbol.FANTOM_OF_THE_OPERA],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xCAKE',
}

const grandOrchestraFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.GRAND_ORCH,
  name: 'The Grand Orchestra',
  ...farmConfigs[TokenSymbol.GRAND_ORCH],
  ...ftmTokens[TokenSymbol.GRAND_ORCH],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xCAKE',
}

const battleOfTheBandsFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.BATTLE_OF_THE_BANDS,
  name: 'Battle of the Bands',
  ...farmConfigs[TokenSymbol.BATTLE_OF_THE_BANDS],
  ...ftmTokens[TokenSymbol.BATTLE_OF_THE_BANDS],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xCAKE',
}

const twoSharesFtmFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol['2SHARES_FTM'],
  ...farmConfigs[TokenSymbol['2SHARES_FTM']],
  ...ftmTokens[TokenSymbol['2SHARES_FTM']],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xCAKE',
}

const twOmbFtmFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol['2OMB_FTM'],
  ...farmConfigs[TokenSymbol['2OMB_FTM']],
  ...ftmTokens[TokenSymbol['2OMB_FTM']],
  getUrl: 'https://app.beethovenx.io/#/pool/0xcde5a11a4acb4ee4c805352cec57e236bdbc3837000200000000000000000019',
}

const farms = [
  summitFarm,
  everestFarm,
  tombFtmFarm,
  tshareFtmFarm,
  ftmBooFarm,
  fidelioDuettoFarm,
  fantomOfTheOperaFarm,
  // grandOrchestraFarm,
  battleOfTheBandsFarm,
  twoSharesFtmFarm,
  twOmbFtmFarm,
]

export const ftmFarms = (chainId) => {
  if (chainId !== NamedChainId.FTM) return []
  return farms.map((farm) => expandMultiElevConfig(chainId, farm)).flat()
}

export const ftmFarmTokens = (chainId): UserTokenData[] => {
  if (chainId !== NamedChainId.FTM) return []
  return farms.map(((farm) => multiElevConfigTokenInfo(chainId, farm)))
}
