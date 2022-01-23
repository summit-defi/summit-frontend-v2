import { useCallback, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import { harvestEpoch } from 'utils'
import { useSummitLocking } from './useContract'
import { useTransactionToasts } from './useToast'
import { fetchUserEpochsAsync } from 'state/glacier'

export const useHarvestEpoch = (epochIndex: number) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const summitLocking = useSummitLocking()
  const [harvestEpochPending, setHarvestEpochPending] = useState(false)
  const { toastSuccess, toastError } = useTransactionToasts()

  const handleHarvestEpoch = useCallback(
    async (amount: string, lockForEverest: boolean) => {
      try {
        setHarvestEpochPending(true)
        await harvestEpoch(summitLocking, epochIndex, amount, lockForEverest, account)
        toastSuccess(`Epoch ${lockForEverest ? 'Locked For EVEREST' : 'Harvested'}`)
      } catch (error) {
        toastError(`Error ${lockForEverest ? 'Locking Epoch For EVEREST' : 'Harvesting Epoch'}`, (error as Error).message)
      } finally {
        dispatch(fetchUserEpochsAsync(account))
        setHarvestEpochPending(false)
      }
    },
    [account, epochIndex, dispatch, summitLocking, setHarvestEpochPending, toastSuccess, toastError],
  )

  return { onHarvestEpoch: handleHarvestEpoch, harvestEpochPending }
}
