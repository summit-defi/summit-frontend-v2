import BigNumber from "bignumber.js"
import { BN_ZERO } from "config/constants"
import { chunk } from "lodash"
import { Epoch } from "state/types"
import { retryableMulticall, abi, getSummitLockingAddress, getEverestTokenAddress } from "utils"

export const fetchEverestData = async (account: string) => {
    const everestAddress = getEverestTokenAddress()
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
            name: 'userEverestInfo',
            params: [account]
        },
    ]

    const res = await retryableMulticall(
        abi.everestToken,
        calls,
        'fetchEverestData'
    )

    if (res == null) return {
        totalSummitLocked: BN_ZERO,
        averageLockDuration: 0,
    }

    return {
        totalSummitLocked: new BigNumber(res[0][0]._hex),
        averageLockDuration: new BigNumber(res[1][0]._hex).toNumber(),
        userData: {
            everestOwned: new BigNumber(res[2].everestOwned._hex),
            summitLocked: new BigNumber(res[2].summitLocked._hex),
            lockRelease: new BigNumber(res[2].lockRelease._hex).toNumber(),
            lockDuration: new BigNumber(res[2].lockDuration._hex).toNumber(),
            everestLockMult: new BigNumber(res[2].everestLockMultiplier._hex).toNumber(),
        }
    }
}