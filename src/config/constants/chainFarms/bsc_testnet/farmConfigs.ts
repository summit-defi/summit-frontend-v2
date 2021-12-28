import { MultiElevAllocationConfig } from '../../types'
import { BscTestnetTokenSymbol } from './tokens'

const baseElevations = {
  OASIS: { exists: true, live: true },
  PLAINS: { exists: true, live: true },
  MESA: { exists: true, live: true },
  SUMMIT: { exists: true, live: true },
}

export const farmConfigs: { [key: string]: MultiElevAllocationConfig } = {
  [BscTestnetTokenSymbol.SUMMIT]: {
    allocation: 1500,
    taxBP: 700,
    depositFeeBP: 100,
    native: true,
    elevationsExistAndLive: baseElevations,
  },
  [BscTestnetTokenSymbol.EVEREST]: {
    allocation: 2000,
    taxBP: 0,
    depositFeeBP: 0,
    native: true,
    elevationsExistAndLive: baseElevations,
  },
  [BscTestnetTokenSymbol.CAKE]: {
    allocation: 300,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevationsExistAndLive: baseElevations,
  },
  [BscTestnetTokenSymbol.BIFI]: {
    allocation: 200,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevationsExistAndLive: baseElevations,
  },
  [BscTestnetTokenSymbol.USDC]: {
    allocation: 100,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevationsExistAndLive: baseElevations,
  },
  [BscTestnetTokenSymbol.GS0]: {
    allocation: 50,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevationsExistAndLive: baseElevations,
  },
  [BscTestnetTokenSymbol.GS1]: {
    allocation: 50,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevationsExistAndLive: baseElevations,
  },
  [BscTestnetTokenSymbol.GS2]: {
    allocation: 50,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevationsExistAndLive: baseElevations,
  },
  [BscTestnetTokenSymbol.GS3]: {
    allocation: 50,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevationsExistAndLive: baseElevations,
  },
  [BscTestnetTokenSymbol.GS4]: {
    allocation: 50,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevationsExistAndLive: baseElevations,
  },
  [BscTestnetTokenSymbol.GS5]: {
    allocation: 50,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevationsExistAndLive: baseElevations,
  },
}
