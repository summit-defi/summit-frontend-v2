/* eslint camelcase: 0 */
import BigNumber from 'bignumber.js'
import { TokenAssetType } from 'state/types'

export const ForceElevationRetired = true

export enum Elevation {
  OASIS = 'OASIS',
  PLAINS = 'PLAINS',
  MESA = 'MESA',
  SUMMIT = 'SUMMIT',
  EXPEDITION = 'EXPEDITION',
}

export const ZEROADD = '0x0000000000000000000000000000000000000000'

export const ElevationUnlockRound = {
  [Elevation.OASIS]: 0,
  [Elevation.PLAINS]: 1,
  [Elevation.MESA]: 1,
  [Elevation.SUMMIT]: 1,
  [Elevation.EXPEDITION]: 1,
}

export type PlainsTotemNumber = 0 | 1
export type MesaTotemNumber = 0 | 1 | 2 | 3 | 4
export type SummitTotemNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type ExpeditionTotemNumber = 0 | 1

export interface OasisElevationToNumber {
  [Elevation.OASIS]: number
  [Elevation.PLAINS]: number
  [Elevation.MESA]: number
  [Elevation.SUMMIT]: number
}

export const AllElevations = Object.values(Elevation).filter((v) => typeof v === 'string') as Elevation[]
export const ElevationTitle: { [key in keyof typeof Elevation]: string } = {
  [Elevation.OASIS]: 'THE OASIS',
  [Elevation.PLAINS]: 'THE PLAINS',
  [Elevation.MESA]: 'THE MESA',
  [Elevation.SUMMIT]: 'THE SUMMIT',
  [Elevation.EXPEDITION]: 'THE EXPEDITION',
}
export const ElevationHelpLink: { [key in keyof typeof Elevation]: string } = {
  [Elevation.OASIS]: 'https://docs.summitdefi.com/farming/oasis',
  [Elevation.PLAINS]: 'https://docs.summitdefi.com/farming/elevation',
  [Elevation.MESA]: 'https://docs.summitdefi.com/farming/elevation',
  [Elevation.SUMMIT]: 'https://docs.summitdefi.com/farming/elevation',
  [Elevation.EXPEDITION]: 'https://docs.summitdefi.com/expedition/overview',
}
export const ElevationMultiplier: { [key in keyof typeof Elevation]: string } = {
  [Elevation.OASIS]: '',
  [Elevation.PLAINS]: ': 2000M / 1.1x',
  [Elevation.MESA]: ': 5000M / 1.25x',
  [Elevation.SUMMIT]: ': 10000M / 1.5x',
  [Elevation.EXPEDITION]: 'EXPEDITION',
}
export const ElevationSubHeader: { [key in keyof typeof Elevation]: string } = {
  [Elevation.OASIS]: 'CONTINUOUS YIELD, 1X REWARDS',
  [Elevation.PLAINS]: '2 HOUR ROUNDS, 2X REWARDS',
  [Elevation.MESA]: '4 HOUR ROUNDS, 5X REWARDS',
  [Elevation.SUMMIT]: '8 HOUR ROUNDS, 10X REWARDS',
  [Elevation.EXPEDITION]:
    "An expedition starts every 2H in search of tokens and the cartographer predicts the elevation the party will make it to. Stake your SUMMIT either higher or lower than the cartographer's prediction, and win the staking rewards of the entire pool. Rewards are paid out in the expeditions search token (not SUMMIT), and vest over the duration of the next expedition.",
}

