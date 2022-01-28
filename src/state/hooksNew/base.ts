import { BN_ZERO } from "config/constants";
import { State } from "state/types";

// EXPEDITION
export const stateToExpeditionLoaded = (state: State) => state.expedition.expeditionLoaded
export const stateToExpeditionUserDataLoaded = (state: State) => state.expedition.userDataLoaded
export const stateToExpeditionInfo = (state: State) => state.expedition.data
export const stateToExpeditionUserData = (state: State) => state.expedition.userData
export const stateToEnteredExpedition = (state: State) => state.expedition.userData.entered
export const stateToExpeditionSummitRoundEmission = (state: State) => state.expedition?.data?.summit?.roundEmission || BN_ZERO
export const stateToExpeditionUsdcRoundEmission = (state: State) => state.expedition?.data?.usdc?.roundEmission || BN_ZERO
export const stateToExpeditionSafeSupply = (state: State) => state.expedition?.data?.safeEverest || BN_ZERO
export const stateToExpeditionDeitiedSupply = (state: State) => state.expedition?.data?.deitiedEverest || BN_ZERO
export const stateToExpeditionDeitySupplies = (state: State) => state.expedition?.data?.deityEverest || [BN_ZERO, BN_ZERO]
export const stateToExpeditionSummitWinnings = (state: State) => state.expedition?.userData?.summitWinnings || BN_ZERO
export const stateToExpeditionUsdcWinnings = (state: State) => state.expedition?.userData?.usdcWinnings || BN_ZERO

// GLACIER
export const stateToCurrentEpochIndex = (state: State) => state.glacier.currentEpochIndex
export const stateToEpochs = (state: State) => state.glacier.epochs
export const stateToGlacierTotalFrozenSummit = (state: State) => state.glacier.totalFrozenSummit
export const stateToGlacierTotalThawedSummit = (state: State) => state.glacier.totalThawedSummit