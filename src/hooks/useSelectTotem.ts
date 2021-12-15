import { useCallback, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import { updateUserTotemAsync } from 'state/actions'
import { Elevation, elevationUtils, RevertReasonOutput } from 'config/constants/types'
import { useElevationTotems, useElevationTotemsLockedIn } from 'state/hooks'
import { setPendingExpeditionTx, updateUserTotem } from 'state/summitEcosystem'
import { switchTotem } from 'utils'
import useToast from './useToast'
import { useCartographer } from './useContract'

export const useSelectTotem = () => {
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const dispatch = useDispatch()
  const { account }: { account: string } = useWallet()
  const totems = useElevationTotems()
  const totemsLockedIn = useElevationTotemsLockedIn()
  const cartographer = useCartographer()

  const handleSelectTotem = useCallback(
    async (elevation: Elevation, totem: number) => {
      if (totems[elevation] === totem) {
        return null
      }
      // if (totemsLockedIn[elevationUtils.toInt(elevation)]) {
        try {
          setPending(true)
          if (elevation === Elevation.EXPEDITION) dispatch(setPendingExpeditionTx(true))
          await switchTotem(cartographer, elevationUtils.toInt(elevation), totem, account)
          toastSuccess(`Totem Switched`)
          if (elevation === Elevation.EXPEDITION) dispatch(setPendingExpeditionTx(false))
          setPending(false)
          dispatch(updateUserTotemAsync(elevation, account))
        } catch (error) {
          if ((error as Error).message === RevertReasonOutput.Totem_must_be_different || (error as Error).message === RevertReasonOutput.Invalid_elev) {
            dispatch(updateUserTotem(elevation, totem))
            setPending(false)
            if (elevation === Elevation.EXPEDITION) dispatch(setPendingExpeditionTx(false))
          } else {
            toastError(`Totem Switch Failed`, (error as Error).message)
            setPending(false)
            if (elevation === Elevation.EXPEDITION) dispatch(setPendingExpeditionTx(false))
            dispatch(updateUserTotemAsync(elevation, account))
          }
        }
      // } else {
      //   toastSuccess(totem == null ? 'Totem Selected' : `Totem Switched`)
      //   // dispatch(updateUserTotemAsync(elevation, account))
      //   dispatch(updateUserTotem(elevation, totem))
      // }
      return null
    },
    [cartographer, account, dispatch, totems, setPending, toastSuccess, toastError],
  )

  return { pending, onSelectTotem: handleSelectTotem }
}