export const ElevationTotems: { [key in keyof typeof Elevation]: number[] } = {
  [Elevation.OASIS]: [0],
  [Elevation.PLAINS]: [0, 1],
  [Elevation.MESA]: [0, 1, 2, 3, 4],
  [Elevation.SUMMIT]: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [Elevation.EXPEDITION]: [0, 1],
}
export const ElevationWinnersOffset: { [key in keyof typeof Elevation]: number[] } = {
  [Elevation.OASIS]: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [Elevation.PLAINS]: [33, 39, 0, 0, 0, 0, 0, 0, 0, 0],
  [Elevation.MESA]: [0, 2, 1, 1, 2, 0, 0, 0, 0, 0],
  [Elevation.SUMMIT]: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [Elevation.EXPEDITION]: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
}
export const ElevationRoundOffset: { [key in keyof typeof Elevation]: number } = {
  [Elevation.OASIS]: 0,
  [Elevation.PLAINS]: 72,
  [Elevation.MESA]: 7,
  [Elevation.SUMMIT]: 0,
  [Elevation.EXPEDITION]: 0,
}
export const ElevationPromoBanner: { [key in keyof typeof Elevation]: string | null } = {
  [Elevation.OASIS]: null,
  [Elevation.PLAINS]: null,
  [Elevation.MESA]: null,
  [Elevation.SUMMIT]: null,
  [Elevation.EXPEDITION]: null,
}
export const ElevationTotemNames: { [key in keyof typeof Elevation]: string[] } = {
  [Elevation.OASIS]: ['OTTER'],
  [Elevation.PLAINS]: ['TORTOISE', 'HARE'],
  [Elevation.MESA]: ['ZEBRA', 'FOX', 'OWL', 'CHEETAH', 'SCORPION'],
  [Elevation.SUMMIT]: [
    'RED PANDA',
    'BALD EAGLE',
    'ST BERNARD',
    'WOLF',
    'YETI',
    'FLAMINGO',
    'IBEX',
    'SNOW LEOPARD',
    'GORILLA',
    'ALPACA',
  ],
  [Elevation.EXPEDITION]: ['COSMIC BULL', 'COSMIC BEAR'],
}
export const ElevationInt: { [key in keyof typeof Elevation]: number } = {
  [Elevation.OASIS]: 0,
  [Elevation.PLAINS]: 1,
  [Elevation.MESA]: 2,
  [Elevation.SUMMIT]: 3,
  [Elevation.EXPEDITION]: 4,
}
export const ElevationRoundDuration: { [key in keyof typeof Elevation]: number } = {
  [Elevation.OASIS]: 0,
  [Elevation.PLAINS]: 3600 * 2,
  [Elevation.MESA]: 3600 * 4,
  [Elevation.SUMMIT]: 3600 * 8,
  [Elevation.EXPEDITION]: 3600 * 24,
}
export const elevationUtils = {
  all: AllElevations,
  oasisElevation: [Elevation.OASIS, Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT],
  elevationExpedition: [Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT, Elevation.EXPEDITION],
  elevationOnly: [Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT],
  isElevation: (elevation: string) => !!ElevationTitle[elevation],
  modalTitle: (elevation: string) => ElevationTitle[elevation as Elevation] || 'SUMMITDEFI.COM',
  elevationMultiplier: (elevation: Elevation) => ElevationMultiplier[elevation],
  header: (elevation: Elevation) => ElevationTitle[elevation],
  subHeader: (elevation: Elevation) => ElevationSubHeader[elevation],
  helpLink: (elevation: Elevation) => ElevationHelpLink[elevation],
  totemsArray: (elevation: Elevation) => ElevationTotems[elevation],
  getElevationTotemName: (elevation: Elevation, totem: number, asset = true) => {
    if (totem == null) return 'UNSELECTED'
    return ElevationTotemNames[elevation][totem].split(' ').join(asset ? '_' : ' ')
  },
  toInt: (elevation: Elevation) => ElevationInt[elevation],
  fromInt: (int): Elevation => {
    switch (int) {
      case 4:
        return Elevation.EXPEDITION
      case 3:
        return Elevation.SUMMIT
      case 2:
        return Elevation.MESA
      case 1:
        return Elevation.PLAINS
      default:
      case 0:
        return Elevation.OASIS
    }
  },
  elevationDataIndexToElevation: (int): Elevation => {
    switch (int) {
      case 3:
        return Elevation.EXPEDITION
      case 2:
        return Elevation.SUMMIT
      case 1:
        return Elevation.MESA
      default:
      case 0:
        return Elevation.PLAINS
    }
  },
  elevationToElevationDataIndex: (elevation: Elevation): number => {
    switch (elevation) {
      case Elevation.EXPEDITION:
        return 3
      case Elevation.SUMMIT:
        return 2
      case Elevation.MESA:
        return 1
      default:
      case Elevation.PLAINS:
        return 0
    }
  },
  getTotemIcon: (elevation: Elevation, totem: number) => {
    switch (elevation) {
      case Elevation.EXPEDITION:
        if (totem === 0) return 'totemBull'
        return 'totemBear'
      case Elevation.SUMMIT:
        switch (totem) {
          case 0:
            return 'totem'
          case 1:
            return 'totem'
          case 2:
            return 'totem'
          case 3:
            return 'totem'
          case 4:
            return 'totem'
          case 5:
            return 'totem'
          case 6:
            return 'totem'
          case 7:
            return 'totem'
          case 8:
            return 'totem'
          default:
          case 9:
            return 'totem'
        }
      case Elevation.MESA:
        switch (totem) {
          case 0:
            return 'totem'
          case 1:
            return 'totem'
          case 2:
            return 'totem'
          case 3:
            return 'totem'
          default:
          case 4:
            return 'totem'
        }
      default:
      case Elevation.OASIS:
        if (totem === 0) return 'totemPEPE'
        return 'totemHare'
    }
  },
  backgroundColor: (elevation: Elevation, theme): string => {
    switch (elevation) {
      case Elevation.EXPEDITION:
        return theme.colors.EXPEDITION
      case Elevation.SUMMIT:
        return theme.colors.SUMMIT
      case Elevation.MESA:
        return theme.colors.MESA
      case Elevation.PLAINS:
        return theme.colors.PLAINS
      case Elevation.OASIS:
        return theme.colors.OASIS
      default:
        return theme.colors.text
    }
  },
  unlockString: (elevation: Elevation): string => {
    switch (elevation) {
      case Elevation.EXPEDITION:
        return 'The Expedition begins on day 13'
      case Elevation.SUMMIT:
        return 'The Summit will unlock on day 5'
      case Elevation.MESA:
        return 'The Mesa will unlock on day 3'
      case Elevation.PLAINS:
        return 'The Plains will unlock at the next top of the hour following launch'
      default:
        return ''
    }
  },
  allocMultiplier: (elevation: Elevation): number => {
    switch (elevation) {
      case Elevation.SUMMIT:
        return 1.5
      case Elevation.MESA:
        return 1.25
      case Elevation.PLAINS:
        return 1.1
      default:
        return 1
    }
  },
}

