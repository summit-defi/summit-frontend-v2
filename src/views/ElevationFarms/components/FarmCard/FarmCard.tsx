import React, { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import styled, { css } from 'styled-components'
import { Flex, Text, Skeleton, Tag, TokenSymbolImage, HighlightedText } from 'uikit'
import { Farm, UserTokenData } from 'state/types'
import { provider } from 'web3-core'
import { Elevation, ElevationFarmTab, elevationFarmTabToUrl, elevationTabToElevation } from 'config/constants/types'
import { useElevationTotem, usePricesPerToken, useSingleFarmSelected } from 'state/hooks'
import { NavLink } from 'react-router-dom'
import FarmCardUserSectionExpander from './FarmCardUserSectionExpander'
import CardValue from 'views/Home/components/CardValue'
import { getBalanceNumber, nFormatter } from 'utils'
import Totem from '../Totem'

const FCard = styled(Flex)<{ $locked: boolean; $expanded: boolean }>`
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

  ${({ $expanded }) =>
    $expanded &&
    css`
      background: ${({ theme }) => theme.colors.cardHover};
      box-shadow: 2px 2px 12px -4px rgba(25, 19, 38, 0.4), 2px 2px 8px rgba(25, 19, 38, 0.2);
      z-index: 10;
      margin-top: 24px;
      margin-bottom: 24px;
      border-bottom-width: 0px;
    `}

  &:first-child {
    margin-top: 0px;
  }
`

const PressableFlex = styled(NavLink)<{ $expanded: boolean }>`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  padding: 24px 20px 24px 20px;
  cursor: pointer;
  transition: all 300ms;
  flex-wrap: wrap;
  ${({ $expanded }) =>
    !$expanded &&
    css`
      &:hover {
        background: ${({ theme }) => theme.colors.cardHover};
        box-shadow: 2px 2px 12px -4px rgba(25, 19, 38, 0.4), 2px 2px 8px rgba(25, 19, 38, 0.2);

        .styledAccent {
          filter: blur(12px);
        }
      }
    `}
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
  width: 200px;
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

const YieldContributedWrapper = styled(Flex)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 50px;
  gap: 8px;
`

const MultiplierTag = styled(Tag)<{ elevation: Elevation }>`
  font-family: 'Courier Prime', monospace;
  background-color: ${({ theme, elevation }) => theme.colors[elevation]};
  border-color: ${({ theme, elevation }) => theme.colors[elevation]};
`

interface FarmCardProps {
  farm: Farm
  tokenInfo: UserTokenData
  elevationTab: ElevationFarmTab
  removed: boolean
  summitPrice?: BigNumber
  ethereum?: provider
  account?: string
}

const FarmCard: React.FC<FarmCardProps> = ({
  farm,
  tokenInfo,
  elevationTab,
  ethereum,
  summitPrice,
  account,
}) => {
  const {
    farmToken,
    symbol,
    summitPerYear,
    allocation,
    decimals,
  } = farm

  const {
    comment: farmComment,
    warning: farmWarning,
    supply: lpSupply,
    stakedBalance,
    claimable,
    yieldContributed,
  } = farm.elevations[elevationTab]

  const elevation = elevationTabToElevation[elevationTab]

  const singleFarmSymbol = useSingleFarmSelected()
  const pricesPerToken = usePricesPerToken()
  const expanded = singleFarmSymbol === symbol

  const { bonusBP = 0, taxBP = 0, bonusResetTimestamp, taxResetTimestamp } = tokenInfo || {}

  const rawEarned = getBalanceNumber(claimable)
  const rawYieldContribution = getBalanceNumber(yieldContributed)

  const userStakedBalance: BigNumber = useMemo(
    () => {
      if (stakedBalance == null || pricesPerToken == null) return new BigNumber(0)
      return stakedBalance.div(new BigNumber(10).pow(decimals)).times(pricesPerToken[symbol])
    },
    [stakedBalance, symbol, pricesPerToken, decimals]
  )

  const totalValue: BigNumber = useMemo(
    () => {
      if (lpSupply == null || pricesPerToken == null) return new BigNumber(0)
      return lpSupply.div(new BigNumber(10).pow(decimals)).times(pricesPerToken[symbol])
    },
    [lpSupply, symbol, pricesPerToken, decimals]
  )

  const apr = summitPrice
    .times(summitPerYear)
    .div(totalValue != null && !totalValue.isNaN() && totalValue.comparedTo(0) > 0 ? totalValue : new BigNumber(1))
    .toNumber()

  const compoundEventCount = 365
  const apy = useMemo(() => ((1 + (apr / compoundEventCount)) ** compoundEventCount) - 1, [apr, compoundEventCount])

  const totalValueFormatted = totalValue
    ? `$${Number(totalValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'

  const earnLabel = 'SUMMIT'
  const farmAvgAPY = apy * 100
  const dailyAPR = (
    apr &&
    apr / 3.65).toFixed(2)

  const targetUrl = `/${(elevationFarmTabToUrl[elevationTab] || 'elevations').toLowerCase()}${expanded ? '' : `/${symbol.toLowerCase()}`}`

  return (
    <FCard $locked={false} $expanded={expanded}>
      <PressableFlex to={targetUrl} $expanded={expanded}>
        { farmComment != null && <Text monospace bold italic fontSize='13px' mb='14px' textAlign='center'>* {farmComment}</Text> }
        { farmWarning != null && <Text monospace bold italic fontSize='13px' color='red' mb='14px' textAlign='center'>* {farmWarning}</Text> }
        <FarmNumericalInfoFlex>
          <SymbolIconFlex justifyContent="flex-start" alignItems="center">
            <TokenSymbolImage symbol={symbol} width={52} height={52} />
            <Flex flexDirection="column" alignItems="flex-start">
              <Text italic monospace bold fontSize="16px" lineHeight="14px" mb="4px" textAlign="left">
                {symbol}
              </Text>
              <MultiplierTag variant="secondary" elevation={elevation}>
                {(allocation / 100).toFixed(1)}X
              </MultiplierTag>
            </Flex>
          </SymbolIconFlex>
          <FlexInfoItem>
            <Text bold small>
              WINNINGS
            </Text>
            <InfoItemValue>
              <CardValue
                value={rawEarned}
                decimals={3}
                elevation={elevation}
                fontSize="22px"
              />
              <HighlightedText bold monospace mt="-8px" elevation={elevation}>
                {earnLabel}
              </HighlightedText>
            </InfoItemValue>
          </FlexInfoItem>

          {/* <FlexMobileLineBreak />
          {isElevationFarm && (
            <FlexInfoItem>
              <Text bold small>
                Yield Contributed
              </Text>
              <YieldContributedWrapper>
                <Totem elevation={elevation} totem={userTotem} pressable={false} size="36" navSize="36" margins="0" />
                <InfoItemValue>
                  <CardValue value={rawYieldContribution} decimals={3} elevation={elevation} fontSize="22px" />
                  <HighlightedText bold monospace mt="-8px" elevation={elevation}>
                    {earnLabel}
                  </HighlightedText>
                </InfoItemValue>
              </YieldContributedWrapper>
            </FlexInfoItem>
          )} */}

          { userStakedBalance.gt(0) && bonusBP > 0 &&
            <FlexInfoItem>
              <Text small>Winnings Bonus</Text>
              <InfoItemValue>
                <CardValue value={bonusBP / 100} postfix='%' decimals={1} elevation={Elevation.OASIS} fontSize="22px" />
              </InfoItemValue>
            </FlexInfoItem>
          }

          { userStakedBalance.gt(0) &&
            <FlexInfoItem>
              <Text small>Fairness Tax</Text>
              <InfoItemValue>
                <CardValue value={taxBP / 100} postfix='%' decimals={1} elevation={Elevation.OASIS} fontSize="22px" />
              </InfoItemValue>
            </FlexInfoItem>
          }

          <FlexInfoItem>
            <Text small>Deposited</Text>
            <InfoItemValue>
              <CardValue value={userStakedBalance.toNumber()} prefix='$' decimals={2} elevation={Elevation.OASIS} fontSize="22px" />
            </InfoItemValue>
          </FlexInfoItem>

          {/* { isElevationFarm && <FlexMobileLineBreak /> } */}

          <FlexInfoItem>
            <Text small>APY</Text>
            <InfoItemValue>
              <Text bold monospace style={{ display: 'flex', alignItems: 'center', lineHeight: '28px' }}>
                {apy ? `${nFormatter(farmAvgAPY, 2)}%` : <Skeleton height={24} width={80} />}
              </Text>
              <Text bold monospace fontSize='13px' style={{ display: 'flex', alignItems: 'center', lineHeight: '16px' }}>
                {apy ? `(Daily: ${dailyAPR}%)` : <Skeleton height={24} width={80} />}
              </Text>
            </InfoItemValue>
          </FlexInfoItem>
          <FlexInfoItem>
            <Text small>TVL</Text>
            <InfoItemValue>
              <Text bold monospace style={{ display: 'flex', alignItems: 'center', lineHeight: '28px' }}>
                {totalValueFormatted}
              </Text>
            </InfoItemValue>
          </FlexInfoItem>
        </FarmNumericalInfoFlex>
      </PressableFlex>

      { elevationTab !== ElevationFarmTab.DASH &&
        <FarmCardUserSectionExpander
          isExpanded={expanded}
          ethereum={ethereum}
          elevation={elevation}
          farm={farm}
          tokenInfo={tokenInfo}
          account={account}
        />
      }
    </FCard>
  )
}

export default FarmCard
