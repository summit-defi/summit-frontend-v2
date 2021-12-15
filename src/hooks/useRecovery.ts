import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import { getTokenBalance } from 'utils/bep20'
import { abi, getRecoveryPassthroughContract, getSummitTokenAddress, retryableMulticall } from 'utils'
import useRefresh from './useRefresh'
import { PriceableTokenSymbol } from 'state/types'
import { partition } from 'lodash'

const RecoveryTokens = [
  PriceableTokenSymbol.SUMMIT,
  PriceableTokenSymbol.SUMMIT_FTM,
  PriceableTokenSymbol.TOMB_FTM,
  PriceableTokenSymbol.FTM_BOO,
  PriceableTokenSymbol.FTM_wETH,
  PriceableTokenSymbol.fUSDT_FTM,
  PriceableTokenSymbol.BOO,
  PriceableTokenSymbol.wFTM,
]

export interface RecoveryInfo {
  symbol: PriceableTokenSymbol
  recoveryEnabled: boolean
  recoverableAmount: BigNumber
  recoverySummitEarnings: BigNumber
  recoveryExpedWinnings: BigNumber
}

export const useRecovery = () => {
  const [userRecoveries, setUserRecoveries] = useState<RecoveryInfo[]>([null])
  const [recoveriesLoaded, setRecoveriesLoaded] = useState(false)
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const { slowRefresh } = useRefresh()
  const summitAddress = getSummitTokenAddress()

  useEffect(() => {
    const fetchBalance = async () => {
      const calls = RecoveryTokens.map((recoveryToken) => {
        const recoveryPassthroughAddress = getRecoveryPassthroughContract(recoveryToken)
        return [{
          address: recoveryPassthroughAddress,
          name: 'recoveryEnabled',
        }, {
          address: recoveryPassthroughAddress,
          name: 'getRecoverableAmount',
          params: [account],
        }]
      }).flat()

      const res = await retryableMulticall(abi.BaseRecoveryPassthrough, calls, 'fetchUserRecoveries')

      const recoveries = partition(
        RecoveryTokens.map((recoveryToken, tokenIndex): RecoveryInfo => {
          const recoveryEnabled = res != null ? res[(tokenIndex * 2) + 0][0] : false
          const amounts = res != null ? res[(tokenIndex * 2) + 1] : null
          const recoverableAmount = amounts != null ? new BigNumber(amounts[0]._hex) : new BigNumber(0)
          const recoverySummitEarnings = amounts != null ? new BigNumber(amounts[1]._hex) : new BigNumber(0)
          const recoveryExpedWinnings = amounts != null ? new BigNumber(amounts[2]._hex) : new BigNumber(0)
          return {
            symbol: recoveryToken,
            recoveryEnabled,
            recoverableAmount,
            recoverySummitEarnings,
            recoveryExpedWinnings,
          }
        }),
        (recoveryInfo) => (recoveryInfo.recoverableAmount || new BigNumber(0)).gt(0)
      ).flat()

      setUserRecoveries(recoveries)
      setRecoveriesLoaded(res != null)
    }

    if (account && ethereum) {
      fetchBalance()
    }
  }, [account, ethereum, summitAddress, slowRefresh])

  return { userRecoveries, recoveriesLoaded }
}
