import { TokenPriceType, PriceableToken } from "state/types"



export enum BscTestnetTokenSymbol {
  SUMMIT = 'SUMMIT',
  EVEREST = 'EVEREST',
  CAKE = 'CAKE',
  BIFI = 'BIFI',
  USDC = 'USDC',
  GS0 = 'GS0',
  GS1 = 'GS1',
  GS2 = 'GS2',
  GS3 = 'GS3',
  GS4 = 'GS4',
  GS5 = 'GS5',
}

export const bscTestnetPeggedTokens = {
  [BscTestnetTokenSymbol.USDC]: true,
}

export const bscTestnetTokens: PriceableToken[] = [
  {
    type: TokenPriceType.SingleAsset,
    symbol: BscTestnetTokenSymbol.SUMMIT,
    tokenAddress: '0xSUMMIT',
    decimals: 18,
  },
  {
    type: TokenPriceType.SingleAsset,
    symbol: BscTestnetTokenSymbol.EVEREST,
    tokenAddress: '0xac05aE4493DAA4df679E6b0354B9D206783eF731',
    decimals: 18,
  },
  {
    type: TokenPriceType.SingleAsset,
    symbol: BscTestnetTokenSymbol.CAKE,
    tokenAddress: '0x631485306409Fe26dBA91530AedA0430451f5568',
    decimals: 18,
  },
  {
    type: TokenPriceType.SingleAsset,
    symbol: BscTestnetTokenSymbol.BIFI,
    tokenAddress: '0x2A6766f76c0777b75599Aad1a72549b9a0903163',
    decimals: 18,
  },
  {
    type: TokenPriceType.SingleAsset,
    symbol: BscTestnetTokenSymbol.USDC,
    tokenAddress: '0xca4cB950c5cb3af0Cd1c87fEFEC0A68852f85353',
    decimals: 6,
  },
  {
    type: TokenPriceType.SingleAsset,
    symbol: BscTestnetTokenSymbol.GS0,
    tokenAddress: '0xad407bCD82E14781A5ff8a0cd6F67F47905e0507',
    decimals: 18,
  },
  {
    type: TokenPriceType.SingleAsset,
    symbol: BscTestnetTokenSymbol.GS1,
    tokenAddress: '0x1724795a75Fa63Bf508F04200b35100c51529AD4',
    decimals: 18,
  },
  {
    type: TokenPriceType.SingleAsset,
    symbol: BscTestnetTokenSymbol.GS2,
    tokenAddress: '0x8c233507415bdEB3a54b4c80Af0E902B93BF5f14',
    decimals: 18,
  },
  {
    type: TokenPriceType.SingleAsset,
    symbol: BscTestnetTokenSymbol.GS3,
    tokenAddress: '0x1378986AA88954896204a08416f240Be2F81Fc3c',
    decimals: 18,
  },
  {
    type: TokenPriceType.SingleAsset,
    symbol: BscTestnetTokenSymbol.GS4,
    tokenAddress: '0x13FCceF84F6019aEdAf098256173F74825BB9656',
    decimals: 18,
  },
  {
    type: TokenPriceType.SingleAsset,
    symbol: BscTestnetTokenSymbol.GS5,
    tokenAddress: '0x148f0bf8d667e179F44A40e88CAf14ac1FAffD61',
    decimals: 18,
  },
]
