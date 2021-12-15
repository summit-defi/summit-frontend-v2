import { Elevation, MultiElevFarmConfig } from '../../types'
import { expandMultiElevConfig } from '../../expandMultiElevConfig'
import { farmPids } from './farmPids'
import { TokenAssetType, TokenSymbol } from 'state/types'



const summitFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.SUMMIT,
  ...farmPids[TokenSymbol.SUMMIT],
  lpAddress: '0xSUMMITLP',
  isTokenOnly: true,
  tokenAddress: '0xSUMMIT',
  quoteInNativeToken: true,
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xSUMMIT',
  assetType: TokenAssetType.SingleAsset,
}

const summitLpFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.SUMMIT_FTM,
  ...farmPids[TokenSymbol.SUMMIT_FTM],
  lpAddress: '0xSUMMITLP',
  tokenAddress: '0xSUMMITLP',
  quoteInNativeToken: true,
  getUrl: 'https://spookyswap.finance/add/FTM/0xSUMMIT',
  assetType: TokenAssetType.LP,
}

const tombFtmFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.TOMB_FTM,
  ...farmPids[TokenSymbol.TOMB_FTM],
  lpAddress: '0x2a651563c9d3af67ae0388a5c8f89b867038089e',
  tokenAddress: '0x2a651563c9d3af67ae0388a5c8f89b867038089e',
  quoteInNativeToken: true,
  passthroughStrategy: 'https://app.beefy.finance/#/fantom',
  getUrl: 'https://spookyswap.finance/add/FTM/0x6c021Ae822BEa943b2E66552bDe1D2696a53fbB7',
  assetType: TokenAssetType.LP,
}

const tshareFtmFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.TSHARE_FTM,
  ...farmPids[TokenSymbol.TSHARE_FTM],
  lpAddress: '0x4733bc45ef91cf7ccecaeedb794727075fb209f2',
  tokenAddress: '0x4733bc45ef91cf7ccecaeedb794727075fb209f2',
  quoteInNativeToken: true,
  passthroughStrategy: 'https://app.beefy.finance/#/fantom',
  getUrl: 'https://spookyswap.finance/add/FTM/0x4cdF39285D7Ca8eB3f090fDA0C069ba5F4145B37',
  assetType: TokenAssetType.LP,
}

const ftmBooFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.FTM_BOO,
  ...farmPids[TokenSymbol.FTM_BOO],
  lpAddress: '0xEc7178F4C41f346b2721907F5cF7628E388A7a58',
  tokenAddress: '0xEc7178F4C41f346b2721907F5cF7628E388A7a58',
  quoteInNativeToken: true,
  passthroughStrategy: 'https://app.beefy.finance/#/fantom',
  getUrl: 'https://spookyswap.finance/add/0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE/FTM',
  assetType: TokenAssetType.LP,
}

const usdcFtmFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.USDC_FTM,
  ...farmPids[TokenSymbol.USDC_FTM],
  lpAddress: '0x2b4c76d0dc16be1c31d4c1dc53bf9b45987fc75c',
  tokenAddress: '0x2b4c76d0dc16be1c31d4c1dc53bf9b45987fc75c',
  quoteInNativeToken: true,
  passthroughStrategy: 'https://app.beefy.finance/#/fantom',
  getUrl: 'https://spookyswap.finance/add/FTM/0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
  assetType: TokenAssetType.LP,
}

const ftmEthFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.FTM_wETH,
  ...farmPids[TokenSymbol.FTM_wETH],
  lpAddress: '0xf0702249f4d3a25cd3ded7859a165693685ab577',
  tokenAddress: '0xf0702249f4d3a25cd3ded7859a165693685ab577',
  quoteInNativeToken: true,
  passthroughStrategy: 'https://app.beefy.finance/#/fantom',
  getUrl: 'https://spookyswap.finance/add/FTM/0x74b23882a30290451A17c44f4F05243b6b58C76d',
  assetType: TokenAssetType.LP,
}

const fUsdtFtmFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.fUSDT_FTM,
  ...farmPids[TokenSymbol.fUSDT_FTM],
  lpAddress: '0x5965e53aa80a0bcf1cd6dbdd72e6a9b2aa047410',
  tokenAddress: '0x5965e53aa80a0bcf1cd6dbdd72e6a9b2aa047410',
  quoteInNativeToken: true,
  passthroughStrategy: 'https://app.beefy.finance/#/fantom',
  getUrl: 'https://spookyswap.finance/add/FTM/0x049d68029688eAbF473097a2fC38ef61633A3C7A',
  assetType: TokenAssetType.LP,
}

const ftmDaiFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.FTM_DAI,
  ...farmPids[TokenSymbol.FTM_DAI],
  lpAddress: '0xe120ffbda0d14f3bb6d6053e90e63c572a66a428',
  tokenAddress: '0xe120ffbda0d14f3bb6d6053e90e63c572a66a428',
  quoteInNativeToken: true,
  passthroughStrategy: 'https://app.beefy.finance/#/fantom',
  getUrl: 'https://spookyswap.finance/add/FTM/0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E',
  assetType: TokenAssetType.LP,
}

const fUsdtDaiUsdcFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.fUSDT_DAI_USDC,
  ...farmPids[TokenSymbol.fUSDT_DAI_USDC],
  lpAddress: '0x92d5ebf3593a92888c25c0abef126583d4b5312e',
  tokenAddress: '0x92d5ebf3593a92888c25c0abef126583d4b5312e',
  quoteInNativeToken: false,
  passthroughStrategy: 'https://app.beefy.finance/#/fantom',
  getUrl: 'https://ftm.curve.fi/fusdt/deposit',
  farmWarning: 'This farm is scheduled to be retired Oct 29 9am UTC - Fee reduced to 0.1%',
  assetType: TokenAssetType.LP,
}

const grandOrchFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.GRAND_ORCH,
  altName: 'The Grand Orchestra',
  ...farmPids[TokenSymbol.GRAND_ORCH],
  lpAddress: '0xd47d2791d3b46f9452709fa41855a045304d6f9d',
  tokenAddress: '0xd47d2791d3b46f9452709fa41855a045304d6f9d',
  quoteInNativeToken: false,
  passthroughStrategy: 'https://app.beefy.finance/#/fantom',
  getUrl: 'https://app.beethovenx.io/#/pool/0xd47d2791d3b46f9452709fa41855a045304d6f9d000100000000000000000004',
  assetType: TokenAssetType.Balancer3Pool,
  balancer3PoolPid: '0xd47d2791d3b46f9452709fa41855a045304d6f9d000100000000000000000004',
}

const ziggyStardustFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.BeetXLP_MIM_USDC_USDT,
  altName: 'Ziggy Stardust & Magic Internet Money',
  ...farmPids[TokenSymbol.BeetXLP_MIM_USDC_USDT],
  lpAddress: '0xd163415bd34ef06f57c58d2aed5a5478afb464cc',
  tokenAddress: '0xd163415bd34ef06f57c58d2aed5a5478afb464cc',
  quoteInNativeToken: false,
  passthroughStrategy: 'https://app.beefy.finance/#/fantom',
  getUrl: 'https://app.beethovenx.io/#/pool/0xd163415bd34ef06f57c58d2aed5a5478afb464cc00000000000000000000000e',
  assetType: TokenAssetType.Balancer3Pool,
  balancer3PoolPid: '0xd163415bd34ef06f57c58d2aed5a5478afb464cc00000000000000000000000e',
}

const fidelioDuettoFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.BPT_BEETS_FTM,
  altName: 'Fidelio Duetto',
  ...farmPids[TokenSymbol.BPT_BEETS_FTM],
  lpAddress: '0xcde5a11a4acb4ee4c805352cec57e236bdbc3837',
  tokenAddress: '0xcde5a11a4acb4ee4c805352cec57e236bdbc3837',
  quoteInNativeToken: false,
  passthroughStrategy: 'https://app.beefy.finance/#/fantom',
  getUrl: 'https://app.beethovenx.io/#/pool/0xcde5a11a4acb4ee4c805352cec57e236bdbc3837000200000000000000000019',
  assetType: TokenAssetType.Balancer2Pool,
}


const booFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.BOO,
  ...farmPids[TokenSymbol.BOO],
  lpAddress: '0xEc7178F4C41f346b2721907F5cF7628E388A7a58',
  isTokenOnly: true,
  tokenAddress: '0x841fad6eae12c286d1fd18d1d525dffa75c7effe',
  quoteInNativeToken: true,
  passthroughStrategy: 'https://app.beefy.finance/#/fantom',
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0x841fad6eae12c286d1fd18d1d525dffa75c7effe',
  assetType: TokenAssetType.SingleAsset,
}

const usdcFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.USDC,
  ...farmPids[TokenSymbol.USDC],
  lpAddress: '0x2b4c76d0dc16be1c31d4c1dc53bf9b45987fc75c',
  isTokenOnly: true,
  tokenAddress: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
  quoteInNativeToken: false,
  passthroughStrategy: 'https://app.beefy.finance/#/fantom',
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
  assetType: TokenAssetType.SingleAsset,
}

const fUsdtFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.fUSDT,
  ...farmPids[TokenSymbol.fUSDT],
  lpAddress: '0x5965e53aa80a0bcf1cd6dbdd72e6a9b2aa047410',
  isTokenOnly: true,
  tokenAddress: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
  quoteInNativeToken: false,
  passthroughStrategy: 'https://app.beefy.finance/#/fantom',
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0x049d68029688eAbF473097a2fC38ef61633A3C7A',
  assetType: TokenAssetType.SingleAsset,
  farmWarning: {
    [Elevation.PLAINS]: 'fUSDT at the Plains is under maintenance. Please use alternate elevation fUSDT farms.'
  },
  farmComment: {
    [Elevation.OASIS]: 'fUSDT at the Plains is under maintenance. Please do not elevate into it.',
    [Elevation.MESA]: 'fUSDT at the Plains is under maintenance. Please do not elevate into it.',
    [Elevation.SUMMIT]: 'fUSDT at the Plains is under maintenance. Please do not elevate into it.'
  }
}

const daiFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.DAI,
  ...farmPids[TokenSymbol.DAI],
  lpAddress: '0xe120ffbda0d14f3bb6d6053e90e63c572a66a428',
  isTokenOnly: true,
  tokenAddress: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
  quoteInNativeToken: false,
  passthroughStrategy: 'https://app.beefy.finance/#/fantom',
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E',
  assetType: TokenAssetType.SingleAsset,
}

const bifiFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.BIFI,
  ...farmPids[TokenSymbol.BIFI],
  lpAddress: '0x1656728af3a14e1319F030Dc147fAbf6f627059e',
  isTokenOnly: true,
  tokenAddress: '0xd6070ae98b8069de6b494332d1a1a81b6179d960',
  quoteInNativeToken: true,
  passthroughStrategy: 'https://app.beefy.finance/#/fantom',
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xd6070ae98b8069de6B494332d1A1a81B6179D960',
  assetType: TokenAssetType.SingleAsset,
}

const ftmFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.wFTM,
  ...farmPids[TokenSymbol.wFTM],
  lpAddress: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
  isTokenOnly: true,
  tokenAddress: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
  quoteInNativeToken: true,
  passthroughStrategy: 'https://app.beefy.finance/#/fantom',
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
  assetType: TokenAssetType.SingleAsset,
}

export const ftmFarms = (chainId) => {
  if (chainId !== '250') return []
  return [
    ...expandMultiElevConfig(chainId, summitFarm),
    ...expandMultiElevConfig(chainId, summitLpFarm),
    ...expandMultiElevConfig(chainId, tombFtmFarm),
    ...expandMultiElevConfig(chainId, tshareFtmFarm),
    ...expandMultiElevConfig(chainId, ftmBooFarm),
    ...expandMultiElevConfig(chainId, usdcFtmFarm),
    ...expandMultiElevConfig(chainId, ftmEthFarm),
    ...expandMultiElevConfig(chainId, fUsdtFtmFarm),
    ...expandMultiElevConfig(chainId, ftmDaiFarm),
    ...expandMultiElevConfig(chainId, fUsdtDaiUsdcFarm),
    ...expandMultiElevConfig(chainId, grandOrchFarm),
    ...expandMultiElevConfig(chainId, ziggyStardustFarm),
    ...expandMultiElevConfig(chainId, fidelioDuettoFarm),
    ...expandMultiElevConfig(chainId, booFarm),
    ...expandMultiElevConfig(chainId, usdcFarm),
    ...expandMultiElevConfig(chainId, fUsdtFarm),
    ...expandMultiElevConfig(chainId, daiFarm),
    ...expandMultiElevConfig(chainId, bifiFarm),
    ...expandMultiElevConfig(chainId, ftmFarm),
  ]
}
