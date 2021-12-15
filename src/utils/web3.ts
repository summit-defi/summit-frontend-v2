import Web3 from 'web3'
import { HttpProviderOptions } from 'web3-core-helpers'
import getRpcUrl from 'utils/getRpcUrl'

const RPC_URL = getRpcUrl()
const httpProvider = new Web3.providers.HttpProvider(RPC_URL, { timeout: 10000 } as HttpProviderOptions)
const web3NoAccount = new Web3(httpProvider)

/**
 * Provides a web3 instance using our own private provider httpProver
 */
const getWeb3 = () => {
  const web3 = new Web3(httpProvider)
  return web3
}

const getWeb3NoAccount = () => {
  return web3NoAccount
}

export { getWeb3NoAccount }
export { getWeb3, httpProvider }
export default web3NoAccount
