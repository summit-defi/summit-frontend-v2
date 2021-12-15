import { MultiElevAllocationConfig } from '../../types'

export const farmPids: { [key: string]: MultiElevAllocationConfig } = {
  SUMMIT: {
    allocation: 1000,
    elevationPids: {
      OASIS: 1,
      PLAINS: 2,
      MESA: 3,
      SUMMIT: 4,
    },
  },
  'SUMMIT-FTM': {
    allocation: 1500,
    elevationPids: {
      OASIS: 5,
      PLAINS: 6,
      MESA: 7,
      SUMMIT: 8,
    },
  },
  'FTM-BOO': {
    allocation: 500,
    elevationPids: {
      OASIS: 17,
      PLAINS: 18,
      MESA: 19,
      SUMMIT: 20,
    },
  },
  'USDC-FTM': {
    allocation: 400,
    elevationPids: {
      OASIS: 21,
      PLAINS: 22,
      MESA: 23,
      SUMMIT: 24,
    },
  },
  'FTM-wETH': {
    allocation: 400,
    elevationPids: {
      OASIS: 25,
      PLAINS: 26,
      MESA: 27,
      SUMMIT: 28,
    },
  },
  'fUSDT-FTM': {
    allocation: 400,
    elevationPids: {
      OASIS: 29,
      PLAINS: 30,
      MESA: 31,
      SUMMIT: 32,
    },
  },
  'FTM-DAI': {
    allocation: 300,
    elevationPids: {
      OASIS: 33,
      PLAINS: 34,
      MESA: 35,
      SUMMIT: 36,
    },
  },
  'fUSDT-DAI-USDC': {
    allocation: 100,
    elevationPids: {
      OASIS: 37,
      PLAINS: 38,
      MESA: 39,
      SUMMIT: 40,
    },
  },
  USDC: {
    allocation: 100,
    elevationPids: {
      OASIS: 41,
      PLAINS: 42,
      MESA: 43,
      SUMMIT: 44,
    },
  },
  fUSDT: {
    allocation: 100,
    elevationPids: {
      OASIS: 45,
      PLAINS: 46,
      MESA: 47,
      SUMMIT: 48,
    },
  },
  DAI: {
    allocation: 100,
    elevationPids: {
      OASIS: 49,
      PLAINS: 50,
      MESA: 51,
      SUMMIT: 52,
    },
  },
  BIFI: {
    allocation: 100,
    elevationPids: {
      OASIS: 53,
      PLAINS: 54,
      MESA: 55,
      SUMMIT: 56,
    },
  },
  wFTM: {
    allocation: 100,
    elevationPids: {
      OASIS: 57,
      PLAINS: 58,
      MESA: 59,
      SUMMIT: 60,
    },
  },
  'TOMB-FTM': {
    allocation: 500,
    elevationPids: {
      OASIS: 9,
      PLAINS: 10,
      MESA: 11,
      SUMMIT: 12,
    },
  },
  'TSHARE-FTM': {
    allocation: 500,
    elevationPids: {
      OASIS: 13,
      PLAINS: 14,
      MESA: 15,
      SUMMIT: 16,
    },
  },
  "BOO": {
    allocation: 100,
    elevationPids: {
      OASIS: 61,
      PLAINS: 62,
      MESA: 63,
      SUMMIT: 64,
    }
  },
  "GRAND-ORCH": {
    allocation: 200,
    elevationPids: {
      OASIS: 65,
      PLAINS: 66,
      MESA: 67,
      SUMMIT: 68,
    }
  },
  "BeetXLP-MIM-USDC-USDT": {
    allocation: 200,
    elevationPids: {
      OASIS: 69,
      PLAINS: 70,
      MESA: 71,
      SUMMIT: 72,
    }
  },
  "BPT-BEETS-FTM": {
    allocation: 200,
    elevationPids: {
      OASIS: 73,
      PLAINS: 74,
      MESA: 75,
      SUMMIT: 76,
    }
  }
}
