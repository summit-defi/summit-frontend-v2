import { AbiItem } from 'web3-utils'
import cartographer from '../config/abi/Cartographer.json'
import cartographerOasis from '../config/abi/CartographerOasis.json'
import cartographerElevation from '../config/abi/CartographerElevation.json'
import cartographerExpedition from '../config/abi/CartographerExpedition.json'
import elevationHelper from '../config/abi/ElevationHelper.json'
import multicall from '../config/abi/Multicall.json'
import summitReferrals from '../config/abi/SummitReferrals.json'
import summitToken from '../config/abi/SummitToken.json'
import BEP20 from '../config/abi/BEP20.json'
import Balancer2PoolPriceOracle from '../config/abi/Balancer2PoolPriceOracle.json'
import BalancerMultiPoolPriceOracle from '../config/abi/BalancerMultiPoolPriceOracle.json'
import PancakeFactory from '../config/abi/PCS/PancakeFactory.json'
import BaseRecoveryPassthrough from '../config/abi/BaseRecoveryPassthrough.json'

export const abi = {
  cartographer,
  cartographerOasis,
  cartographerElevation,
  cartographerExpedition,
  elevationHelper,
  multicall,
  summitReferrals,
  summitToken,
  BEP20,
  Balancer2PoolPriceOracle,
  BalancerMultiPoolPriceOracle,
  PancakeFactory,
  BaseRecoveryPassthrough,
}
export const abiItem = {
  cartographer: (abi.cartographer as unknown) as AbiItem,
  cartographerOasis: (abi.cartographerOasis as unknown) as AbiItem,
  cartographerElevation: (abi.cartographerElevation as unknown) as AbiItem,
  cartographerExpedition: (abi.cartographerExpedition as unknown) as AbiItem,
  elevationHelper: (abi.elevationHelper as unknown) as AbiItem,
  multicall: (abi.multicall as unknown) as AbiItem,
  summitReferrals: (abi.summitReferrals as unknown) as AbiItem,
  summitToken: (abi.summitToken as unknown) as AbiItem,
  BEP20: (abi.BEP20 as unknown) as AbiItem,
  Balancer2PoolPriceOracle: (abi.Balancer2PoolPriceOracle as unknown) as AbiItem,
  BalancerMultiPoolPriceOracle: (abi.BalancerMultiPoolPriceOracle as unknown) as AbiItem,
  PancakeFactory: (abi.PancakeFactory as unknown) as AbiItem,
  baseRecoveryPassthrough: (abi.BaseRecoveryPassthrough as unknown) as AbiItem,
}
