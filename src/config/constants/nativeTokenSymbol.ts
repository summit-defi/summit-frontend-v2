import { getChainId } from './chainId'

const chainNativeTokenSymbol = {
  56: '',
  97: '',
  250: 'FTM',
}

export const getNativeTokenSymbol = (): string => {
  const chainId = getChainId()
  return chainNativeTokenSymbol[chainId]
}
