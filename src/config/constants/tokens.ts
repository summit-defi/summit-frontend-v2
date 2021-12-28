import { PriceableToken } from 'state/types'
import { getChainId } from './chainId'
import { bscTestnetPeggedTokens, bscTestnetTokens } from './chainFarms/bsc_testnet/tokens'
import addresses from './contracts'

const chainPeggedTokens = {
  56: [],
  97: bscTestnetPeggedTokens,
  250: [],
}

export const getPeggedTokens = () => {
  const chainId = getChainId()
  return chainPeggedTokens[chainId]
}

const chainTokens = {
  56: [],
  97: bscTestnetTokens,
  250: [],
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
    token: replaceSummitAddresses(token.tokenAddress, summitAddress, summitLpAddress),
    lp: replaceSummitAddresses(token.lpAddress, summitAddress, summitLpAddress),
  }))
}

export const getPriceableTokens = (): PriceableToken[] => {
  const chainId = getChainId()
  return replaceTokensSummitAddresses(chainId, chainTokens[chainId])
}
