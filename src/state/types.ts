import BigNumber from 'bignumber.js'
import { FarmConfig, Elevation, FarmElevationConfig } from 'config/constants/types'
/* eslint-disable camelcase */

export const NamedChainId = {
  FTM: '250',
  BSC_TESTNET: '97',
  BSC: '56'
}

export interface FarmElevation extends FarmElevationConfig {
  supply?: BigNumber
  launched?: boolean
  stakedBalance?: BigNumber
  claimable?: BigNumber
  yieldContributed?: BigNumber
}
export interface FarmElevations {
  [Elevation.OASIS]: FarmElevation
  [Elevation.PLAINS]: FarmElevation
  [Elevation.MESA]: FarmElevation
  [Elevation.SUMMIT]: FarmElevation
}
export interface Farm extends FarmConfig {
  elevations: FarmElevations

  summitPerYear?: BigNumber
  getUrl?: string
}

export interface ExpeditionUserData {
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
export interface ExpeditionInfo {
  live: boolean
  launched: boolean

  safeEverest: BigNumber
  deitiedEverest: BigNumber
  deityEverest: BigNumber[]

  summit: ExpeditionTokenInfo
  usdc: ExpeditionTokenInfo

  roundsRemaining: number
}

// Slices states
export interface ElevationFarmsData {
  claimable: BigNumber
  yieldContributed: BigNumber
  potentialWinnings: BigNumber
  roundRewards: BigNumber
  totemRoundRewards: BigNumber[]
  totemMultipliers: number[]
}

export interface FarmsState {
  farmsLoaded: boolean
  userDataLoaded: boolean
  elevationDataLoaded: boolean
  data: Farm[]
  elevationData: ElevationFarmsData[]
}

export interface ExpeditionState {
  userData: ExpeditionUserData
  data: ExpeditionInfo
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
  totemSelectionRounds: Array<number | null>
  elevationsInfo: ElevationInfo[]
  keywordRound: number
  expeditionDivider: number
  farmType: FarmType
  liveFarms: boolean
  pendingTxs: PendingTx[]
  elevationRolloversToShow: Elevation[]
  chainId: string
  rolloverRewardInNativeToken: BigNumber
  expeditionPotTotalValue: number
  pendingExpeditionTx: boolean
  pendingTotemSelection: boolean
}

// API Price State

export interface PriceState {
  pricesPerToken?: { [key: string]: number }
}

// Tokens

export interface UserTokenData {
  symbol: string
  tokenAddress: string
  staked?: BigNumber
  bonusResetTimestamp?: number
  bonusBP?: number
  taxResetTimestamp?: number
  taxBP?: number
  farmAllowance?: BigNumber
  walletBalance?: BigNumber
}
export interface TokensState {
  data: UserTokenData[]
}

// Glacier State
export interface Epoch {
  index: number
  frozenSummit: BigNumber
  isThawed: boolean
}
export interface GlacierState {
  epochs: Epoch[]
  currentEpochIndex: number
}

// Everest State
export interface EverestUserData {
  everestOwned: BigNumber
  summitLocked: BigNumber
  lockRelease: number
  lockDuration: number
  everestLockMult: number
  summitBalance: BigNumber
  summitAllowance: BigNumber
  everestBalance: BigNumber
  everestAllowance: BigNumber
}
export interface EverestState {
  totalSummitLocked: BigNumber
  averageLockDuration: number
  everestSupply: BigNumber
  userData?: EverestUserData
}

// Global state
export interface State {
  farms: FarmsState
  prices: PriceState
  expedition: ExpeditionState
  summitEcosystem: SummitEcosystemState
  tokens: TokensState
  glacier: GlacierState
  everest: EverestState
}










// UI



export enum LockSummitButtonType {
  LockSummit,
  IncreaseLockedSummit,
  IncreaseLockDuration,
}
