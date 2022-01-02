import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import { provider as ProviderType } from 'web3-core'
import { abiItem } from './abi'

export const getContract = (provider: ProviderType, address: string) => {
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(abiItem.ERC20, address)
  return contract
}

export const getTokenBalance = async (
  provider: ProviderType,
  tokenAddress: string,
  userAddress: string,
): Promise<string> => {
  const contract = getContract(provider, tokenAddress)
  try {
    const balance: string = await contract.methods.balanceOf(userAddress).call()
    return balance
  } catch (e) {
    return '0'
  }
}

export const getTokenApproved = async (
  provider: ProviderType,
  tokenAddress: string,
  userAddress: string,
  targetAddress: string,
): Promise<boolean> => {
  const contract = getContract(provider, tokenAddress)
  try {
    const allowance: string = await contract.methods.allowance(userAddress, targetAddress).call()
    return new BigNumber(allowance).gt(0)
  } catch (e) {
    return false
  }
}
