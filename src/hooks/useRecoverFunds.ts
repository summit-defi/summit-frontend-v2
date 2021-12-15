import { useCallback, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { recoverFunds } from 'utils/callHelpers'
import { useRecoveryPassthroughContract } from './useContract'
import { useTransactionToasts } from './useToast'
import { PriceableTokenSymbol } from 'state/types'

export const useRecoverFunds = (symbol: PriceableTokenSymbol) => {
  const { account }: { account: string } = useWallet()
  const recoveryPassthroughContract = useRecoveryPassthroughContract(symbol)
  const { toastSuccess, toastError } = useTransactionToasts()
  const [pending, setPending] = useState(false)

  const handleRecoverFunds = useCallback(
    async () => {
      try {
        setPending(true)
        await recoverFunds(recoveryPassthroughContract, account)
        toastSuccess(`${symbol} Recovered`)
      } catch (error) {
        toastError(`${symbol} Recovery Failed`, (error as Error).message)
      } finally {
        setPending(false)
      }
    },
    [symbol, account, recoveryPassthroughContract, setPending, toastSuccess, toastError],
  )

  return { onRecoverFunds: handleRecoverFunds, pending }
}
