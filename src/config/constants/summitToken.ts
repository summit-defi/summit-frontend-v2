import { CHAIN_ID } from './networks'

const chainSummitLpSymbol = {
  56: '',
  97: 'SUMMIT-BNB',
  250: 'SUMMIT-FTM',
}

export const getSummitLpSymbol = (): string => {
  return chainSummitLpSymbol[CHAIN_ID]
}
