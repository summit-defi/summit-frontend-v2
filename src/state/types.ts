import BigNumber from 'bignumber.js'
import { FarmConfig, Elevation } from 'config/constants/types'
/* eslint-disable camelcase */

export const NamedChainId = {
  FTM: '250',
  BSC_TESTNET: '97',
  BSC: '56'
}

export interface PriceableToken {
  symbol: string
  assetType: TokenAssetType
  decimals: number
  tokenAddress?: string
  lpAddress?: string
  containingTokens?: string[]
  balancerMultiPoolPid?: string
}

export enum TokenAssetType {
  Stablecoin,
  SingleAsset,
  LP,
  WrappedNative,
  Balancer2Pool,
  BalancerMultiPool,
}

export interface FarmUserData {
  allowance: BigNumber
  tokenBalance: BigNumber
  stakedBalance: BigNumber
  earnedReward: BigNumber
  vestingReward: BigNumber
  roundYieldContributed: BigNumber
}
export interface Farm extends FarmConfig {
  supply?: BigNumber
  launched?: boolean
  userData?: FarmUserData
  summitPerYear?: BigNumber
  getUrl?: string
}

export interface ExpeditionUserData {
  everestAllowance: BigNumber
  everestBalance: BigNumber

  everestStaked: BigNumber
  deity: number
  deitySelected: boolean
  deitySelectionRound: number
  safetyFactor: number
  safetyFactorSelected: boolean

  entered: boolean

  summitLifetimeWinnings: BigNumber
  usdcLifetimeWinnings: BigNumber

  summitWinnings: BigNumber
  usdcWinnings: BigNumber

  guaranteedSummit: BigNumber
  guaranteedUsdc: BigNumber
  potentialSummitWinnings: BigNumber
  potentialUsdcWinnings: BigNumber
}

export interface ExpeditionTokenInfo {
  roundEmission: BigNumber
  emissionsRemaining: BigNumber
  markedForDist: BigNumber
  distributed: BigNumber
}

export interface Expedition {
  live: boolean
  launched: boolean

  safeEverest: BigNumber
  deitiedEverest: BigNumber
  deityEverest: BigNumber[]

  summit: ExpeditionTokenInfo
  usdc: ExpeditionTokenInfo

  // UI
  roundsRemaining: number
  expeditionDeityWinningsMult: number
}

// Slices states
export interface ElevationFarmsData {
  claimable: BigNumber
  yieldContributed: BigNumber
  potentialWinnings: BigNumber
  roundRewards: BigNumber
  totemsRoundRewards: BigNumber[]
}

export interface FarmsState {
  data: Farm[]
  elevationData: ElevationFarmsData[]
}

export interface ExpeditionState {
  userData: ExpeditionUserData
  data: Expedition
}

export interface ElevationInfo {
  round: number
  unlockTimestamp: number
  roundEndTimestamp: number
  roundNumber: number
  totemWinAcc: number[]
  prevWinners: number[]
  prevWinningsMultipliers: number[]
}

export enum FarmType {
  All = 'All',
  Token = 'Token',
  LP = 'LP',
}
export interface PendingTx {
  hash: string
  title: string
}
export interface SummitEcosystemState {
  activeAccount: string
  summitEnabled: boolean
  totems: Array<number | null>
  totemsLockedIn: boolean[]
  elevationsInfo: ElevationInfo[]
  keywordRound: number
  referralBurnTimestamp: number
  expeditionDivider: number
  farmType: FarmType
  liveFarms: boolean
  pendingTxs: PendingTx[]
  elevationRolloversToShow: Elevation[]
  chainId: string
  rolloverRewardInNativeToken: BigNumber
  expeditionPotTotalValue: number
  pendingExpeditionTx: boolean
}

export interface ReferralsState {
  referrer: string
  pendingRewards: number
  accumulatedRewards: number
  rewardsToBeBurned: number
}

// API Price State

export interface PriceState {
  pricesPerToken?: { [key: string]: number }
}

// Global state

export interface State {
  farms: FarmsState
  prices: PriceState
  expeditions: ExpeditionState
  block: Block
  summitEcosystem: SummitEcosystemState
  referrals: ReferralsState
}

export interface Block {
  blockNumber: number
}
