import { State } from "state/types";

// EXPEDITION
export const stateToExpeditionLoaded = (state: State) => state.expedition.expeditionLoaded
export const stateToExpeditionUserDataLoaded = (state: State) => state.expedition.userDataLoaded

// GLACIER
export const stateToCurrentEpochIndex = (state: State) => state.glacier.currentEpochIndex
export const stateToEpochs = (state: State) => state.glacier.epochs