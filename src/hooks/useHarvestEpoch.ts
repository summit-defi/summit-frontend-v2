import { useCallback, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync } from 'state/actions'
import { harvestEpoch } from 'utils'
import { useSummitLocking } from './useContract'
import useToast from './useToast'
import { fetchTokensUserDataAsync } from 'state/tokens'

export const useHarvestEpoch = (epochIndex: number) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const summitLocking = useSummitLocking()
  const [harvestEpochPending, setHarvestEpochPending] = useState(false)
  const { toastSuccess, toastError } = useToast()

  const handleHarvestEpoch = useCallback(
    async (amount: string, lockForEverest: boolean) => {
      try {
        setHarvestEpochPending(true)
        await harvestEpoch(summitLocking, epochIndex, amount, lockForEverest, account)
        toastSuccess(`Epoch ${lockForEverest ? 'Locked For EVEREST' : 'Harvested'}`)
      } catch (error) {
        toastError(`Error ${lockForEverest ? 'Locking Epoch For EVEREST' : 'Harvesting Epoch'}`, (error as Error).message)
      } finally {
        dispatch(fetchFarmUserDataAsync(account))
        dispatch(fetchTokensUserDataAsync(account))
        setHarvestEpochPending(false)
      }
    },
    [account, epochIndex, dispatch, summitLocking, setHarvestEpochPending, toastSuccess, toastError],
  )

  return { onHarvestEpoch: handleHarvestEpoch, harvestEpochPending }
}
