import {
  retryableMulticall,
  abi,
  getExpeditionAddress,
} from 'utils/'
import BigNumber from 'bignumber.js'

export const fetchExpeditionUserData = async (account) => {
  const call = ({
    address: getExpeditionAddress(),
    name: 'userExpeditionInfo',
    params: [account],
  })

  const res = await retryableMulticall(abi.expedition, [call], 'fetchExpeditionUserData')
  if (res == null) return null

  const rawUserData = res[0]

  return {
    everestOwned: new BigNumber(rawUserData.everestOwned._hex),
  
    deity: rawUserData.deitySelected ? rawUserData.deity : null,
    deitySelectionRound: new BigNumber(rawUserData.deitySelectionRound._hex),
    faithFactor: rawUserData.safetyFactorSelected ? rawUserData.safetyFactor : null,
  
    entered: rawUserData.entered,
  
    summitLifetimeWinnings: new BigNumber(rawUserData.summit.lifetimeWinnings._hex),
    usdcLifetimeWinnings: new BigNumber(rawUserData.usdc.lifetimeWinnings._hex),
  }
}

export const fetchExpeditionWinnings = async (account) => {
  const call = ({
    address: getExpeditionAddress(),
    name: 'rewards',
    params: [account],
  })

  const res = await retryableMulticall(abi.expedition, [call], 'fetchExpeditionWinnings')

  if (res == null) return {
    summitWinnings: new BigNumber(0),
    usdcWinnings: new BigNumber(0),
  }

  return {
    summitWinnings: new BigNumber(res[0][0]._hex),
    usdcWinnings: new BigNumber(res[0][1]._hex),
  }
}

export const fetchExpeditionPotentialWinnings = async (account) => {
  const call = ({
    address: getExpeditionAddress(),
    name: 'potentialWinnings',
    params: [account],
  })

  const res = await retryableMulticall(abi.expedition, [call], 'fetchExpeditionPotentialWinnings')

  if (res == null) return {
    guaranteedSummit: new BigNumber(0),
    guaranteedUsdc: new BigNumber(0),
    potentialSummitWinnings: new BigNumber(0),
    potentialUsdcWinnings: new BigNumber(0),
  }

  return {
    guaranteedSummit: new BigNumber(res[0][0]._hex),
    guaranteedUsdc: new BigNumber(res[0][1]._hex),
    potentialSummitWinnings: new BigNumber(res[0][2]._hex),
    potentialUsdcWinnings: new BigNumber(res[0][3]._hex),
  }
}
