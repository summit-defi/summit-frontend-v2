import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Flex, Card, CardBody, LogoRoundIcon, HighlightedText } from 'uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useHarvestAll } from 'hooks/useHarvest'
import UnlockButton from 'components/UnlockButton'
import SummitHarvestBalance from './SummitHarvestBalance'
import SummitWalletBalance from './SummitWalletBalance'
import SummitButton from 'uikit/components/Button/SummitButton'
import { useAllEarnedAndVesting } from 'hooks/useAllEarnedAndVesting'
import SummitVestingBalance from './SummitVestingBalance'
import { getBalanceNumber, getSummitTokenAddress } from 'utils'

const StyledFarmStakingCard = styled(Card)`
  min-height: 376px;
`

const TokenImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`

const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
`

const Actions = styled(Flex)`
  justify-content: center;
  margin-top: 24px;
  display: flex;
  flex: 1;
  align-items: flex-end;
`

const FarmedStakingCard = () => {
  const { account } = useWallet()
  const earnedAndVesting = useAllEarnedAndVesting()
  const pidsWithEarned =
    earnedAndVesting != null
      ? Object.entries(earnedAndVesting).reduce(
          (pids, [pid, { earned }]) => (earned.toNumber() > 0 ? [...pids, pid] : pids),
          [],
        )
      : []
  const { totalEarned, totalVesting } =
    earnedAndVesting != null
      ? Object.values(earnedAndVesting).reduce(
          (accum, { earned, vesting }) => ({
            totalEarned: accum.totalEarned + earned.toNumber(),
            totalVesting: accum.totalVesting + vesting.toNumber(),
          }),
          { totalEarned: 0, totalVesting: 0 },
        )
      : { totalEarned: 0, totalVesting: 0 }

  const displayTotalEarned = getBalanceNumber(totalEarned)
  const displayTotalVesting = getBalanceNumber(totalVesting)
  const summitAddress = getSummitTokenAddress()

  const { onHarvestAll, pending: harvestAllPending } = useHarvestAll(pidsWithEarned)

  const addWatchSummitToken = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const provider = window.ethereum
    if (provider) {
      try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await provider.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: summitAddress,
              symbol: 'SUMMIT',
              decimals: '18',
              image: `${window.location.origin}/images/tokens/SUMMIT.png`,
            },
          },
        })

        if (wasAdded) {
          console.log('Token was added')
        }
      } catch (error) {
        // TODO: find a way to handle when the user rejects transaction or it fails
      }
    }
  }, [summitAddress])

  return (
    <StyledFarmStakingCard>
      <CardBody style={{height: '100%', display: 'flex', flex: '1', flexDirection: 'column'}}>
        <HighlightedText header mb="24px">
          ELEVATION FARMING
        </HighlightedText>

        <TokenImageWrapper>
          <LogoRoundIcon width="48px" />
          <SummitButton onClick={addWatchSummitToken} height={30} padding={22} style={{ marginLeft: '8px' }}>
            + <img style={{ marginLeft: 8 }} width={16} src="/images/wallet/metamask.png" alt="metamask logo" />
          </SummitButton>
        </TokenImageWrapper>
        <Flex justifyContent="space-between" alignItems="center">
          <Label>SUMMIT Available</Label>
          <SummitHarvestBalance account={account} earned={displayTotalEarned} />
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Label>SUMMIT Vesting</Label>
          <SummitVestingBalance account={account} vesting={displayTotalVesting} />
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Label>SUMMIT in Wallet</Label>
          <SummitWalletBalance />
        </Flex>
        <Actions>
          {!account &&
          //  ? (
          //   <SummitButton isLoading={harvestAllPending} disabled={pidsWithEarned.length <= 0} onClick={onHarvestAll}>
          //     {`HARVEST ALL (${pidsWithEarned.length})`}
          //   </SummitButton>
          // ) : (
            <UnlockButton/>
          }
          {/* )} */}
        </Actions>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default FarmedStakingCard
