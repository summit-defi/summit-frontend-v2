import React, { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import styled, { css } from 'styled-components'
import { Flex, Text } from 'uikit'
import { BN_ZERO, Elevation, ElevationFarmTab, elevationFarmTabToUrl, elevationUtils } from 'config/constants/types'
import { useElevationFarmsTab, useSingleFarmSelected } from 'state/hooks'
import { NavLink } from 'react-router-dom'
import FarmCardUserSectionExpander from './FarmCardUserSectionExpander'
import FarmIconAndAllocation from './FarmIconAndAllocation'
import FarmStakingContribution, { ElevationsStaked } from './FarmStakingContribution'
import { makeSelectFarmBySymbol, useSelector, useFarmsUserDataLoaded, useFarmFilters } from 'state/hooksNew'
import { FarmAPYBreakdown, FarmTotalValue } from './FarmCardInfoItems'
import { FarmRetiredSash } from './FarmRetiredSash'
import { getFarmInteracting, getFarmType } from 'utils'
import { FarmType } from 'state/types'

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

const PressableFlex = styled.div<{ $expanded: boolean }>`
  display: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  padding: 16px 20px 16px 20px;
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

const PressableBackground = styled(NavLink)`
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  cursor: pointer;
`

const FarmNumericalInfoFlex = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
  gap: 12px;
  width: 100%;
`



interface FarmCardProps {
  symbol: string
}

const FarmCard: React.FC<FarmCardProps> = ({ symbol }) => {
  const { farmType, liveFarms } = useFarmFilters()
  const farmBySymbolSelector = useMemo(makeSelectFarmBySymbol, [])
  const farm = useSelector((state) => farmBySymbolSelector(state, symbol))
  const pricePerToken = useSelector((state) => state.prices.pricesPerToken[symbol] || new BigNumber(1))
  const elevationTab = useElevationFarmsTab()
  const singleFarmSymbol = useSingleFarmSelected()
  const userDataLoaded = useFarmsUserDataLoaded()
  const expanded = singleFarmSymbol === symbol

  const {
    allocation,
    decimals,
    summitPerYear,
    elevations,
  } = farm

  const {
    comment: farmComment,
    warning: farmWarning,
    supply: lpSupply,
    live = true,
  } = farm.elevations[elevationTab] || {}

  const isInteracting = useMemo(
    () => getFarmInteracting(farm),
    [farm],
  )

  const farmElevationsStaked = useMemo(
    (): ElevationsStaked => elevationUtils.all.reduce((acc, elev) => ({
      ...acc,
      [elev]: elevations[elev]?.stakedBalance || BN_ZERO,
    }), {
      [Elevation.OASIS]: BN_ZERO,
      [Elevation.PLAINS]: BN_ZERO,
      [Elevation.MESA]: BN_ZERO,
      [Elevation.SUMMIT]: BN_ZERO,
    }),
    [elevations]
  )

  const totalValue: BigNumber = useMemo(
    () => {
      let supply = BN_ZERO
      if (elevationTab === ElevationFarmTab.DASH) {
        elevationUtils.all.forEach((elev) => {
          supply = supply.plus(elevations[elev].supply || BN_ZERO)
        })
      } else {
        supply = lpSupply
      }
      if (supply == null) return new BigNumber(0)
      return supply.div(new BigNumber(10).pow(decimals)).times(pricePerToken)
    },
    [lpSupply, elevationTab, elevations, pricePerToken, decimals]
  )

  const targetUrl = `/${(elevationFarmTabToUrl[elevationTab] || 'elevations').toLowerCase()}${expanded ? '' : `/${symbol.toLowerCase()}`}`

  const retired = (!live || allocation === 0)
  const liveFilterShow = (isInteracting && liveFarms) || (liveFarms !== retired)
  if (!liveFilterShow) return null

  const farmTypeShow = farmType === FarmType.All || getFarmType(farm) === farmType
  if (!farmTypeShow) return null


  return (
    <FCard $locked={false} $expanded={expanded}>
      <PressableFlex $expanded={expanded}>
        <PressableBackground to={targetUrl}/>
        { farmComment != null && <Text monospace bold italic fontSize='13px' mb='14px' textAlign='center'>* {farmComment}</Text> }
        { farmWarning != null && <Text monospace bold italic fontSize='13px' color='red' mb='14px' textAlign='center'>* {farmWarning}</Text> }
        <FarmNumericalInfoFlex>
          <FarmIconAndAllocation symbol={symbol} allocation={allocation} live={live}/>
          <FarmStakingContribution symbol={symbol} userDataLoaded={userDataLoaded} elevationsStaked={farmElevationsStaked} pricePerToken={pricePerToken} decimals={decimals}/>
          <FarmAPYBreakdown summitPerYear={summitPerYear} totalValue={totalValue}/>
          <FarmTotalValue totalValue={totalValue}/>
        </FarmNumericalInfoFlex>
      </PressableFlex>

      { retired && <FarmRetiredSash/> }

      <FarmCardUserSectionExpander
        isExpanded={expanded}
        symbol={symbol}
      />
    </FCard>
  )
}

export default React.memo(FarmCard)
