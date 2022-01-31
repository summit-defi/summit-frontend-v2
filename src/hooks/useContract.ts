import { useEffect, useState } from 'react'
import { AbiItem } from 'web3-utils'
import { ContractOptions } from 'web3-eth-contract'
import useWeb3 from 'hooks/useWeb3'
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
} from 'utils/'

const useContract = (abi: AbiItem, address: string, contractOptions?: ContractOptions) => {
  const web3 = useWeb3()
  const [contract, setContract] = useState(new web3.eth.Contract(abi, address, contractOptions))

  useEffect(() => {
    setContract(new web3.eth.Contract(abi, address, contractOptions))
  }, [abi, address, contractOptions, web3])

  return contract
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
  return useContract(abiItem.cartographer, getCartographerAddress())
}
export const useCartographerOasis = () => {
  return useContract(abiItem.cartographerOasis, getCartographerOasisAddress())
}
export const useExpedition = () => {
  return useContract(abiItem.expedition, getExpeditionAddress())
}
export const useElevationHelper = () => {
  return useContract(abiItem.elevationHelper, getElevationHelperAddress())
}
export const useSummitGlacier = () => {
  return useContract(abiItem.summitGlacier, getSummitGlacierAddress())
}

export default useContract
