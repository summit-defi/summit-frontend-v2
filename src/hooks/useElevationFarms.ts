import { useWallet } from "@binance-chain/bsc-use-wallet"
import { useMemo } from "react"
import { useFarms } from "state/hooks"
import { useFarmType } from "./useFarmType"
import { partition } from 'lodash'
import { getFarmInteracting, getFarmType } from "utils/farmId"
import { FarmType } from "state/types"

export const useFilteredPartitionedFarms = () => {
    const farms = useFarms()
    const { farmType, liveFarms } = useFarmType()
    const { account }: { account: string } = useWallet()

    return useMemo(
        () => {
            // Filtered farms
            const filtered = farms.filter((farm) =>
                liveFarms === ((farm.allocation || 0) > 0) &&
                (farmType === FarmType.All || getFarmType(farm) === farmType)
            )

            return partition(
                filtered,
                (farm) => account && getFarmInteracting(farm)
            )
        },
        [farms, farmType, liveFarms, account]
    )
}
