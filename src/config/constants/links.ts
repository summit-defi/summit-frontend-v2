import { bscTestnetLinks } from './chainFarms/bsc_testnet/links'
import { getChainId } from './chainId'

export interface ExternalLinks {
  exchange: string
  liquidity: string
  summitTokenLink: string
  etherscan: string
}

const chainLinks = {
  56: [],
  97: bscTestnetLinks,
  250: [],
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
