import { useCallback, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import { fetchExpeditionUserDataAsync } from 'state/actions'
import { useExpedition } from './useContract'
import { useTransactionToasts } from './useToast'
import { fetchUserEpochsAsync } from 'state/glacier'
import { harvestExpedition } from 'utils'

const useHarvestExpedition = () => {
  const dispatch = useDispatch()
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useTransactionToasts()
  const { account } = useWallet()
  const expedition = useExpedition()

  const handleHarvestExpedition = useCallback(
    async () => {
      try {
        setPending(true)
        await harvestExpedition(expedition, account)
        toastSuccess(`Expedition Harvested`)
      } catch (error) {
        toastError(`Error Harvesting Expedition`, (error as Error).message)
      } finally {
        setPending(false)
        dispatch(fetchUserEpochsAsync(account))
        dispatch(fetchExpeditionUserDataAsync(account))
      }
    },
    [account, dispatch, expedition, setPending, toastSuccess, toastError],
  )

  return { onHarvestExpedition: handleHarvestExpedition, pending }
}

export default useHarvestExpedition
