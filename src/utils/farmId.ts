import { TokenAssetType } from "config/constants/types"

export const farmId = ({ elevation, symbol }) => {
    return `${elevation}_${symbol}`
}
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