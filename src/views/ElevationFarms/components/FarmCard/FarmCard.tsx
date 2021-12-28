import React, { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import styled, { css } from 'styled-components'
import { Flex, Text, Skeleton, Tag, TokenSymbolImage, HighlightedText } from 'uikit'
import { Farm } from 'state/types'
import { provider } from 'web3-core'
import { Elevation } from 'config/constants/types'
import { useElevationTotem, usePricesPerToken, useSingleFarmSelected } from 'state/hooks'
import { NavLink } from 'react-router-dom'
import FarmCardUserSection from './FarmCardUserSection'
import CardValue from 'views/Home/components/CardValue'
import { getBalanceNumber, nFormatter } from 'utils'
import Totem from '../Totem'
import { farmId } from 'utils/farmId'

const FCard = styled(Flex)<{ $locked: boolean; expanded: boolean }>`
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

  ${({ expanded }) =>
    expanded &&
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

const PressableFlex = styled(NavLink)<{ expanded: boolean }>`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  padding: 28px 24px 28px 24px;
  cursor: pointer;
  transition: all 300ms;
  flex-wrap: wrap;
  ${({ expanded }) =>
    !expanded &&
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
  removed: boolean
  summitPrice?: BigNumber
  ethereum?: provider
  account?: string
  elevation: Elevation
  elevationLocked: boolean
}

const FarmCard: React.FC<FarmCardProps> = ({
  farm,
  elevation,
  ethereum,
  summitPrice,
  account,
  elevationLocked,
}) => {
  const {
    farmToken,
    symbol,
    summitPerYear,
    allocation,
    userData,
    decimals,
    farmComment,
    farmWarning,
    supply: lpSupply,
  } = farm

  const singleFarmId = useSingleFarmSelected()
  const pricesPerToken = usePricesPerToken()
  const expanded = singleFarmId === farmId(farm)

  const { stakedBalance, earnedReward, vestingReward, roundYieldContributed } = userData || {}

  const rawEarned = getBalanceNumber(earnedReward)
  const rawVesting = getBalanceNumber(vestingReward)
  const rawYieldContribution = getBalanceNumber(roundYieldContributed)

  const isElevationFarm = elevation !== Elevation.OASIS
  const userTotem = useElevationTotem(elevation)

  const userStakedBalance: BigNumber = useMemo(
    () => stakedBalance.div(new BigNumber(10).pow(decimals)).times(pricesPerToken[symbol]),
    [stakedBalance, symbol, pricesPerToken, decimals]
  )

  const totalValue: BigNumber = useMemo(
    () => lpSupply.div(new BigNumber(10).pow(decimals)).times(pricesPerToken[symbol]),
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

  const targetUrl = `/${elevation.toLowerCase()}${expanded ? '' : `/${symbol.toLowerCase()}`}`

  return (
    <FCard $locked={elevationLocked} expanded={expanded}>
      <PressableFlex to={targetUrl} expanded={expanded}>
        { farmComment != null && <Text monospace bold italic fontSize='13px' mb='14px' textAlign='center'>* {farmComment}</Text> }
        { farmWarning != null && <Text monospace bold italic fontSize='13px' color='red' mb='14px' textAlign='center'>* {farmWarning}</Text> }
        <FarmNumericalInfoFlex>
          <SymbolIconFlex justifyContent="flex-start" alignItems="center">
            <TokenSymbolImage symbol={symbol} width={56} height={56} />
            <Flex flexDirection="column" alignItems="flex-start">
              <Text italic monospace bold fontSize="16px" lineHeight="14px" mb="4px" textAlign="left">
                {symbol}
              </Text>
              <MultiplierTag variant="secondary" elevation={elevation}>
                {(allocation / 10000).toFixed(2)}X
              </MultiplierTag>
            </Flex>
          </SymbolIconFlex>
          <FlexInfoItem>
            <Text bold fontSize="14px">
              {isElevationFarm ? 'Total Rewards' : 'Earned'}
            </Text>
            <InfoItemValue>
              <CardValue
                value={rawEarned + (isElevationFarm ? rawVesting : 0)}
                decimals={3}
                elevation={elevation}
                fontSize="22px"
              />
              <HighlightedText bold monospace mt="-8px" elevation={elevation}>
                {earnLabel}
              </HighlightedText>
            </InfoItemValue>
          </FlexInfoItem>

          <FlexMobileLineBreak />
          {isElevationFarm && (
            <FlexInfoItem>
              <Text bold fontSize="14px">
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
          )}
          <FlexInfoItem>
            <Text fontSize="14px">Deposited</Text>
            <InfoItemValue>
              <CardValue value={userStakedBalance.toNumber()} prefix='$' decimals={2} elevation={elevation} fontSize="22px" />
            </InfoItemValue>
          </FlexInfoItem>

          { isElevationFarm && <FlexMobileLineBreak /> }

          <FlexInfoItem>
            <Text fontSize="14px">APY</Text>
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
            <Text fontSize="14px">TVL</Text>
            <InfoItemValue>
              <Text bold monospace style={{ display: 'flex', alignItems: 'center', lineHeight: '28px' }}>
                {totalValueFormatted}
              </Text>
            </InfoItemValue>
          </FlexInfoItem>
        </FarmNumericalInfoFlex>
      </PressableFlex>

      <FarmCardUserSection
        expanded={expanded}
        ethereum={ethereum}
        userTotem={userTotem}
        elevation={elevation}
        farm={farm}
        account={account}
      />
    </FCard>
  )
}

export default FarmCard
