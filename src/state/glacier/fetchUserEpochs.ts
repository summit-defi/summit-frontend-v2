import BigNumber from "bignumber.js"
import { chunk } from "lodash"
import { Epoch } from "state/types"
import { retryableMulticall, abi, getSummitLockingAddress } from "utils"

export const fetchUserEpochs = async (account: string) => {
    const summitLockingAddress = getSummitLockingAddress()
    const interactingEpochsRes = await retryableMulticall(abi.summitLocking, [{
        address: summitLockingAddress,
        name: 'getUserInteractingEpochs',
        params: [account],
    }, {
        address: summitLockingAddress,
        name: 'getCurrentEpoch'
    }], 'fetchUserInteractingEpochs')

    if (interactingEpochsRes == null) return []

    const interactingEpochs = interactingEpochsRes[0][0].map((epochIndex) => epochIndex.toNumber())
    const currentEpochIndex = new BigNumber(interactingEpochsRes[1][0]._hex).toNumber()

    const epochCalls = interactingEpochs.map((epochIndex) => [{
        address: summitLockingAddress,
        name: 'userLockedWinnings',
        params: [account, epochIndex],
    }, {
        address: summitLockingAddress,
        name: 'hasEpochMatured',
        params: [epochIndex]
    }]).flat()
    
    const epochsRes = await retryableMulticall(abi.summitLocking, epochCalls, "fetchUserEpochs")
    if (epochsRes == null) return []

    const chunkedRes = chunk(epochsRes, 2)

    return {
        currentEpochIndex,
        epochs: chunkedRes.map((resChunk, index): Epoch => ({
            index: interactingEpochs[index],
            frozenSummit: new BigNumber(resChunk[0].winnings._hex).minus(new BigNumber(resChunk[0].claimedWinnings._hex)),
            isThawed: resChunk[1][0]
        }))
    }
}