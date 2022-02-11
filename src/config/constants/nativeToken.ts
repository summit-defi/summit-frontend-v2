import { PriceableToken } from './types'
import { bscTestnetTokens } from './chainFarms/bsc_testnet/tokens'
import { TokenSymbol } from './tokenSymbols'
import { CHAIN_ID } from './networks'

const chainNativeTokenSymbol = {
  56: '',
  97: '',
  250: 'FTM',
}

export const getNativeTokenSymbol = (): string => {
  return chainNativeTokenSymbol[CHAIN_ID]
}

const chainWrappedNativeTokenSymbol = {
  56: '',
  97: TokenSymbol.wBNB,
  250: '',
}

export const getChainWrappedNativeToken = (): PriceableToken | null => {
  return bscTestnetTokens[TokenSymbol.wBNB]
}

export const getChainWrappedNativeTokenSymbol = (): TokenSymbol | null => {
  return chainWrappedNativeTokenSymbol[CHAIN_ID]
}
