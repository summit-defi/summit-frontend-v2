import { Elevation, FarmConfig, TokenAssetType } from "config/constants/types"
import { FarmType } from "state/types"

export const getFarmToken = ({
    assetType,
    tokenAddress,
    lpAddress
} : {
    assetType: TokenAssetType,
    tokenAddress?: string,
    lpAddress?: string,
}) => {
    switch (assetType) {
        case TokenAssetType.LP: return lpAddress
        case TokenAssetType.Stablecoin:
        case TokenAssetType.SingleAsset:
        case TokenAssetType.WrappedNative:
        case TokenAssetType.Balancer2Pool:
        case TokenAssetType.BalancerMultiPool:
        default: return tokenAddress
    }
}
export const getFarmType = ({
    assetType,
} : {
    assetType: TokenAssetType,
}) => {
    switch (assetType) {
        case TokenAssetType.LP: return FarmType.LP
        case TokenAssetType.Stablecoin:
        case TokenAssetType.SingleAsset:
        case TokenAssetType.WrappedNative:
        case TokenAssetType.Balancer2Pool:
        case TokenAssetType.BalancerMultiPool:
        default: return FarmType.Token
    }
}

export const getFarmAllElevationsIterable = (farmConfigs: FarmConfig[]) => {
    return farmConfigs.map((farm) => {
        return Object.keys(farm.elevations).map((elevation) => ({
            symbol: farm.symbol,
            farmToken: farm.farmToken,
            elevation: elevation as Elevation,
        }))
    }).flat()
}
export const getFarmOnlyElevationsIterable = (farmConfigs: FarmConfig[]) => {
    return farmConfigs.map((farm) => {
        return Object.keys(farm.elevations)
            .filter((elevation) => elevation !== Elevation.OASIS)
            .map((elevation) => ({
                symbol: farm.symbol,
                farmToken: farm.farmToken,
                elevation: elevation as Elevation,
            }))
    }).flat()
}