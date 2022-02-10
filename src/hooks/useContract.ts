import { useEffect, useMemo, useState } from 'react'
import { AbiItem } from 'web3-utils'
import { ContractOptions } from 'web3-eth-contract'
import {
  abiItem,
  getSummitTokenAddress,
  getCartographerAddress,
  getExpeditionAddress,
  getCartographerOasisAddress,
  getElevationHelperAddress,
  getSummitLpAddress,
  getEverestTokenAddress,
  getSummitGlacierAddress,
  getContract,
  getProviderOrSigner,
  getCartographerContract,
  getExpeditionContract,
} from 'utils/'
import useActiveWeb3React from './useActiveWeb3React'

const useContract = (ABI: any, address: string | undefined, withSignerIfPossible = true) => {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, withSignerIfPossible ? getProviderOrSigner(library, account) as any : null)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useERC20 = (address: string) => {
  return useContract(abiItem.ERC20, address)
}

export const useSummitToken = () => {
  return useContract(abiItem.summitToken, getSummitTokenAddress())
}
export const useEverestToken = () => {
  return useContract(abiItem.everestToken, getEverestTokenAddress())
}
export const useSummitLp = () => {
  return useContract(abiItem.ERC20, getSummitLpAddress())
}

export const useCartographer = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getCartographerContract(library.getSigner()), [library])
}
export const useExpedition = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getExpeditionContract(library.getSigner()), [library])
}
export const useElevationHelper = () => {
  return useContract(abiItem.elevationHelper, getElevationHelperAddress())
}
export const useSummitGlacier = () => {
  return useContract(abiItem.summitGlacier, getSummitGlacierAddress())
}

export default useContract