export enum QuoteToken {
  BNB = 'BNB',
  SUMMIT = 'SUMMIT',
  BUSD = 'BUSD',
  UST = 'UST',
}

export interface Address {
  56?: string // bsc
  97?: string // bsc testnet
  250?: string // ftm
  4002?: string // ftm testnet
}

export interface Token {
  symbol: string
  address?: Address
  decimals?: number
  projectLink?: string
}

export interface MultiElevAllocationConfig {
  elevationPids: {
    [Elevation.OASIS]: number | null
    [Elevation.PLAINS]: number | null
    [Elevation.MESA]: number | null
    [Elevation.SUMMIT]: number | null
  }
  allocation: number
}

export interface MultiElevFarmConfig {
  elevationPids: {
    [Elevation.OASIS]: number | null
    [Elevation.PLAINS]: number | null
    [Elevation.MESA]: number | null
    [Elevation.SUMMIT]: number | null
  }
  symbol: string
  altName?: string
  lpAddress: string
  tokenAddress: string
  allocation: number
  isTokenOnly?: boolean

  quoteInNativeToken: boolean

  passthroughStrategy?: string
  getUrl?: string
  farmComment?: string | {
    [Elevation.OASIS]?: string
    [Elevation.PLAINS]?: string
    [Elevation.MESA]?: string
    [Elevation.SUMMIT]?: string
  }
  farmWarning?: string | {
    [Elevation.OASIS]?: string
    [Elevation.PLAINS]?: string
    [Elevation.MESA]?: string
    [Elevation.SUMMIT]?: string
  }
  assetType: TokenAssetType
  balancer3PoolPid?: string
}

export interface FarmConfig {
  pid: number
  elevation: Elevation
  symbol: string
  lpAddress: string
  isTokenOnly: boolean
  tokenAddress: string

  quoteInNativeToken: boolean
  allocation: BigNumber

  passthroughStrategy?: string
  farmComment?: string
  farmWarning?: string
  
  assetType: TokenAssetType
  balancer3PoolPid?: string
}

export interface ExpeditionConfig {
  pid: number
  rewardToken: Token
  live: boolean
  sortOrder?: number
  disbursedOffset: number
  bonusRewardsRemaining?: number
}

