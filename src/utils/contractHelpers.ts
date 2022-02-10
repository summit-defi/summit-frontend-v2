import BigNumber from 'bignumber.js'
import { abiItem } from './abi'
import type { Signer } from '@ethersproject/abstract-signer'
import type { Provider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { simpleRpcProvider } from 'utils/providers'
import { getCartographerAddress, getExpeditionAddress, getSummitTokenAddress } from './addressHelpers'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'

type SignerLike = Signer | Provider | JsonRpcSigner


// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export const getProviderOrSigner = (library: Web3Provider, account?: string) => {
  return account ? getSigner(library, account) : library
}

export const getContract = (abi: any, address: string, signer?: SignerLike) => {
  const signerOrProvider: any = signer ?? simpleRpcProvider
  return new Contract(address, abi, signerOrProvider)
}

export const getErc20Contract = (address: string, signer?: SignerLike) => {
  return getContract(abiItem.ERC20, address, signer)
}

export const getSummitTokenContract = (signer?: SignerLike) => {
  return getContract(abiItem.ERC20, getSummitTokenAddress(), signer)
}

export const getCartographerContract = (signer?: SignerLike) => {
  return getContract(abiItem.cartographer, getCartographerAddress(), signer)
}

export const getExpeditionContract = (signer?: SignerLike) => {
  return getContract(abiItem.expedition, getExpeditionAddress(), signer)
}

export const getDummyTokenContract = (address: string, signer?: SignerLike) => {
  return getContract(abiItem.DummyERC20, address, signer)
}

export const getTokenBalance = async (
  tokenAddress: string,
  userAddress: string,
): Promise<string> => {
  const contract = getErc20Contract(tokenAddress)
  try {
    const balance: string = await contract.methods.balanceOf(userAddress).call()
    return balance
  } catch (e) {
    return '0'
  }
}

export const getTokenApproved = async (
  tokenAddress: string,
  userAddress: string,
  targetAddress: string,
): Promise<boolean> => {
  const contract = getErc20Contract(tokenAddress)
  try {
    const allowance: string = await contract.methods.allowance(userAddress, targetAddress).call()
    return new BigNumber(allowance).gt(0)
  } catch (e) {
    return false
  }
}
