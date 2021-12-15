import React, { useCallback, useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Text, ExternalLinkButton } from 'uikit'
import { Farm } from 'state/types'
import { Elevation } from 'config/constants/types'
import { getContract } from 'utils'
import { provider } from 'web3-core'
import FarmCardUserHarvest from './FarmCardUserHarvest'
import FarmCardUserApproveDeposit from './FarmCardUserApproveDeposit'
import FarmCardUserWithdraw from './FarmCardUserWithdraw'
import FarmCardUserElevate from './FarmCardUserElevate'
import FarmCardMobileDepositWithdrawSelector from './FarmCardMobileDepositWithdrawSelector'
import { useIsElevationLockedUntilRollover, useMediaQuery } from 'state/hooks'

const ExpandableSection = styled(Flex)<{ expanded: boolean }>`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 300ms;
  overflow: hidden;
  padding-left: 24px;
  padding-right: 24px;
  max-height: ${({ expanded }) => (expanded ? '1000px' : '0px')};
  opacity: ${({ expanded }) => (expanded ? 1 : 0)};
`

const BottomPadding = styled.div`
  width: 100px;
  height: 24px;
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  margin-bottom: 12px;
  width: 100%;
`

const MobileVerticalFlex = styled(Flex)`
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 24px;

  ${({ theme }) => theme.mediaQueries.nav} {
    flex-direction: row;
    justify-content: space-between;
  }
`

const MobileVerticalFlexText = styled(MobileVerticalFlex)`
  ${({ theme }) => theme.mediaQueries.nav} {
    justify-content: space-around;
  }
`

interface Props {
  expanded: boolean
  elevation: Elevation
  farm: Farm
  userTotem: number
  account?: string
  ethereum?: provider
}

