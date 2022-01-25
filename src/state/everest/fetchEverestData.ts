import BigNumber from "bignumber.js"
import { BN_ZERO } from "config/constants"
import { retryableMulticall, abi, getEverestTokenAddress, getSummitTokenAddress } from "utils"

export const fetchEverestData = async (account: string) => {
    const everestAddress = getEverestTokenAddress()
    const summitAddress = getSummitTokenAddress()
    const calls = [
        {
            address: everestAddress,
            name: 'totalSummitLocked'
        },
        {
            address: everestAddress,
            name: 'avgSummitLockDuration'
        },
        {
            address: everestAddress,
            name: 'totalSupply'
        },
        {
            address: everestAddress,
            name: 'userEverestInfo',
            params: [account]
        },
    ]
    const allowanceCalls = [
        {
            address: summitAddress,
            name: 'balanceOf',
            params: [account]
        },
        {
            address: summitAddress,
            name: 'allowance',
            params: [account, everestAddress]
        },
        {
            address: everestAddress,
            name: 'balanceOf',
            params: [account]
        },
        {
            address: everestAddress,
            name: 'allowance',
            params: [account, everestAddress]
        },
    ]

    const [everestDataRes, allowancesRes] = await Promise.all([
        retryableMulticall(
            abi.everestToken,
            calls,
            'fetchEverestData'
        ),
        retryableMulticall(
            abi.ERC20,
            allowanceCalls,
            'fetchEverestAllowances'
        )
    ])

    if (everestDataRes == null) return {
        totalSummitLocked: BN_ZERO,
        averageLockDuration: 0,
        everestSupply: BN_ZERO
    }

    const allowances = allowancesRes == null ? {
        summitBalance: BN_ZERO,
        summitAllowance: BN_ZERO,
        everestBalance: BN_ZERO,
        everestAllowance: BN_ZERO,
    } : {
        summitBalance: new BigNumber(allowancesRes[0][0]._hex),
        summitAllowance: new BigNumber(allowancesRes[1][0]._hex),
        everestBalance: new BigNumber(allowancesRes[2][0]._hex),
        everestAllowance: new BigNumber(allowancesRes[3][0]._hex),
    }

    return {
        totalSummitLocked: new BigNumber(everestDataRes[0][0]._hex),
        averageLockDuration: Math.round(new BigNumber(everestDataRes[1][0]._hex).toNumber() / (24 * 3600)),
        everestSupply: new BigNumber(everestDataRes[2][0]._hex),
        userData: {
            everestOwned: new BigNumber(everestDataRes[3].everestOwned._hex),
            summitLocked: new BigNumber(everestDataRes[3].summitLocked._hex),
            lockRelease: new BigNumber(everestDataRes[3].lockRelease._hex).toNumber(),
            lockDuration: Math.round(new BigNumber(everestDataRes[3].lockDuration._hex).toNumber() / (24 * 3600)),
            everestLockMult: new BigNumber(everestDataRes[3].everestLockMultiplier._hex).toNumber(),
            ...allowances,
        }
    }
}