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
import { getFarmToken } from 'utils/farmId'

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
  account?: string
  ethereum?: provider
}

const FarmCardUserSection: React.FC<Props> = ({ expanded, elevation, farm, account, ethereum }) => {
  const {
    farmToken,
    depositFeeBP,
    decimals,
    taxBP,
    symbol,
    userData,
    passthroughStrategy,
    getUrl,
  } = farm
  const [renderExpandedComponents, setRenderExpandedComponents] = useState(false)
  const isMobile = useMediaQuery('(max-width: 986px)')
  const elevationLocked = useIsElevationLockedUntilRollover()
  const farmTokenAddress = getFarmToken(farm)
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
    return getContract(ethereum as provider, farmTokenAddress)
  }, [ethereum, farmTokenAddress])

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
          farmToken={farmToken}
          elevation={elevation}
          earnedReward={earnedReward}
          disabled={disabled}
          setPending={setHarvestPending}
        />
      ),
    [renderExpandedComponents, farmToken, earnedReward, elevation, disabled, setHarvestPending],
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
          farmToken={farmToken}
          elevation={elevation}
          symbol={symbol}
          elevationLocked={elevationLocked}
          tokenBalance={tokenBalance}
          decimals={decimals}
          depositFeeBP={depositFeeBP}
          isApproved={isApproved}
          disabled={disabled}
          lpContract={lpContract}
          earnedReward={earnedReward}
          setPending={setApproveDepositPending}
        />
      ),
    [
      farmToken,
      elevation,
      decimals,
      isMobile,
      mobileDepositWithdraw,
      elevationLocked,
      renderExpandedComponents,
      symbol,
      tokenBalance,
      depositFeeBP,
      earnedReward,
      isApproved,
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
          farmToken={farmToken}
          elevation={elevation}
          symbol={symbol}
          elevationLocked={elevationLocked}
          stakedBalance={stakedBalance}
          earnedReward={earnedReward}
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
      renderExpandedComponents,
      symbol,
      stakedBalance,
      earnedReward,
      taxBP,
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
            {symbol} Fee: {(depositFeeBP || 0) / 100 + (taxBP || 0) / 100}%
          </Text>
          <Text fontSize="13px" bold monospace>
            On Deposit: {(depositFeeBP || 0) / 100}% / On Withdrawal: {(taxBP || 0) / 100}%
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
