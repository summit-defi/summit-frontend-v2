import { PriceableToken } from './types'
import { bscTestnetTokens } from './chainFarms/bsc_testnet/tokens'
import { getChainId } from './chainId'
import { TokenSymbol } from './tokenSymbols'

const chainNativeTokenSymbol = {
  56: '',
  97: '',
  250: 'FTM',
}

export const getNativeTokenSymbol = (): string => {
  const chainId = getChainId()
  return chainNativeTokenSymbol[chainId]
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
  const chainId = getChainId()
  return chainWrappedNativeTokenSymbol[chainId]
}
