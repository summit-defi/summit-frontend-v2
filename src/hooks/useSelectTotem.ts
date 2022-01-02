import { useCallback, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import { fetchUserTotemsAsync } from 'state/actions'
import { Elevation, elevationUtils } from 'config/constants/types'
import { switchTotem } from 'utils'
import useToast from './useToast'
import { useCartographer } from './useContract'

export const useSelectTotem = () => {
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const dispatch = useDispatch()
  const { account }: { account: string } = useWallet()
  const cartographer = useCartographer()

  const handleSelectTotem = useCallback(
    async (elevation: Elevation, totem: number) => {
      try {
        setPending(true)
        await switchTotem(cartographer, elevation, totem, account)
        toastSuccess(`${elevation} ${elevationUtils.getElevationTotemName(elevation, totem)} Totem Selected`)
      } catch (error) {
        toastError(`${elevation} Totem Selection Failed`, (error as Error).message)
      } finally {
        setPending(false)
        dispatch(fetchUserTotemsAsync(account))
      }
      return null
    },
    [cartographer, account, dispatch, setPending, toastSuccess, toastError],
  )

  return { pending, onSelectTotem: handleSelectTotem }
}
