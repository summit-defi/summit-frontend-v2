import React, { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Flex, Text, Tag, TokenSymbolImage, HighlightedText } from 'uikit'
import { Elevation } from 'config/constants/types'
import { usePricesPerToken } from 'state/hooks'
import CardValue from 'views/Home/components/CardValue'
import { getBalanceNumber } from 'utils'
import { RecoveryInfo } from 'hooks/useRecovery'
import SummitButton from 'uikit/components/Button/SummitButton'
import { PriceableTokenSymbol } from 'state/types'
import { useRecoverFunds } from 'hooks/useRecoverFunds'

const URCard = styled(Flex)<{ hasRecovery: boolean }>`
  align-self: baseline;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  text-align: center;
  transition: all 0.2s;
  width: 100%;
  background: ${({ theme }) => theme.colors.background};
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${({ theme }) => theme.colors.text};
  opacity: ${({ hasRecovery }) => hasRecovery ? 1 : 0.35};

  &:first-child {
    margin-top: 0px;
  }
`

const WrapperFlex = styled(Flex)`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  padding: 28px 24px 28px 24px;
  flex-wrap: wrap;
`

const FarmNumericalInfoFlex = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
  gap: 12px;
  width: 100%;
`

const SymbolIconFlex = styled(Flex)`
  flex-direction: row;
  gap: 8px;
  ${({ theme }) => theme.mediaQueries.nav} {
    width: 200px;
  }
`

const FlexMobileLineBreak = styled.div`
  display: none;
  ${({ theme }) => theme.mediaQueries.invNav} {
    display: flex;
    width: 100%;
    height: 12px;
  }
`

const FlexInfoItem = styled(Flex)`
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`

const InfoItemValue = styled(Flex)`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50px;
`

const InfoItemValueRow = styled(InfoItemValue)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: auto;
`

const StyledSummitButton = styled(SummitButton)`
  ${({ theme }) => theme.mediaQueries.invNav} {
    margin: auto;
  }
`

interface UserRecoveryCardProps {
  userRecovery: RecoveryInfo
}

const UserRecoveryCard: React.FC<UserRecoveryCardProps> = ({
  userRecovery,
}) => {
  const {
    symbol,
    recoveryEnabled,
    recoverableAmount,
    recoverySummitEarnings,
    recoveryExpedWinnings,
  } = userRecovery

  const pricesPerToken = usePricesPerToken()

  const rawRecoverableAmount = getBalanceNumber(recoverableAmount)
  const rawRecoverySummitEarnings = getBalanceNumber(recoverySummitEarnings)
  const rawExpedWinnings = getBalanceNumber(recoveryExpedWinnings)
  const { onRecoverFunds, pending: recoverPending } = useRecoverFunds(symbol)

  const recoverableUSD: BigNumber = useMemo(
    () => recoverableAmount.div(new BigNumber(10).pow(18)).times(pricesPerToken != null ? pricesPerToken[symbol] : new BigNumber(1)),
    [recoverableAmount, symbol, pricesPerToken]
  )

  const handleRecoverFunds = () => {
    if (!recoveryEnabled || recoverPending || recoverableAmount.isEqualTo(0)) return
    onRecoverFunds()
  }

  return (
    <URCard hasRecovery={recoverableAmount.gt(0)}>
      <WrapperFlex>
        { symbol === PriceableTokenSymbol.SUMMIT && <Text monospace bold italic fontSize='13px' mb='14px' textAlign='center'>* SUMMIT recovery will be done manually, please screenshot this card and send it to @CCN on discord.</Text> }
        <FarmNumericalInfoFlex>
          <SymbolIconFlex justifyContent="flex-start" alignItems="center">
            <TokenSymbolImage symbol={symbol} width={56} height={56} />
            <Flex flexDirection="column" alignItems="flex-start">
              <Text italic monospace bold fontSize="16px" lineHeight="14px" textAlign="left">
                {symbol}
              </Text>
            </Flex>
          </SymbolIconFlex>
          <SummitButton
            onClick={handleRecoverFunds}
            isLocked={!recoveryEnabled}
            isLoading={recoverPending}
            disabled={recoverableAmount.isEqualTo(0)}
          >
            RECOVER
          </SummitButton>
          <FlexInfoItem>
            <Text bold fontSize="14px">
              Recoverable
            </Text>
            <InfoItemValueRow>
              <CardValue
                value={rawRecoverableAmount}
                decimals={3}
                fontSize="22px"
              />
              <HighlightedText bold monospace ml="8px">
                {symbol}
              </HighlightedText>
            </InfoItemValueRow>
            <InfoItemValueRow>
              <CardValue
                value={recoverableUSD.toNumber()}
                decimals={2}
                prefix='$'
                fontSize="15px"
              />
              <HighlightedText bold monospace ml="8px">
                USD
              </HighlightedText>
            </InfoItemValueRow>
          </FlexInfoItem>

          <FlexInfoItem>
            <Text fontSize="14px">Farming Earned</Text>
            <InfoItemValue>
              <CardValue
                value={rawRecoverySummitEarnings}
                decimals={3}
                fontSize="22px"
              />

              <HighlightedText bold monospace mt="-8px">
                SUMMIT
              </HighlightedText>
            </InfoItemValue>
          </FlexInfoItem>

          {(symbol === PriceableTokenSymbol.SUMMIT || symbol === PriceableTokenSymbol.SUMMIT_FTM) &&
          <FlexInfoItem>
            <Text fontSize="14px">Expedition Winnings</Text>
            <InfoItemValue>
              <CardValue
                value={rawExpedWinnings}
                decimals={3}
                fontSize="22px"
              />
              <HighlightedText bold monospace mt="-8px">
                MIM
              </HighlightedText>
            </InfoItemValue>
          </FlexInfoItem>
          }
        </FarmNumericalInfoFlex>
      </WrapperFlex>
    </URCard>
  )
}

export default UserRecoveryCard
