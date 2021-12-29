import { AbiItem } from 'web3-utils'
import cartographer from '../config/abi/Cartographer.json'
import cartographerOasis from '../config/abi/CartographerOasis.json'
import cartographerElevation from '../config/abi/CartographerElevation.json'
import summitToken from '../config/abi/SummitToken.json'
import everestToken from '../config/abi/EverestToken.json'
import expedition from '../config/abi/ExpeditionV2.json'
import elevationHelper from '../config/abi/ElevationHelper.json'
import multicall from '../config/abi/Multicall.json'
import summitLocking from '../config/abi/SummitLocking.json'
import ERC20 from '../config/abi/ERC20.json'
import Balancer2PoolPriceOracle from '../config/abi/Balancer2PoolPriceOracle.json'
import BalancerMultiPoolPriceOracle from '../config/abi/BalancerMultiPoolPriceOracle.json'
import PancakeFactory from '../config/abi/PCS/PancakeFactory.json'
import { Elevation } from 'config/constants/types'

export const abi = {
  cartographer,
  cartographerOasis,
  cartographerElevation,
  summitToken,
  everestToken,
  expedition,
  elevationHelper,
  multicall,
  summitLocking,
  ERC20,
  Balancer2PoolPriceOracle,
  BalancerMultiPoolPriceOracle,
  PancakeFactory,
}
export const abiItem = {
  cartographer: (abi.cartographer as unknown) as AbiItem,
  cartographerOasis: (abi.cartographerOasis as unknown) as AbiItem,
  cartographerElevation: (abi.cartographerElevation as unknown) as AbiItem,
  summitToken: (abi.summitToken as unknown) as AbiItem,
  everestToken: (abi.everestToken as unknown) as AbiItem,
  expedition: (abi.expedition as unknown) as AbiItem,
  elevationHelper: (abi.elevationHelper as unknown) as AbiItem,
  multicall: (abi.multicall as unknown) as AbiItem,
  summitLocking: (abi.summitLocking as unknown) as AbiItem,
  ERC20: (abi.ERC20 as unknown) as AbiItem,
  Balancer2PoolPriceOracle: (abi.Balancer2PoolPriceOracle as unknown) as AbiItem,
  BalancerMultiPoolPriceOracle: (abi.BalancerMultiPoolPriceOracle as unknown) as AbiItem,
  PancakeFactory: (abi.PancakeFactory as unknown) as AbiItem,
}

export const subCartAbi = (elevation: Elevation) => {
  if (elevation === Elevation.OASIS) return abi.cartographerOasis
  return abi.cartographerElevation
}
