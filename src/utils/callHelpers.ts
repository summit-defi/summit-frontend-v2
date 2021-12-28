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

export const stake = async (cartographer, token, elevation, amount, account, decimals) => {
  const stakeCall = cartographer.methods.deposit(
    token,
    elevation,
    new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString(),
  )
  return estimateGasAndExecute(stakeCall, account)
}

export const withdraw = async (cartographer, token, elevation, amount, account, decimals) => {
  const unstakeCall = cartographer.methods.withdraw(
    token,
    elevation,
    new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString(),
  )
  return estimateGasAndExecute(unstakeCall, account)
}

export const claimPool = async (cartographer, token, elevation, account) => {
  const claimCall = cartographer.methods.deposit(token, elevation, '0')
  return estimateGasAndExecute(claimCall, account)
}

export const claimElevation = async (cartographer, elevation, account) => {
  const harvestCall = cartographer.methods.claimElevation(elevation)
  return estimateGasAndExecute(harvestCall, account)
}

export const switchTotem = async (cartographer, elevation, totem, account) => {
  const switchTotemCall = cartographer.methods.switchTotem(elevation, totem)
  return estimateGasAndExecute(switchTotemCall, account)
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
