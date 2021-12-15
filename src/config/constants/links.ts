import { ftmLinks } from './chainFarms/ftm/links'
import { getChainId } from './chainId'

export interface ExternalLinks {
  exchange: string
  liquidity: string
  summitTokenLink: string
  etherscan: string
}

const chainLinks = {
  56: [],
  97: [],
  250: ftmLinks,
}

export const getLinks = (): ExternalLinks => {
  const chainId = getChainId()
  return chainLinks[chainId]
}

export const getEtherscanName = (): string => {
  const chainId = getChainId()
  return {
    56: 'BscScan',
    97: 'BscTestnetScan',
    250: 'FtmScan',
  }[chainId]
}
