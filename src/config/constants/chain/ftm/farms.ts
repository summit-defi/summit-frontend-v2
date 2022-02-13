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
  getUrl: 'https://ftm.summitdefi.com/everest',
}

const tombFtmFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.TOMB_FTM,
  ...farmConfigs[TokenSymbol.TOMB_FTM],
  ...ftmTokens[TokenSymbol.TOMB_FTM],
  getUrl: 'https://spookyswap.finance/add/FTM/0x6c021Ae822BEa943b2E66552bDe1D2696a53fbB7',
}

const tshareFtmFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.TSHARE_FTM,
  ...farmConfigs[TokenSymbol.TSHARE_FTM],
  ...ftmTokens[TokenSymbol.TSHARE_FTM],
  getUrl: 'https://spookyswap.finance/add/FTM/0x4cdF39285D7Ca8eB3f090fDA0C069ba5F4145B37',
}

const ftmBooFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.FTM_BOO,
  ...farmConfigs[TokenSymbol.FTM_BOO],
  ...ftmTokens[TokenSymbol.FTM_BOO],
  getUrl: 'https://spookyswap.finance/add/FTM/0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE',
}

const booFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.BOO,
  ...farmConfigs[TokenSymbol.BOO],
  ...ftmTokens[TokenSymbol.BOO],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE',
}

const fidelioDuettoFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.BPT_BEETS_FTM,
  name: 'Fidelio Duetto',
  ...farmConfigs[TokenSymbol.BPT_BEETS_FTM],
  ...ftmTokens[TokenSymbol.BPT_BEETS_FTM],
  getUrl: 'https://beets.fi/#/pool/0xcde5a11a4acb4ee4c805352cec57e236bdbc3837000200000000000000000019',
}

const fantomOfTheOperaFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.FANTOM_OF_THE_OPERA,
  name: 'Fantom of the Opera',
  ...farmConfigs[TokenSymbol.FANTOM_OF_THE_OPERA],
  ...ftmTokens[TokenSymbol.FANTOM_OF_THE_OPERA],
  getUrl: 'https://beets.fi/#/pool/0xcdf68a4d525ba2e90fe959c74330430a5a6b8226000200000000000000000008',
}

const grandOrchestraFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.GRAND_ORCH,
  name: 'The Grand Orchestra',
  ...farmConfigs[TokenSymbol.GRAND_ORCH],
  ...ftmTokens[TokenSymbol.GRAND_ORCH],
  getUrl: 'https://beets.fi/#/pool/0xd47d2791d3b46f9452709fa41855a045304d6f9d000100000000000000000004',
}

const battleOfTheBandsFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.BATTLE_OF_THE_BANDS,
  name: 'Battle of the Bands',
  ...farmConfigs[TokenSymbol.BATTLE_OF_THE_BANDS],
  ...ftmTokens[TokenSymbol.BATTLE_OF_THE_BANDS],
  getUrl: 'https://beets.fi/#/pool/0x9af1f0e9ac9c844a4a4439d446c14378071830750001000000000000000000da',
}

const twoSharesFtmFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol['2SHARES_FTM'],
  ...farmConfigs[TokenSymbol['2SHARES_FTM']],
  ...ftmTokens[TokenSymbol['2SHARES_FTM']],
  getUrl: 'https://spookyswap.finance/add/FTM/0xc54A1684fD1bef1f077a336E6be4Bd9a3096a6Ca',
}

const twOmbFtmFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol['2OMB_FTM'],
  ...farmConfigs[TokenSymbol['2OMB_FTM']],
  ...ftmTokens[TokenSymbol['2OMB_FTM']],
  getUrl: 'https://spookyswap.finance/add/FTM/0x7a6e4E3CC2ac9924605DCa4bA31d1831c84b44aE',
}

const farms = [
  summitFarm,
  everestFarm,
  tombFtmFarm,
  tshareFtmFarm,
  ftmBooFarm,
  booFarm,
  fidelioDuettoFarm,
  twoSharesFtmFarm,
  twOmbFtmFarm,
  fantomOfTheOperaFarm,
  grandOrchestraFarm,
  battleOfTheBandsFarm,
]

export const ftmFarms = (chainId) => {
  if (chainId !== NamedChainId.FTM) return []
  return farms.map((farm) => expandMultiElevConfig(chainId, farm)).flat()
}

export const ftmFarmTokens = (chainId): UserTokenData[] => {
  if (chainId !== NamedChainId.FTM) return []
  return farms.map(((farm) => multiElevConfigTokenInfo(chainId, farm)))
}
