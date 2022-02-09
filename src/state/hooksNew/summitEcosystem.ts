import { stateToSummitSwapMinimized, stateToElevationRolloversToShow } from "./base";
import { useSelector } from "./utils";

export const useSummitSwapMinimized = () => useSelector(stateToSummitSwapMinimized)
export const useElevationRolloversToShow = () => useSelector(stateToElevationRolloversToShow)