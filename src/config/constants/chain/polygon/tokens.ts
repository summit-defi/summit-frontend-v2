import { TokenSymbol } from "config/constants/tokenSymbols"
import { TokenAssetType, PriceableToken, TokenLpSource } from "config/constants/types"

export const polygonPeggedTokens = {
  [TokenSymbol.USDC]: true,
  [TokenSymbol.aTriCrypto]: true,
  [TokenSymbol.EURt_DAI_USDC_USDT]: true,
}

// SUMMIT POOL ID: 0x9b99145008204301de44eddc2ad4615ed3d61538000100000000000000000208
// SUMMIT POOL ADDRESS: 0x9b99145008204301de44edDC2aD4615ED3d61538

export const polygonTokens: { [key: string]: PriceableToken } = {
  [TokenSymbol.wMATIC]: {
    assetType: TokenAssetType.WrappedNative,
    symbol: TokenSymbol.wMATIC,
    tokenAddress: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    lpAddress: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    decimals: 18,
  },
  [TokenSymbol.USDC]: {
    assetType: TokenAssetType.Stablecoin,
    symbol: TokenSymbol.USDC,
    tokenAddress: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    decimals: 6,
  },
  [TokenSymbol.SUMMIT]: {
    assetType: TokenAssetType.Summit,
    symbol: TokenSymbol.SUMMIT,
    tokenAddress: '0xSUMMIT',
    decimals: 18,
  },
  [TokenSymbol.EVEREST]: {
    assetType: TokenAssetType.Everest,
    symbol: TokenSymbol.EVEREST,
    tokenAddress: '0x1243f859D73CCDcF0E81C8421Ae94F3e9F777B6C',
    decimals: 18,
  },
  [TokenSymbol.SUMMIT_MATIC]: {
    assetType: TokenAssetType.LP,
    symbol: TokenSymbol.SUMMIT_MATIC,
    lpSource: TokenLpSource.Quickswap,
    lpAddress: '0x082Dc7e87eDC2e5868Cf05d305e923Bfd8984341',
    decimals: 18,
  },
  [TokenSymbol.MAI_USDC]: {
    assetType: TokenAssetType.LP,
    symbol: TokenSymbol.MAI_USDC,
    lpSource: TokenLpSource.Quickswap,
    lpAddress: '0x160532d2536175d65c03b97b0630a9802c274dad',
    decimals: 18,
  },
  [TokenSymbol.FTM_BOO]: {
    assetType: TokenAssetType.LP,
    symbol: TokenSymbol.FTM_BOO,
    lpSource: TokenLpSource.SpookySwap,
    lpAddress: '0xEc7178F4C41f346b2721907F5cF7628E388A7a58',
    decimals: 18,
  },
  [TokenSymbol.aTriCrypto]: {
    assetType: TokenAssetType.LP,
    symbol: TokenSymbol.aTriCrypto,
    lpSource: TokenLpSource.Curve,
    lpAddress: '0xdad97f7713ae9437fa9249920ec8507e5fbb23d3',
    decimals: 18,
  },
  [TokenSymbol.QI_MATIC]: {
    assetType: TokenAssetType.LP,
    symbol: TokenSymbol.QI_MATIC,
    lpSource: TokenLpSource.Quickswap,
    lpAddress: '0x9a8b2601760814019b7e6ee0052e25f1c623d1e6',
    decimals: 18,
  },
  [TokenSymbol.BIFI_MAXI]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.BIFI_MAXI,
    tokenAddress: '0xFbdd194376de19a88118e84E279b977f165d01b8',
    lpAddress: '0xFbdd194376de19a88118e84E279b977f165d01b8',
    decimals: 18,
  },
  [TokenSymbol.QUICK]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.QUICK,
    tokenAddress: '0x831753DD7087CaC61aB5644b308642cc1c33Dc13',
    lpAddress: '0x831753DD7087CaC61aB5644b308642cc1c33Dc13',
    decimals: 18,
  },
  [TokenSymbol.MATIC_USDC]: {
    assetType: TokenAssetType.LP,
    symbol: TokenSymbol.MATIC_USDC,
    lpAddress: '0x6e7a5FAFcec6BB1e78bAE2A1F0B612012BF14827',
    lpSource: TokenLpSource.Quickswap,
    decimals: 18,
  },
  [TokenSymbol.ETH_MATIC]: {
    assetType: TokenAssetType.LP,
    symbol: TokenSymbol.ETH_MATIC,
    lpAddress: '0xadbf1854e5883eb8aa7baf50705338739e558e5b',
    lpSource: TokenLpSource.Quickswap,
    decimals: 18,
  },
  [TokenSymbol.EURt_DAI_USDC_USDT]: {
    assetType: TokenAssetType.LP,
    symbol: TokenSymbol.EURt_DAI_USDC_USDT,
    lpAddress: '0x600743B1d8A96438bD46836fD34977a00293f6Aa',
    lpSource: TokenLpSource.Curve,
    decimals: 18,
  },
}
