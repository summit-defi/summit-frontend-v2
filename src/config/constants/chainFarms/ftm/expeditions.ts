// import contracts from "../../contracts"
import { PriceableTokenSymbol } from 'state/types'
import { ExpeditionConfig, Token } from '../../types'
import { expeditionPids } from "./expeditionPids"

const usdcToken: Token =  {
    symbol: PriceableTokenSymbol.USDC,
    address: {
        250: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    },
    decimals: 6,
    projectLink: 'https://spookyswap.finance/swap?outputCurrency=0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
}
const mimToken: Token =  {
    symbol: PriceableTokenSymbol.MIM,
    address: {
        250: '0x82f0b8b456c1a451378467398982d4834b6829c1',
    },
    decimals: 18,
    projectLink: 'https://spookyswap.finance/swap?outputCurrency=0x82f0b8b456c1a451378467398982d4834b6829c1',
}

const wftmToken: Token = {
    symbol: PriceableTokenSymbol.wFTM,
    address: {
        250: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    },
    decimals: 18,
    projectLink: 'https://spookyswap.finance/swap?outputCurrency=0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'
}

const usdcExpedition: ExpeditionConfig = {
    pid: expeditionPids[PriceableTokenSymbol.USDC],
    rewardToken: usdcToken,
    live: true,
    disbursedOffset: 350000,
}
const mimExpedition: ExpeditionConfig = {
    pid: expeditionPids[PriceableTokenSymbol.MIM],
    rewardToken: mimToken,
    live: true,
    disbursedOffset: 280000,
}
const wftmExpedition: ExpeditionConfig = {
    pid: expeditionPids[PriceableTokenSymbol.wFTM],
    rewardToken: wftmToken,
    live: true,
    disbursedOffset: 85000,
    bonusRewardsRemaining: 85000,
}

export const ftmExpeditions = (): ExpeditionConfig[] => [
    usdcExpedition,
    mimExpedition,
    wftmExpedition,
]
