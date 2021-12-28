import { getChainId } from './chainId'

const chainSummitLpSymbol = {
  56: '',
  97: 'SUMMIT-BNB',
  250: 'SUMMIT-FTM',
}

export const getSummitLpSymbol = (): string => {
  const chainId = getChainId()
  return chainSummitLpSymbol[chainId]
}
