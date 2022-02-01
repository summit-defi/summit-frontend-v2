import { createSelector } from "@reduxjs/toolkit"
import { Elevation, ElevationRoundDuration, ElevationUnlockDuration, elevationUtils, RoundLockTime } from "config/constants"
import { useSelector } from "./utils"
import { stateToElevationInfo, stateToElevationsInfos, stateToElevationUserTotem } from "./base"
import { useState, useEffect, useMemo } from "react"

export enum RoundStatus {
    NotYetUnlocked = 'NotYetUnlocked',
    UnlockAvailable = 'UnlockAvailable',
    Active = 'Active',
    RolloverLockout = 'RolloverLockout',
    RolloverAvailable = 'RolloverAvailable',
}

export const roundStatusFarmAllowsInteraction = (status: RoundStatus) => {
    return status === RoundStatus.Active
}

export const elevationLocked = (status: RoundStatus) => {
    return status === RoundStatus.NotYetUnlocked || status === RoundStatus.UnlockAvailable
} 

export const rolloverOrUnlockAvailable = (status: RoundStatus) => {
    return status === RoundStatus.UnlockAvailable || status === RoundStatus.RolloverAvailable
}



const useCurrentTimestamp = (): number => {
    const [timestamp, setTimestamp] = useState<number>(Math.floor(Date.now() / 1000))
    useEffect(() => {
        setTimestamp(Math.floor(Date.now() / 1000))
        const interval = setInterval(() => {
                setTimestamp(Math.floor(Date.now() / 1000))
        }, 1000)
        return () => clearInterval(interval)
    }, [])
    return timestamp
}



const selectElevationRoundEndTimestamps = createSelector(
    stateToElevationInfo,
    (elevationInfo) => (elevationInfo == null ? {
        unlockTimestamp: 0,
        roundEndTimestamp: 0,
        roundNumber: 0,
    } :
    {
        unlockTimestamp: elevationInfo.unlockTimestamp,
        roundEndTimestamp: elevationInfo.roundEndTimestamp,
        roundNumber: elevationInfo.roundNumber,
    })
)

export const useElevationRoundStatusAndProgress = (elevation: Elevation) => {
    const { unlockTimestamp, roundEndTimestamp, roundNumber } = useSelector((state) => selectElevationRoundEndTimestamps(state, elevation))
    const currentTimestamp = useCurrentTimestamp()
    
    return useMemo(
        () => {
            let endTimestamp
            let duration
            let status
            if (roundNumber === 0) {
                endTimestamp = unlockTimestamp
                duration = ElevationUnlockDuration[elevation]
                if (currentTimestamp >= unlockTimestamp) status = RoundStatus.UnlockAvailable
                else status = RoundStatus.NotYetUnlocked
            } else {
                endTimestamp = roundEndTimestamp
                duration = ElevationRoundDuration[elevation]
                if (currentTimestamp >= roundEndTimestamp) status = RoundStatus.RolloverAvailable
                else if (currentTimestamp >= (roundEndTimestamp - RoundLockTime)) status = RoundStatus.RolloverLockout
                else status = RoundStatus.Active
            }

            return {
                status,
                endTimestamp,
                duration,
                currentTimestamp,
                timeRemaining: Math.max(0, endTimestamp - currentTimestamp)
            }
        },
        [unlockTimestamp, roundEndTimestamp, currentTimestamp, roundNumber, elevation]
    )
}



const selectElevationsRoundEndTimestamps = createSelector(
    stateToElevationsInfos,
    (elevationsInfo) => {
        return elevationUtils.elevationExpedition.map((elev) => {
            const { unlockTimestamp, roundEndTimestamp, roundNumber } = elevationsInfo[elevationUtils.elevationToElevationDataIndex(elev)] || {
                unlockTimestamp: 0,
                roundEndTimestamp: 0,
                roundNumber: 0,
            }
            return {
                unlockTimestamp,
                roundEndTimestamp,
                roundNumber,
            }
        })
    }
)
export const useElevationsRoundStatuses = () => {
    const elevsRoundEndTimestamps = useSelector(selectElevationsRoundEndTimestamps)
    const currentTimestamp = useCurrentTimestamp()
    
    return useMemo(
        () => elevsRoundEndTimestamps.map(({ unlockTimestamp, roundEndTimestamp, roundNumber }) => {
            if (roundNumber === 0 && currentTimestamp >= unlockTimestamp) return RoundStatus.UnlockAvailable
            if (roundNumber === 0) return RoundStatus.NotYetUnlocked
            if (currentTimestamp >= roundEndTimestamp) return RoundStatus.RolloverAvailable
            if (currentTimestamp >= (roundEndTimestamp - RoundLockTime)) return RoundStatus.RolloverLockout
            return RoundStatus.Active
        }),
        [elevsRoundEndTimestamps, currentTimestamp]
    )
}

export const useElevationRoundStatus = (elevation: Elevation): RoundStatus => {
    const { status } = useElevationRoundStatusAndProgress(elevation)
    return useMemo(
        () => status,
        [status],
    )
}

export const useElevationInteractionsLocked = (elevation: Elevation) => {
    const roundStatus = useElevationRoundStatus(elevation)
    const userTotem = useSelector((state) => stateToElevationUserTotem(state, elevation))

    return useMemo(
        () => !roundStatusFarmAllowsInteraction(roundStatus) || userTotem === null,
        [roundStatus, userTotem]
    )
}

export const useElevationInteractionsLockedBreakdown = (elevation: Elevation) => {
    const roundStatus = useElevationRoundStatus(elevation)
    const userTotem = useSelector((state) => stateToElevationUserTotem(state, elevation))

    return useMemo(
        () => ({
            roundStatus,
            farmInteractionsLocked: !roundStatusFarmAllowsInteraction(roundStatus),
            totemNotSelected: userTotem === null,
        }),
        [roundStatus, userTotem]
    )
}