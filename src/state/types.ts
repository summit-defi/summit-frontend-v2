import BigNumber from 'bignumber.js'
import { FarmConfig, ExpeditionConfig, Elevation } from 'config/constants/types'
/* eslint-disable camelcase */


export const TokenSymbol = {
  SUMMIT: 'SUMMIT',
  SUMMIT_FTM: 'SUMMIT-FTM',
  TOMB_FTM: 'TOMB-FTM',
  TSHARE_FTM: 'TSHARE-FTM',
  FTM_BOO: 'FTM-BOO',
  USDC_FTM: 'USDC-FTM',
  FTM_wETH: 'FTM-wETH',
  fUSDT_FTM: 'fUSDT-FTM',
  FTM_DAI: 'FTM-DAI',
  fUSDT_DAI_USDC: 'fUSDT-DAI-USDC',
  BOO: 'BOO',
  USDC: 'USDC',
  fUSDT: 'fUSDT',
  DAI: 'DAI',
  BIFI: 'BIFI',
  wFTM: 'wFTM',
  GRAND_ORCH: 'GRAND-ORCH',
  BeetXLP_MIM_USDC_USDT: 'BeetXLP-MIM-USDC-USDT',
  BPT_BEETS_FTM: 'BPT-BEETS-FTM',
}

export enum PriceableTokenSymbol {
  SUMMIT = 'SUMMIT',
  SUMMIT_FTM = 'SUMMIT-FTM',
  TOMB_FTM = 'TOMB-FTM',
  TSHARE_FTM = 'TSHARE-FTM',
  FTM_BOO = 'FTM-BOO',
  USDC_FTM = 'USDC-FTM',
  FTM_wETH = 'FTM-wETH',
  fUSDT_FTM = 'fUSDT-FTM',
  FTM_DAI = 'FTM-DAI',
  fUSDT_DAI_USDC = 'fUSDT-DAI-USDC',
  BOO = 'BOO',
  USDC = 'USDC',
  fUSDT = 'fUSDT',
  DAI = 'DAI',
  BIFI = 'BIFI',
  wFTM = 'wFTM',
  MIM = 'MIM',
  wBTC = 'wBTC',
  wETH = 'wETH',
  GRAND_ORCH = 'GRAND-ORCH',
  BeetXLP_MIM_USDC_USDT = 'BeetXLP-MIM-USDC-USDT',
  BPT_BEETS_FTM = 'BPT-BEETS-FTM',
}

export interface PriceableToken {
  symbol: PriceableTokenSymbol
  type: TokenPriceType,
  decimals
  token?: string,
  lp?: string,
  containingTokens?: PriceableTokenSymbol[],
  balancerMultiPoolPid?: string
}

export enum TokenAssetType {
  SingleAsset,
  LP,
  Balancer2Pool,
  Balancer3Pool,
}

export enum TokenPriceType {
  Stablecoin,
  SingleAsset,
  LP,
  WrappedNative,
  Balancer2Pool,
  BalancerMultiPool,
}

export interface FarmUserData {
  pid: number
  allowance: BigNumber
  tokenBalance: BigNumber
  stakedBalance: BigNumber
  earnedReward: BigNumber
  vestingReward: BigNumber
  roundYieldContributed: BigNumber
}
export interface Farm extends FarmConfig {
  lpSupply?: BigNumber
  live?: boolean
  launched?: boolean
  depositFee?: number
  withdrawalFee?: number
  userData?: FarmUserData
  summitPerYear?: BigNumber
  getUrl?: string
  tokenDecimals?: number
  assetType: TokenAssetType
  balancer3PoolPid?: string
}

export interface ExpeditionUserData {
  stakedSummit: BigNumber
  stakedSummitLp: BigNumber
  earnedReward: BigNumber
  effectiveStakedSummit: BigNumber
  hypotheticalWinReward: BigNumber
}
export interface Expedition extends ExpeditionConfig {
  launched?: boolean

  totalSummitStaked?: BigNumber
  totalSummitLpStaked?: BigNumber
  expeditionRound?: number
  startRound?: number
  totalRounds?: number
  roundsRemaining?: number

  totalEmission?: BigNumber
  roundEmission?: BigNumber
  rewardsRemaining?: BigNumber

  roundRewards?: BigNumber
  totalDeposited?: BigNumber
  totemsDeposited?: BigNumber[]
  userData?: ExpeditionUserData

  totemWinMultipliers?: [BigNumber, BigNumber]
}

// Slices states
export interface ElevationFarmsData {
  userEarned: BigNumber
  userVesting: BigNumber
  userYieldContributed: BigNumber
  roundRewards: BigNumber
  totemsRoundRewards: BigNumber[]
}

export interface FarmsState {
  data: Farm[]
  elevationData: ElevationFarmsData[]
}

export interface ExpeditionsState {
  summitAllowance: BigNumber
  summitBalance: BigNumber
  summitLpAllowance: BigNumber
  summitLpBalance: BigNumber
  data: Expedition[]
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
  pricesPerToken?: { [key in keyof typeof PriceableTokenSymbol]: number }
}

// Global state

export interface State {
  farms: FarmsState
  prices: PriceState
  expeditions: ExpeditionsState
  block: Block
  summitEcosystem: SummitEcosystemState
  referrals: ReferralsState
}

export interface Block {
  blockNumber: number
}
