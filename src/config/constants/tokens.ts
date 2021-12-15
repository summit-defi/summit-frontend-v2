import { PriceableToken } from 'state/types'
import { getChainId } from './chainId'
import { ftmPeggedTokens, ftmPriceableTokens } from './chainTokens/ftmTokens'
import addresses from './contracts'

const chainPeggedTokens = {
  56: [],
  97: [],
  250: ftmPeggedTokens,
}

export const getPeggedTokens = () => {
  const chainId = getChainId()
  return chainPeggedTokens[chainId]
}

const chainPriceableTokens = {
  56: [],
  97: [],
  250: ftmPriceableTokens,
}

const replaceSummitAddresses = (tokenAddress: string, summitAddress: string, summitLpAddress: string): string => {
  if (tokenAddress === '0xSUMMIT') return summitAddress
  if (tokenAddress === '0xSUMMITLP') return summitLpAddress
  return tokenAddress
}

const replaceTokensSummitAddresses = (chainId, tokens: PriceableToken[]): PriceableToken[] => {
  const summitAddress = addresses.summitToken[chainId]
  const summitLpAddress = addresses.summitLpToken[chainId]
  return tokens.map((token) => ({
    ...token,
    token: replaceSummitAddresses(token.token, summitAddress, summitLpAddress),
    lp: replaceSummitAddresses(token.lp, summitAddress, summitLpAddress),
  }))
}

export const getPriceableTokens = (): PriceableToken[] => {
  const chainId = getChainId()
  return replaceTokensSummitAddresses(chainId, chainPriceableTokens[chainId])
}
