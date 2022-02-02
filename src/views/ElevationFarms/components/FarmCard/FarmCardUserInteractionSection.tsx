import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, Lock, ExternalLinkButton } from 'uikit'
import { getContract } from 'utils'
import { provider } from 'web3-core'
import FarmCardUserWithdraw from './FarmCardUserWithdraw'
import FarmCardUserElevate from './FarmCardUserElevate'
import FarmCardMobileDepositWithdrawSelector from './FarmCardMobileDepositWithdrawSelector'
import { useMediaQuery, useSelectedElevation } from 'state/hooks'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { RoundStatus, roundStatusLockReason, useElevationInteractionsLockedBreakdown, useFarmAndUserTokenInteractionSectionInfo } from 'state/hooksNew'
import FarmCardUserApprove from './FarmCardUserApprove'
import FarmCardUserDeposit from './FarmCardUserDeposit'

const MobileVerticalFlex = styled(Flex)`
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 12px;

  ${({ theme }) => theme.mediaQueries.nav} {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
`

const MobileVerticalFlexText = styled(MobileVerticalFlex)`
  ${({ theme }) => theme.mediaQueries.nav} {
    justify-content: space-around;
  }
`

const StyledLock = styled(Lock)`
  transform: rotate(20deg);
  fill: ${({ theme }) => theme.colors.textGold};
`

interface Props {
  symbol: string
}

const FarmCardUserInteractionSection: React.FC<Props> = ({ symbol }) => {
  const elevation = useSelectedElevation()
  const isMobile = useMediaQuery('(max-width: 986px)')
  const {
    roundStatus,
    farmInteractionsLocked,
    totemNotSelected,
  } = useElevationInteractionsLockedBreakdown(elevation)
  const elevationLocked = farmInteractionsLocked || totemNotSelected
  const { account, ethereum }: { account: string | null, ethereum: provider } = useWallet()

  const {
    // FARM INFO
    farmToken,
    depositFeeBP,
    decimals,
    taxBP,
    passthroughStrategy,
    getUrl,

    // FARM ELEVATION INFO
    elevStaked,
    elevClaimable,

    // TOKEN INFO
    farmAllowance,
    walletBalance,
  } = useFarmAndUserTokenInteractionSectionInfo(symbol, elevation)

  const [mobileDepositWithdraw, setMobileDepositWithdraw] = useState(isMobile ? 0 : -1)

  const isApproved = account && farmAllowance && farmAllowance.isGreaterThan(0)
  const lpContract = useMemo(() => {
    return getContract(ethereum as provider, farmToken)
  }, [ethereum, farmToken])

  // PENDING STATES
  const [approveDepositPending, setApproveDepositPending] = useState<boolean>(false)
  const [withdrawPending, setWithdrawPending] = useState<boolean>(false)

  // DISABLED
  const disabled = useMemo(() => approveDepositPending || withdrawPending || !isApproved, [
    approveDepositPending,
    withdrawPending,
    isApproved,
  ])

  // MOBILE DEPOSIT WITHDRAW SELECTOR
  const mobileDepositWithdrawSelector = useCallback(
    () =>
      isMobile && (
        <FarmCardMobileDepositWithdrawSelector
          isApproved={isApproved}
          elevation={elevation}
          setMobileDepositWithdraw={setMobileDepositWithdraw}
        />
      ),
    [isMobile, elevation, setMobileDepositWithdraw, isApproved],
  )

  // DEPOSIT SECTION
  const approveDepositSection = useCallback(
    () => {
      if (isMobile && mobileDepositWithdraw !== 0) return null
      if (isApproved) return (
        <FarmCardUserDeposit
          farmToken={farmToken}
          symbol={symbol}
          elevationLocked={elevationLocked}
          walletBalance={walletBalance}
          decimals={decimals}
          depositFeeBP={depositFeeBP}
          elevation={elevation}
          disabled={disabled}
          claimable={elevClaimable}
          setPending={setApproveDepositPending}
        />
      )
      return (
        <FarmCardUserApprove
          symbol={symbol}
          walletBalance={walletBalance}
          decimals={decimals}
          depositFeeBP={depositFeeBP}
          elevation={elevation}
          lpContract={lpContract}
          setPending={setApproveDepositPending}
        />
      )
    },
    [
      farmToken,
      elevation,
      decimals,
      isMobile,
      mobileDepositWithdraw,
      elevationLocked,
      symbol,
      walletBalance,
      depositFeeBP,
      elevClaimable,
      isApproved,
      disabled,
      lpContract,
      setApproveDepositPending,
    ],
  )

  // WITHDRAW SECTION
  const withdrawSection = useCallback(
    () =>
      (!isMobile || mobileDepositWithdraw === 1) && (
        <FarmCardUserWithdraw
          farmToken={farmToken}
          elevation={elevation}
          symbol={symbol}
          elevationLocked={elevationLocked}
          stakedBalance={elevStaked}
          claimable={elevClaimable}
          decimals={decimals}
          withdrawalFee={taxBP}
          disabled={disabled}
          setPending={setWithdrawPending}
        />
      ),
    [
      farmToken,
      elevation,
      decimals,
      isMobile,
      mobileDepositWithdraw,
      elevationLocked,
      symbol,
      elevStaked,
      elevClaimable,
      taxBP,
      disabled,
      setWithdrawPending,
    ],
  )

  // ELEVATE SECTION
  const elevateSection = useCallback(
    () =>
      (!isMobile || mobileDepositWithdraw === 2) && (
        <FarmCardUserElevate
          symbol={symbol}
          elevationLocked={elevationLocked}
          disabled={disabled}
        />
      ),
    [isMobile, mobileDepositWithdraw, elevationLocked, symbol, disabled],
  )

  return (
    <Flex flexDirection='column' alignItems='center' justifyContent='center'>
      { elevationLocked &&
        <Flex width='100%' alignItems='center' justifyContent='flex-start' mb='16px' gap='8px'>
          <StyledLock width='18px'/>
          <Text bold italic gold small monospace textAlign='left'>
            { roundStatusLockReason(roundStatus, elevation) }  
          </Text>
        </Flex>
      }
      <MobileVerticalFlex>
        {mobileDepositWithdrawSelector()}
        {approveDepositSection()}
        {withdrawSection()}
        {elevateSection()}
      </MobileVerticalFlex>
      <MobileVerticalFlexText width="100%" mt="24px">
        <Flex flexDirection="row" justifyContent="space-around" alignItems="center" width='100%'>
          {passthroughStrategy != null && (
            <ExternalLinkButton summitPalette={elevation} href={passthroughStrategy}>
              Passthrough Strategy
            </ExternalLinkButton>
          )}
          <ExternalLinkButton summitPalette={elevation} href={getUrl}>
            Get {symbol}
          </ExternalLinkButton>
        </Flex>
      </MobileVerticalFlexText>
    </Flex>
  )
}

export default React.memo(FarmCardUserInteractionSection)