const FarmCardUserSection: React.FC<Props> = ({ expanded, userTotem, elevation, farm, account, ethereum }) => {
  const {
    pid,
    depositFee,
    isTokenOnly,
    tokenAddress,
    tokenDecimals,
    lpAddress,
    withdrawalFee,
    symbol,
    userData,
    passthroughStrategy,
    getUrl,
  } = farm
  const [renderExpandedComponents, setRenderExpandedComponents] = useState(false)
  const isMobile = useMediaQuery('(max-width: 986px)')
  const elevationLocked = useIsElevationLockedUntilRollover()
  const [mobileDepositWithdraw, setMobileDepositWithdraw] = useState(isMobile ? 0 : -1)

  useEffect(() => {
    let collapseTimeout
    if (expanded) setRenderExpandedComponents(true)
    else collapseTimeout = setTimeout(() => setRenderExpandedComponents(false), 300)
    return () => clearTimeout(collapseTimeout)
  }, [expanded, symbol, setRenderExpandedComponents])

  const { allowance, stakedBalance, tokenBalance, earnedReward } = userData || {}

  const isApproved = account && allowance && allowance.isGreaterThan(0)
  const lpContract = useMemo(() => {
    return getContract(ethereum as provider, isTokenOnly ? tokenAddress : lpAddress)
  }, [ethereum, lpAddress, tokenAddress, isTokenOnly])

  // PENDING STATES
  const [harvestPending, setHarvestPending] = useState<boolean>(false)
  const [approveDepositPending, setApproveDepositPending] = useState<boolean>(false)
  const [withdrawPending, setWithdrawPending] = useState<boolean>(false)

  // DISABLED
  const disabled = useMemo(() => approveDepositPending || withdrawPending || harvestPending || !isApproved, [
    approveDepositPending,
    withdrawPending,
    harvestPending,
    isApproved,
  ])

  // HARVEST SECTION
  const harvestSection = useCallback(
    () =>
      elevation === Elevation.OASIS &&
      renderExpandedComponents && (
        <FarmCardUserHarvest
          pid={pid}
          earnedReward={earnedReward}
          elevation={elevation}
          disabled={disabled}
          setPending={setHarvestPending}
        />
      ),
    [renderExpandedComponents, pid, earnedReward, elevation, disabled, setHarvestPending],
  )

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
  const depositSection = useCallback(
    () =>
      renderExpandedComponents &&
      (!isMobile || mobileDepositWithdraw === 0) && (
        <FarmCardUserApproveDeposit
          pid={pid}
          symbol={symbol}
          userTotem={userTotem}
          elevationLocked={elevationLocked}
          tokenBalance={tokenBalance}
          tokenDecimals={tokenDecimals}
          depositFee={depositFee}
          isApproved={isApproved}
          elevation={elevation}
          disabled={disabled}
          lpContract={lpContract}
          earnedReward={earnedReward}
          setPending={setApproveDepositPending}
        />
      ),
    [
      tokenDecimals,
      isMobile,
      mobileDepositWithdraw,
      elevationLocked,
      renderExpandedComponents,
      pid,
      symbol,
      userTotem,
      tokenBalance,
      depositFee,
      earnedReward,
      isApproved,
      elevation,
      disabled,
      lpContract,
      setApproveDepositPending,
    ],
  )

  // WITHDRAW SECTION
  const withdrawSection = useCallback(
    () =>
      renderExpandedComponents &&
      (!isMobile || mobileDepositWithdraw === 1) && (
        <FarmCardUserWithdraw
          pid={pid}
          symbol={symbol}
          elevationLocked={elevationLocked}
          stakedBalance={stakedBalance}
          earnedReward={earnedReward}
          tokenDecimals={tokenDecimals}
          withdrawalFee={withdrawalFee}
          elevation={elevation}
          disabled={disabled}
          setPending={setWithdrawPending}
        />
      ),
    [
      tokenDecimals,
      isMobile,
      mobileDepositWithdraw,
      elevationLocked,
      renderExpandedComponents,
      pid,
      symbol,
      stakedBalance,
      earnedReward,
      withdrawalFee,
      elevation,
      disabled,
      setWithdrawPending,
    ],
  )

  // ELEVATE SECTION
  const elevateSection = useCallback(
    () =>
      renderExpandedComponents &&
      (!isMobile || mobileDepositWithdraw === 2) && (
        <FarmCardUserElevate farm={farm} elevationLocked={elevationLocked} disabled={disabled} />
      ),
    [isMobile, mobileDepositWithdraw, elevationLocked, renderExpandedComponents, farm, disabled],
  )

  return (
    <ExpandableSection expanded={expanded}>
      <Divider />
      {harvestSection()}
      <MobileVerticalFlex>
        {mobileDepositWithdrawSelector()}
        {depositSection()}
        {withdrawSection()}
        {elevateSection()}
      </MobileVerticalFlex>
      <MobileVerticalFlexText width="100%" mt="24px">
        <Flex flexDirection="column" justifyContent="flex-start" alignItems="center">
          <Text fontSize="14px" bold monospace>
            {symbol} Fee: {(depositFee || 0) / 100 + (withdrawalFee || 0) / 100}%
          </Text>
          <Text fontSize="13px" bold monospace>
            On Deposit: {(depositFee || 0) / 100}% / On Withdrawal: {(withdrawalFee || 0) / 100}%
          </Text>
        </Flex>
        <Flex flexDirection="column" justifyContent="flex-start" alignItems="center">
          {passthroughStrategy != null && (
            <ExternalLinkButton elevation={elevation} href={passthroughStrategy}>
              Passthrough Strategy
            </ExternalLinkButton>
          )}
          <ExternalLinkButton elevation={elevation} href={getUrl}>
            Get {symbol}
          </ExternalLinkButton>
        </Flex>
      </MobileVerticalFlexText>
      <Text fontSize="13px" mt="24px" bold monospace>
        Deposit / Withdrawal / Elevate txns will harvest available SUMMIT
      </Text>
      <BottomPadding />
    </ExpandableSection>
  )
}

export default FarmCardUserSection
