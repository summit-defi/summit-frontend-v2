import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, Lock, ExternalLinkButton } from 'uikit'
import FarmCardUserWithdraw from './FarmCardUserWithdraw'
import FarmCardUserElevate from './FarmCardUserElevate'
import FarmCardMobileDepositWithdrawSelector from './FarmCardMobileDepositWithdrawSelector'
import { useMediaQuery, useSelectedElevation } from 'state/hooks'
import { useWeb3React } from '@web3-react/core'
import { roundStatusLockReason, useElevationInteractionsLockedBreakdown, useFarmAndUserTokenInteractionSectionInfo } from 'state/hooksNew'
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
  const isMobile = useMediaQuery('(max-width: 968px)')
  const {
    roundStatus,
    farmInteractionsLocked,
    totemNotSelected,
  } = useElevationInteractionsLockedBreakdown(elevation)
  const elevationLocked = farmInteractionsLocked || totemNotSelected
  const { account } = useWeb3React()

  const {
    // FARM INFO
    farmToken,
    depositFeeBP,
    decimals,
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

  // PENDING STATES
  const [approveDepositPending, setApproveDepositPending] = useState<boolean>(false)
  const [withdrawPending, setWithdrawPending] = useState<boolean>(false)

  // DISABLED
  const disabled = useMemo(() => approveDepositPending || withdrawPending || !isApproved, [
    approveDepositPending,
    withdrawPending,
    isApproved,
  ])

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
        { isMobile &&
          <FarmCardMobileDepositWithdrawSelector
            isApproved={isApproved}
            elevation={elevation}
            setMobileDepositWithdraw={setMobileDepositWithdraw}
          />
        }
        { (!isMobile || mobileDepositWithdraw === 0) && (isApproved ?
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
          /> :
          <FarmCardUserApprove
            symbol={symbol}
            walletBalance={walletBalance}
            decimals={decimals}
            depositFeeBP={depositFeeBP}
            elevation={elevation}
            farmToken={farmToken}
            setPending={setApproveDepositPending}
          />
        )}
        { (!isMobile || mobileDepositWithdraw === 1) &&
          <FarmCardUserWithdraw
            farmToken={farmToken}
            elevation={elevation}
            symbol={symbol}
            elevationLocked={elevationLocked}
            stakedBalance={elevStaked}
            claimable={elevClaimable}
            decimals={decimals}
            disabled={disabled}
            setPending={setWithdrawPending}
          />
        }
        {(!isMobile || mobileDepositWithdraw === 2) &&
          <FarmCardUserElevate
            symbol={symbol}
            elevationLocked={elevationLocked}
            disabled={disabled}
          />
        }
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
