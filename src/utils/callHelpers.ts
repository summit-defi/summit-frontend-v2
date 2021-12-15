import BigNumber from 'bignumber.js'
import { elevationUtils, RevertReasonMap } from 'config/constants/types'
import { ethers } from 'ethers'
import Web3 from 'web3'

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

export const approve = async (lpContract, targetCartographer, account) => {
  const approveCall = lpContract.methods.approve(targetCartographer.options.address, ethers.constants.MaxUint256)
  return estimateGasAndExecute(approveCall, account)
}

export const stake = async (cartographer, pid, amount, amountSummitLp, totem, account, decimals) => {
  const stakeCall = cartographer.methods.deposit(
    pid,
    new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString(),
    new BigNumber(amountSummitLp).times(new BigNumber(10).pow(decimals)).toString(),
    totem,
  )
  return estimateGasAndExecute(stakeCall, account)
}

export const unstake = async (cartographer, pid, amount, amountSummitLp, account, decimals) => {
  const unstakeCall = cartographer.methods.withdraw(
    pid,
    new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString(),
    new BigNumber(amountSummitLp).times(new BigNumber(10).pow(decimals)).toString(),
  )
  return estimateGasAndExecute(unstakeCall, account)
}

export const harvest = async (cartographer, pid, totem, account) => {
  const harvestCall = cartographer.methods.deposit(pid, '0', '0', totem)
  return estimateGasAndExecute(harvestCall, account)
}

export const crossCompound = async (cartographer, pid, totem, account) => {
  const crossCompoundCall = cartographer.methods.crossCompound(pid, totem)
  return estimateGasAndExecute(crossCompoundCall, account)
}

export const harvestElevation = async (cartographer, elevation, isCompound, account) => {
  const harvestElevationCall = cartographer.methods.harvestElevation(elevationUtils.toInt(elevation), isCompound)
  return estimateGasAndExecute(harvestElevationCall, account)
}

export const switchTotem = async (cartographer, elevation, totem, account) => {
  const switchTotemCall = cartographer.methods.switchTotem(elevation, totem)
  return estimateGasAndExecute(switchTotemCall, account)
}

export const elevate = async (cartographer, sourcePid, targetPid, amount, totem, token, account, decimals) => {
  const elevateCall = cartographer.methods.elevate(
    sourcePid,
    targetPid,
    new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString(),
    token,
    totem,
  )
  return estimateGasAndExecute(elevateCall, account)
}

// SUMMIT ECOSYSTEM
export const rolloverElevation = async (cartographer, elevation, account) => {
  const rolloverElevationCall = cartographer.methods.rollover(elevation)
  return estimateGasAndExecute(rolloverElevationCall, account)
}
export const burnReferralRewards = async (cartographer, account) => {
  const burnReferralCall = cartographer.methods.rolloverReferral()
  return estimateGasAndExecute(burnReferralCall, account)
}

// REFERRALS
export const createReferral = async (summitReferrals, referrerAddress, account) => {
  if (!Web3.utils.isAddress(referrerAddress)) {
    throw new RevertError('Invalid Address')
  }
  const createReferralCall = summitReferrals.methods.createReferral(referrerAddress)
  return estimateGasAndExecute(createReferralCall, account)
}

export const harvestReferralRewards = async (summitReferrals, account) => {
  const harvestReferralRewardsCall = summitReferrals.methods.redeemReferralRewards()
  return estimateGasAndExecute(harvestReferralRewardsCall, account)
}

// RECOVERY
export const recoverFunds = async (recoveryPassthroughContract, account) => {
  const recoverFundsCall = recoveryPassthroughContract.methods.recoverFunds()
  return estimateGasAndExecute(recoverFundsCall, account)
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
