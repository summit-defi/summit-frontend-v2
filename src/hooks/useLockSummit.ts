import { useCallback, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import { harvestEpoch, increaseLockDuration, increaseLockedSummit, lockSummit } from 'utils'
import { useEverestToken } from './useContract'
import { useTransactionToasts } from './useToast'
import { fetchUserEpochsAsync } from 'state/glacier'
import { LockSummitButtonType } from 'state/types'
import BigNumber from 'bignumber.js'

export const useLockSummit = (type: LockSummitButtonType, summitAmount: BigNumber | null, duration: number | null) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const everestToken = useEverestToken()
  const [lockSummitPending, setLockSummitPending] = useState(false)
  const { toastSuccess, toastError } = useTransactionToasts()

  const handleLockSummit = useCallback(
    async () => {
      try {
        setLockSummitPending(true)
        const lockDurationSeconds = (duration || 0) * (3600 * 24)
        const summitAmountString = summitAmount.toString()
        switch (type) {
          case LockSummitButtonType.IncreaseLockedSummit:
            await increaseLockedSummit(everestToken, summitAmountString, account)
            toastSuccess(`Locked SUMMIT Amount Increased`)
            break
          case LockSummitButtonType.IncreaseLockDuration:
            await increaseLockDuration(everestToken, lockDurationSeconds, account)
            toastSuccess(`SUMMIT Lock Duration Increased`)
            break
          default:
          case LockSummitButtonType.LockSummit:
            await lockSummit(everestToken, summitAmountString, lockDurationSeconds, account)
            toastSuccess(`SUMMIT locked for EVEREST`)
            break
        }
      } catch (error) {
        switch (type) {
          case LockSummitButtonType.IncreaseLockedSummit:
            toastError(`Error Increasing Locked SUMMIT Amount`)
            break
          case LockSummitButtonType.IncreaseLockDuration:
            toastError(`Error Increasing SUMMIT Lock Duration`)
            break
          default:
          case LockSummitButtonType.LockSummit:
            toastError(`Error locking SUMMIT for EVEREST`)
            break
        }
      } finally {
        // TODO: Refresh in state
        setLockSummitPending(false)
      }
    },
    [account, type, summitAmount, duration, everestToken, setLockSummitPending, toastSuccess, toastError],
  )

  return { onLockSummit: handleLockSummit, lockSummitPending }
}
