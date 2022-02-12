import { TokenSymbol } from "config/constants/tokenSymbols"
import { TokenAssetType, PriceableToken } from "config/constants/types"

export const ftmPeggedTokens = {
  [TokenSymbol.USDC]: true,
}

export const ftmTokens: { [key: string]: PriceableToken } = {
  [TokenSymbol.wFTM]: {
    assetType: TokenAssetType.WrappedNative,
    symbol: TokenSymbol.wFTM,
    tokenAddress: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    lpAddress: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    decimals: 18,
  },
  [TokenSymbol.USDC]: {
    assetType: TokenAssetType.Stablecoin,
    symbol: TokenSymbol.USDC,
    tokenAddress: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    decimals: 6,
  },
  [TokenSymbol.SUMMIT]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.SUMMIT,
    tokenAddress: '0xSUMMIT',
    decimals: 18,
  },
  [TokenSymbol.EVEREST]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.EVEREST,
    tokenAddress: '0xC687806Cfd11B5330d7c3aE6f18B18DC71e1083e',
    decimals: 18,
  },
  [TokenSymbol.TOMB_FTM]: {
    assetType: TokenAssetType.LP,
    symbol: TokenSymbol.TOMB_FTM,
    lpAddress: '0x2a651563c9d3af67ae0388a5c8f89b867038089e',
    decimals: 18,
  },
  [TokenSymbol.TSHARE_FTM]: {
    assetType: TokenAssetType.LP,
    symbol: TokenSymbol.TSHARE_FTM,
    lpAddress: '0x4733bc45ef91cf7ccecaeedb794727075fb209f2',
    decimals: 18,
  },
  [TokenSymbol.FTM_BOO]: {
    assetType: TokenAssetType.LP,
    symbol: TokenSymbol.FTM_BOO,
    lpAddress: '0xEc7178F4C41f346b2721907F5cF7628E388A7a58',
    decimals: 18,
  },
  [TokenSymbol.BPT_BEETS_FTM]: {
    assetType: TokenAssetType.Balancer2Pool,
    symbol: TokenSymbol.BPT_BEETS_FTM,
    tokenAddress: '0xcde5a11a4acb4ee4c805352cec57e236bdbc3837',
    decimals: 18,
  },
  [TokenSymbol.BATTLE_OF_THE_BANDS]: {
    assetType: TokenAssetType.Balancer2Pool,
    symbol: TokenSymbol.BATTLE_OF_THE_BANDS,
    tokenAddress: '0x9af1f0e9ac9c844a4a4439d446c1437807183075',
    decimals: 18,
    containingTokens: [TokenSymbol.wFTM, TokenSymbol.fMATIC, TokenSymbol.fAVAX, TokenSymbol.fBNB, TokenSymbol.fLUNA, TokenSymbol.fSOL],
    balancerMultiPoolPid: '0x9af1f0e9ac9c844a4a4439d446c14378071830750001000000000000000000da',
  },
  [TokenSymbol.GRAND_ORCH]: {
    assetType: TokenAssetType.BalancerMultiPool,
    symbol: TokenSymbol.GRAND_ORCH,
    tokenAddress: '0xd47d2791d3b46f9452709fa41855a045304d6f9d',
    decimals: 18,
    containingTokens: [TokenSymbol.wFTM, TokenSymbol.wBTC, TokenSymbol.wETH],
    balancerMultiPoolPid: '0xd47d2791d3b46f9452709fa41855a045304d6f9d000100000000000000000004',
  },
  [TokenSymbol.FANTOM_OF_THE_OPERA]: {
    assetType: TokenAssetType.Balancer2Pool,
    symbol: TokenSymbol.FANTOM_OF_THE_OPERA,
    tokenAddress: '0xcdF68a4d525Ba2E90Fe959c74330430A5a6b8226',
    decimals: 18,
  },
  [TokenSymbol.BOO]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.BOO,
    tokenAddress: '0x841fad6eae12c286d1fd18d1d525dffa75c7effe',
    lpAddress: '0xEc7178F4C41f346b2721907F5cF7628E388A7a58',
    decimals: 18,
  },
  [TokenSymbol["2SHARES_FTM"]]: {
    assetType: TokenAssetType.LP,
    symbol: TokenSymbol["2SHARES_FTM"],
    lpAddress: '0x6398ACBBAB2561553a9e458Ab67dCFbD58944e52',
    decimals: 18,
  },
  [TokenSymbol["2OMB_FTM"]]: {
    assetType: TokenAssetType.LP,
    symbol: TokenSymbol["2OMB_FTM"],
    lpAddress: '0xbdC7DFb7B88183e87f003ca6B5a2F81202343478',
    decimals: 18,
  },



  // BALANCER COMPONENTS
  [TokenSymbol.wBTC]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.wBTC,
    tokenAddress: '0x321162Cd933E2Be498Cd2267a90534A804051b11',
    lpAddress: '0xfdb9ab8b9513ad9e419cf19530fee49d412c3ee3',
    decimals: 8,
  },
  [TokenSymbol.wETH]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.wETH,
    tokenAddress: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
    lpAddress: '0xf0702249f4d3a25cd3ded7859a165693685ab577',
    decimals: 18,
  },
  [TokenSymbol.fMATIC]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.fMATIC,
    tokenAddress: '0x40DF1Ae6074C35047BFF66675488Aa2f9f6384F3',
    lpAddress: '0x7051C6F0C1F1437498505521a3bD949654923fE1',
    decimals: 18,
  },
  [TokenSymbol.fAVAX]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.fAVAX,
    tokenAddress: '0x511D35c52a3C244E7b8bd92c0C297755FbD89212',
    lpAddress: '0x5DF809e410d9CC577f0d01b4E623C567C7aD56c1',
    decimals: 18,
  },
  [TokenSymbol.fBNB]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.fBNB,
    tokenAddress: '0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454',
    lpAddress: '0x956de13ea0fa5b577e4097be837bf4ac80005820',
    decimals: 18,
  },
}
