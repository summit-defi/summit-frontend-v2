import BigNumber from 'bignumber.js'
import { Elevation, elevationUtils, RevertReasonMap } from 'config/constants/types'
import { ethers } from 'ethers'

export enum RevertType {
  SUMMIT = 'SUMMIT',
  WALLET = 'WALLET',
}
export class RevertError extends Error {
  constructor(msg) {
    super(msg)

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, RevertError.prototype)
  }
}

const extractRevertMsg = (err) => {
  const rawRevertMessage = err.message.split('execution reverted: ')[1].split(',')[0].slice(0, -1)
  const mappedRevertMessage = RevertReasonMap[rawRevertMessage.split(' ').join('_')]
  return mappedRevertMessage != null ? mappedRevertMessage : rawRevertMessage
}

const estimateGasAndExecute = async (call, account) => {
  return call
    .estimateGas({ from: account })
    .catch((err) => {
      throw new RevertError(extractRevertMsg(err))
    })
    .then(() => {
      return call.send({ from: account }).on('transactionHash', (tx) => tx.transactionHash)
    })
}

export const approve = async (tokenContract, targetAddress, account) => {
  const approveCall = tokenContract.methods.approve(targetAddress, ethers.constants.MaxUint256)
  return estimateGasAndExecute(approveCall, account)
}

export const betaTokenMint = async (tokenContract, amount, account, decimals) => {
  const betaTokenMintCall = tokenContract.methods.mint(
    account,
    new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString(),
  )
  return estimateGasAndExecute(betaTokenMintCall, account)
}

export const stake = async (cartographer, token, elevation, amount, account, decimals) => {
  const stakeCall = cartographer.methods.deposit(
    token,
    elevationUtils.toInt(elevation),
    new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString(),
  )
  return estimateGasAndExecute(stakeCall, account)
}

export const withdraw = async (cartographer, token, elevation, amount, account, decimals) => {
  const unstakeCall = cartographer.methods.withdraw(
    token,
    elevationUtils.toInt(elevation),
    new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString(),
  )
  return estimateGasAndExecute(unstakeCall, account)
}

export const claimPool = async (cartographer, token, elevation, account) => {
  const claimCall = cartographer.methods.deposit(token, elevationUtils.toInt(elevation), '0')
  return estimateGasAndExecute(claimCall, account)
}

export const claimElevation = async (cartographer, elevation, account) => {
  const claimCall = cartographer.methods.claimElevation(elevationUtils.toInt(elevation))
  return estimateGasAndExecute(claimCall, account)
}

export const selectTotemAndOrFaith = async (cartographer, expedition, elevation, totem, faith, account) => {
  const isExpedition = elevation === Elevation.EXPEDITION
  let call
  if (isExpedition) {
    if (totem != null && faith != null) {
      call = expedition.methods.selectDeityAndSafetyFactor(totem, 100 - faith)
    } else if (totem != null) {
      call = expedition.methods.selectDeity(totem)
    } else if (faith != null) {
      call = expedition.methods.selectSafetyFactor(100 - faith)
    }
  } else {
    call = cartographer.methods.switchTotem(elevationUtils.toInt(elevation), totem)
  }
  return estimateGasAndExecute(call, account)
}

export const enterExpedition = async (expedition, account) => {
  const call = expedition.methods.joinExpedition()
  return estimateGasAndExecute(call, account)
}
export const harvestExpedition = async (expedition, account) => {
  const call = expedition.methods.harvestExpedition()
  return estimateGasAndExecute(call, account)
}

export const elevate = async (cartographer, token, sourceElevation, targetElevation, amount, account, decimals) => {
  const elevateCall = cartographer.methods.elevate(
    token,
    elevationUtils.toInt(sourceElevation),
    elevationUtils.toInt(targetElevation),
    new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString()
  )
  return estimateGasAndExecute(elevateCall, account)
}

// V1 --> V2 Token swap
export const tokenSwapV1Summit = async (summitToken, v1SummitBalance, account) => {
  const switchTotemCall = summitToken.methods.tokenSwap(
    new BigNumber(v1SummitBalance).times(new BigNumber(10).pow(18)).toString()
  )
  return estimateGasAndExecute(switchTotemCall, account)
}

// EPOCH
export const harvestEpoch = async (summitGlacier, epochIndex, amount, lockForEverest, account) => {
  const harvestEpochCall = summitGlacier.methods.harvestWinnings(
    epochIndex,
    new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    lockForEverest
  )
  return estimateGasAndExecute(harvestEpochCall, account)
}

// EVEREST LOCKING
export const lockSummit = async (everestToken, amount, duration, account) => {
  const lockSummitCall = everestToken.methods.lockSummit(
    amount,
    duration
  )
  return estimateGasAndExecute(lockSummitCall, account)
}
export const increaseLockedSummit = async (everestToken, amount, account) => {
  const increaseLockedSummitCall = everestToken.methods.increaseLockedSummit(
    amount
  )
  return estimateGasAndExecute(increaseLockedSummitCall, account)
}
export const increaseLockDuration = async (everestToken, duration, account) => {
  const increaseLockDurationCall = everestToken.methods.increaseLockDuration(
    duration
  )
  return estimateGasAndExecute(increaseLockDurationCall, account)
}
export const withdrawLockedSummit = async (everestToken, amount, account) => {
  const withdrawLockedSummitCall = everestToken.methods.withdrawLockedSummit(
    new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()
  )
  return estimateGasAndExecute(withdrawLockedSummitCall, account)
}
export const lockFarmSummitForEverest = async (cartographer, sourceElevation, amount, account) => {
  const call = cartographer.methods.elevateAndLockStakedSummit(
    elevationUtils.toInt(sourceElevation),
    new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
  )
  return estimateGasAndExecute(call, account)
}

// SUMMIT ECOSYSTEM
export const rolloverElevation = async (cartographer, elevation, account) => {
  const rolloverElevationCall = cartographer.methods.rollover(elevationUtils.toInt(elevation))
  return estimateGasAndExecute(rolloverElevationCall, account)
}
export const rolloverExpedition = async (expedition, account) => {
  const rolloverCall = expedition.methods.rollover()
  return estimateGasAndExecute(rolloverCall, account)
}

// WRAPPER TO RETRY TRANSACTIONS
export const retryDecorator = (decoratee, retryCount = 4) => {
  return (...args) => {
    return new Promise((fulfill) => {
      const reasons = []

      const makeCall = () => {
        decoratee(...args).then(fulfill, (reason) => {
          const retry = reasons.length < retryCount
          reasons.push(reason)
          if (retry) makeCall()
          else fulfill({ err: reasons })
        })
      }

      makeCall()
    })
  }
}