export enum RevertReasonOutput {
  Bad_withdrawal = 'Attempted_to_withdraw_zero,_or_more_than_you_have_staked.',
  Already_been_referred = 'You_have_already_entered_a_referral_address',
  No_reciprocal_referrals = 'You_can\'t_refer_the_user_user_that_referred_you',
  Referral_burn_not_available = 'The_Referral_Burn_isn\'t_available_yet',
  Cant_refer_yourself = 'You_can\'t_refer_yourself',
  No_referral_rewards_to_redeem = 'You_don\'t_have_any_referral_rewards_to_redeem',
  Invalid_elev = 'Transaction_was_attempted_on_an_invalid_elevation',
  Pool_not_launched_yet = 'This_farm_hasn\'t_been_launched_yet',
  Elevation_locked = 'This_elevation_has_not_yet_unlocked',
  Cant_switch_totem_during_deposit = 'You_tried_to_make_a_deposit_with_a_different_totem',
  Invalid_totem = 'Transaction_was_attempted_on_an_invalid_totem',
  Elev_locked_until_rollover = 'The_Elevation_is_locked_until_the_round_is_rolled_over',
  Must_change_elev = 'You_can\'t_elevate_within_the_same_elevation',
  No_exped_elev_switch = 'This_token_cannot_be_elevated_into_the_Expedition',
  Transfer_non_zero_amount = 'Elevate_transactions_must_have_non_Zero_transfer_amounts',
  Bad_transfer = 'Elevate_transaction_had_invalid_parameters',
  Cant_switch_totem_during_elevate = 'You_can\'t_switch_your_totem_during_an_Elevate',
  Different_token = 'The_token_is_different_between_the_Source_and_Target_Farms',
  Totem_must_be_different = 'Totem_must_be_different',
}

export const RevertReasonMap = {
  Bad_withdrawal: RevertReasonOutput.Bad_withdrawal,
  Already_been_referred: RevertReasonOutput.Already_been_referred,
  No_reciprocal_referrals: RevertReasonOutput.No_reciprocal_referrals,
  Referral_burn_not_available: RevertReasonOutput.Referral_burn_not_available,
  Cant_refer_yourself: RevertReasonOutput.Cant_refer_yourself,
  No_referral_rewards_to_redeem: RevertReasonOutput.No_referral_rewards_to_redeem,
  Invalid_elev: RevertReasonOutput.Invalid_elev,
  Pool_not_launched_yet: RevertReasonOutput.Pool_not_launched_yet,
  Elevation_locked: RevertReasonOutput.Elevation_locked,
  Cant_switch_totem_during_deposit: RevertReasonOutput.Cant_switch_totem_during_deposit,
  Invalid_totem: RevertReasonOutput.Invalid_totem,
  Elev_locked_until_rollover: RevertReasonOutput.Elev_locked_until_rollover,
  Must_change_elev: RevertReasonOutput.Must_change_elev,
  No_exped_elev_switch: RevertReasonOutput.No_exped_elev_switch,
  Transfer_non_zero_amount: RevertReasonOutput.Transfer_non_zero_amount,
  Bad_transfer: RevertReasonOutput.Bad_transfer,
  Cant_switch_totem_during_elevate: RevertReasonOutput.Cant_switch_totem_during_elevate,
  Different_token: RevertReasonOutput.Different_token,
  Totem_must_be_different: RevertReasonOutput.Totem_must_be_different,
}

export const IsSummitRevertReason = {
  [RevertReasonOutput.Bad_withdrawal]: true,
  [RevertReasonOutput.Already_been_referred]: true,
  [RevertReasonOutput.No_reciprocal_referrals]: true,
  [RevertReasonOutput.Referral_burn_not_available]: true,
  [RevertReasonOutput.Cant_refer_yourself]: true,
  [RevertReasonOutput.No_referral_rewards_to_redeem]: true,
  [RevertReasonOutput.Invalid_elev]: true,
  [RevertReasonOutput.Pool_not_launched_yet]: true,
  [RevertReasonOutput.Elevation_locked]: true,
  [RevertReasonOutput.Cant_switch_totem_during_deposit]: true,
  [RevertReasonOutput.Invalid_totem]: true,
  [RevertReasonOutput.Elev_locked_until_rollover]: true,
  [RevertReasonOutput.Must_change_elev]: true,
  [RevertReasonOutput.No_exped_elev_switch]: true,
  [RevertReasonOutput.Transfer_non_zero_amount]: true,
  [RevertReasonOutput.Bad_transfer]: true,
  [RevertReasonOutput.Cant_switch_totem_during_elevate]: true,
  [RevertReasonOutput.Different_token]: true,
  [RevertReasonOutput.Totem_must_be_different]: true,
}
