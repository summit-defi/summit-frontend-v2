import { useCallback, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { betaTokenMint } from 'utils/callHelpers'
import { useTransactionToasts } from 'hooks/useToast'
import { provider } from 'web3-core'
import { getDummyTokenContract } from 'utils'

export const useMintBetaToken = (symbol: string, tokenAddress: string, decimals: number) => {
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useTransactionToasts()
  const { account, ethereum }: { account: string, ethereum: provider } = useWallet()

  const handleMint = useCallback(async (amount: number) => {
    try {
      setPending(true)
      const betaToken = getDummyTokenContract(ethereum, tokenAddress)
      await betaTokenMint(betaToken, amount, account, decimals)
      toastSuccess(`${amount} ${symbol} Minted`)
    } catch (error) {
      toastError(`${symbol} Mint Failed`, (error as Error).message)
    } finally {
      setPending(false)
    }
  }, [account, ethereum, tokenAddress, decimals, setPending, toastSuccess, toastError, symbol])

  return { onMint: handleMint, pending }
}
