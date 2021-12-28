import { TokenSymbol } from "config/constants/tokenSymbols"
import { TokenAssetType, PriceableToken } from "config/constants/types"

export const bscTestnetPeggedTokens = {
  [TokenSymbol.USDC]: true,
}

export const bscTestnetTokens: { [key in keyof typeof TokenSymbol]: PriceableToken } = {
  [TokenSymbol.wBNB]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.wBNB,
    tokenAddress: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
    decimals: 18,
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
    tokenAddress: '0xac05aE4493DAA4df679E6b0354B9D206783eF731',
    decimals: 18,
  },
  [TokenSymbol.CAKE]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.CAKE,
    tokenAddress: '0x631485306409Fe26dBA91530AedA0430451f5568',
    decimals: 18,
  },
  [TokenSymbol.BIFI]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.BIFI,
    tokenAddress: '0x2A6766f76c0777b75599Aad1a72549b9a0903163',
    decimals: 18,
  },
  [TokenSymbol.USDC]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.USDC,
    tokenAddress: '0xca4cB950c5cb3af0Cd1c87fEFEC0A68852f85353',
    decimals: 6,
  },
  [TokenSymbol.GS0]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.GS0,
    tokenAddress: '0xad407bCD82E14781A5ff8a0cd6F67F47905e0507',
    decimals: 18,
  },
  [TokenSymbol.GS1]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.GS1,
    tokenAddress: '0x1724795a75Fa63Bf508F04200b35100c51529AD4',
    decimals: 18,
  },
  [TokenSymbol.GS2]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.GS2,
    tokenAddress: '0x8c233507415bdEB3a54b4c80Af0E902B93BF5f14',
    decimals: 18,
  },
  [TokenSymbol.GS3]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.GS3,
    tokenAddress: '0x1378986AA88954896204a08416f240Be2F81Fc3c',
    decimals: 18,
  },
  [TokenSymbol.GS4]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.GS4,
    tokenAddress: '0x13FCceF84F6019aEdAf098256173F74825BB9656',
    decimals: 18,
  },
  [TokenSymbol.GS5]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.GS5,
    tokenAddress: '0x148f0bf8d667e179F44A40e88CAf14ac1FAffD61',
    decimals: 18,
  },
}
