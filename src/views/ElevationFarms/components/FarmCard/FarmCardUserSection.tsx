import React, { useCallback, useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Text, ExternalLinkButton } from 'uikit'
import { Farm, UserTokenData } from 'state/types'
import { Elevation } from 'config/constants/types'
import { getContract } from 'utils'
import { provider } from 'web3-core'
import FarmCardUserApproveDeposit from './FarmCardUserApproveDeposit'
import FarmCardUserWithdraw from './FarmCardUserWithdraw'
import FarmCardUserElevate from './FarmCardUserElevate'
import FarmCardMobileDepositWithdrawSelector from './FarmCardMobileDepositWithdrawSelector'
import { useIsElevationLockedUntilRollover, useMediaQuery } from 'state/hooks'
import { getFarmToken } from 'utils/farmId'
import { useTraceUpdate } from 'hooks/useTraceUpdate'
import BoundedProgressBar from '../BoundedProgressBar'

const ExpandableSection = styled(Flex)<{ isExpanded: boolean }>`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 300ms;
  overflow: hidden;
  padding-left: 24px;
  padding-right: 24px;
  max-height: ${({ isExpanded }) => (isExpanded ? '1000px' : '0px')};
  opacity: ${({ isExpanded }) => (isExpanded ? 1 : 0)};
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

interface Props {
  isExpanded: boolean
  elevation: Elevation
  farm: Farm
  tokenInfo: UserTokenData
  account?: string
  ethereum?: provider
}
const FarmCardUserSection: React.FC<Props> = (props) => {
  const { isExpanded: expanded, elevation, farm, tokenInfo, account, ethereum } = props
  const {
    farmToken,
    depositFeeBP,
    decimals,
    taxBP,
    native,
    symbol,
    passthroughStrategy,
    getUrl,
  } = farm

  const {
    stakedBalance,
    claimable
  } = farm.elevations[elevation] || {}

  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    setIsExpanded(expanded)
  }, [expanded, setIsExpanded])

  const isMobile = useMediaQuery('(max-width: 986px)')
  const elevationLocked = useIsElevationLockedUntilRollover(elevation)
  const farmTokenAddress = getFarmToken(farm)
  const [mobileDepositWithdraw, setMobileDepositWithdraw] = useState(isMobile ? 0 : -1)

  const { farmAllowance, walletBalance } = tokenInfo

  const isApproved = account && farmAllowance && farmAllowance.isGreaterThan(0)
  const lpContract = useMemo(() => {
    return getContract(ethereum as provider, farmTokenAddress)
  }, [ethereum, farmTokenAddress])

  // PENDING STATES
  const [claimPending, setClaimPending] = useState<boolean>(false)
  const [approveDepositPending, setApproveDepositPending] = useState<boolean>(false)
  const [withdrawPending, setWithdrawPending] = useState<boolean>(false)

  // DISABLED
  const disabled = useMemo(() => approveDepositPending || withdrawPending || claimPending || !isApproved, [
    approveDepositPending,
    withdrawPending,
    claimPending,
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
  const depositSection = useCallback(
    () =>
      (!isMobile || mobileDepositWithdraw === 0) && (
        <FarmCardUserApproveDeposit
          farmToken={farmToken}
          elevation={elevation}
          symbol={symbol}
          elevationLocked={elevationLocked}
          walletBalance={walletBalance}
          decimals={decimals}
          depositFeeBP={depositFeeBP}
          isApproved={isApproved}
          disabled={disabled}
          lpContract={lpContract}
          claimable={claimable}
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
      symbol,
      walletBalance,
      depositFeeBP,
      claimable,
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
          stakedBalance={stakedBalance}
          claimable={claimable}
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
      stakedBalance,
      claimable,
      taxBP,
      disabled,
      setWithdrawPending,
    ],
  )

  // ELEVATE SECTION
  const elevateSection = useCallback(
    () =>
      (!isMobile || mobileDepositWithdraw === 2) && (
        <FarmCardUserElevate farm={farm} elevationLocked={elevationLocked} disabled={disabled} />
      ),
    [isMobile, mobileDepositWithdraw, elevationLocked, farm, disabled],
  )

  return (
    <ExpandableSection isExpanded={isExpanded}>
      <Divider />
      <Flex flexWrap='wrap' flexDirection='row' width='100%' mb='18px' mt='6px' style={{gap: '24px'}}>
        <BoundedProgressBar
          title='DEPOSIT|br|FEE'
          currPerc={3}
          elevation={elevation}
        />

        <BoundedProgressBar
          title='FAIRNESS|br|TAX'
          minTitle='NOV 4'
          maxTitle='NOV 10'
          leftPerc={7}
          rightPerc={1}
          currPerc={4.25}
          elevation={elevation}
        />

        <BoundedProgressBar
          title='LOYALTY|br|BONUS'
          minTitle='NOV 10'
          maxTitle='NOV 17'
          leftPerc={0}
          rightPerc={7}
          currPerc={3}
          elevation={elevation}
        />
      </Flex>
      <Divider />
      <MobileVerticalFlex>
        {mobileDepositWithdrawSelector()}
        {depositSection()}
        {withdrawSection()}
        {elevateSection()}
      </MobileVerticalFlex>
      <MobileVerticalFlexText width="100%" mt="24px">
        <Flex flexDirection="row" justifyContent="space-around" alignItems="center" width='100%'>
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
      <BottomPadding />
    </ExpandableSection>
  )
}

export default FarmCardUserSection
