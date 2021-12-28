import { TokenSymbol } from 'config/constants/tokens'
import { MultiElevAllocationConfig } from '../../types'

const baseElevations = {
  OASIS: { exists: true, live: true },
  PLAINS: { exists: true, live: true },
  MESA: { exists: true, live: true },
  SUMMIT: { exists: true, live: true },
}

export const farmConfigs: { [key: string]: MultiElevAllocationConfig } = {
  [TokenSymbol.SUMMIT]: {
    allocation: 1500,
    taxBP: 700,
    depositFeeBP: 100,
    native: true,
    elevationsExistAndLive: baseElevations,
  },
  [TokenSymbol.EVEREST]: {
    allocation: 2000,
    taxBP: 0,
    depositFeeBP: 0,
    native: true,
    elevationsExistAndLive: baseElevations,
  },
  [TokenSymbol.CAKE]: {
    allocation: 300,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevationsExistAndLive: baseElevations,
  },
  [TokenSymbol.BIFI]: {
    allocation: 200,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevationsExistAndLive: baseElevations,
  },
  [TokenSymbol.USDC]: {
    allocation: 100,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevationsExistAndLive: baseElevations,
  },
  [TokenSymbol.GS0]: {
    allocation: 50,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevationsExistAndLive: baseElevations,
  },
  [TokenSymbol.GS1]: {
    allocation: 50,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevationsExistAndLive: baseElevations,
  },
  [TokenSymbol.GS2]: {
    allocation: 50,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevationsExistAndLive: baseElevations,
  },
  [TokenSymbol.GS3]: {
    allocation: 50,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevationsExistAndLive: baseElevations,
  },
  [TokenSymbol.GS4]: {
    allocation: 50,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevationsExistAndLive: baseElevations,
  },
  [TokenSymbol.GS5]: {
    allocation: 50,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevationsExistAndLive: baseElevations,
  },
}
