import { TokenAssetType } from "state/types"

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
        case TokenAssetType.Stablecoin:
        case TokenAssetType.SingleAsset:
        case TokenAssetType.WrappedNative:
        case TokenAssetType.Balancer2Pool:
        case TokenAssetType.BalancerMultiPool: return tokenAddress
        case TokenAssetType.LP: return lpAddress
    }
}