import { useCallback } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import { fetchExpeditionUserDataAsync, fetchUserTotemsAsync } from 'state/actions'
import { Elevation, elevationUtils } from 'config/constants/types'
import { capitalizeFirstLetter, selectTotem } from 'utils'
import { useTransactionToasts } from './useToast'
import { useCartographer, useExpedition } from './useContract'
import { updatePendingTotemSelection } from 'state/summitEcosystem'

enum CallType {
  SelectTotem,
  SelectDeity,
  SelectSafetyFactor,
  SelectDeityAndSafetyFactor,
}

const getCallType = (elevation: Elevation, totem: number, faith: number): CallType => {
  if (elevation === Elevation.EXPEDITION) {
    if (totem != null && faith != null) return CallType.SelectDeityAndSafetyFactor
    if (totem != null) return CallType.SelectDeity
    return CallType.SelectSafetyFactor
  }
  return CallType.SelectTotem
}

const getCallTypeSuccessMsg = (callType: CallType, elevation: Elevation, totem: number): string => {
  const totemName = elevationUtils.getElevationTotemName(elevation, totem, false)
  switch (callType) {
    case CallType.SelectDeity: return `${totemName} Selected`
    case CallType.SelectSafetyFactor: return `FAITH Selected`
    case CallType.SelectDeityAndSafetyFactor: return `${totemName} and FAITH Selected`
    case CallType.SelectTotem: return `${capitalizeFirstLetter(elevation)} ${totemName} Totem Selected`
    default: return ''
  }
}
const getCallTypeErrorMsg = (callType: CallType, elevation: Elevation): string => {
  switch (callType) {
    case CallType.SelectDeity: return `Error Selecting DEITY`
    case CallType.SelectSafetyFactor: return `Error Selecting FAITH`
    case CallType.SelectDeityAndSafetyFactor: return `Error Selecting DEITY and FAITH`
    case CallType.SelectTotem: return `${capitalizeFirstLetter(elevation)} Totem Selection Failed`
    default: return ''
  }
}

export const useSelectTotemAndOrSafetyFactor = () => {
  const { toastSuccess, toastError } = useTransactionToasts()
  const dispatch = useDispatch()
  const { account }: { account: string } = useWallet()
  const cartographer = useCartographer()
  const expedition = useExpedition()

  const handleSelectTotem = useCallback(
    async (elevation: Elevation, totem: number | null, faith: number | null) => {
      const callType = getCallType(elevation, totem, faith)
      try {
        dispatch(updatePendingTotemSelection(true))
        await selectTotem(
          cartographer,
          expedition,
          elevation,
          totem,
          faith,
          account
        )
        toastSuccess(getCallTypeSuccessMsg(callType, elevation, totem))
      } catch (error) {
        toastError(getCallTypeErrorMsg(callType, elevation), (error as Error).message)
      } finally {
        dispatch(updatePendingTotemSelection(false))
        if (elevation === Elevation.EXPEDITION) {
          dispatch(fetchExpeditionUserDataAsync(account))
        } else {
          dispatch(fetchUserTotemsAsync(account))
        }
      }
      return null
    },
    [cartographer, expedition, account, dispatch, toastSuccess, toastError],
  )

  return { onSelectTotem: handleSelectTotem }
}
