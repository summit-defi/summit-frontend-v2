import { bscTestnetLinks } from './chainFarms/bsc_testnet/links'
import { CHAIN_ID } from './networks'

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
  return chainLinks[CHAIN_ID]
}

export const getEtherscanName = (): string => {
  return {
    56: 'BscScan',
    97: 'BscTestnetScan',
    250: 'FtmScan',
  }[CHAIN_ID]
}
