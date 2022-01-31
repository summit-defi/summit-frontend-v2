import React, { useEffect, useMemo, useState, useRef } from 'react'
import BigNumber from 'bignumber.js'
import styled, { css } from 'styled-components'
import { Flex, Text } from 'uikit'
import { BN_ZERO, Elevation, ElevationFarmTab, elevationFarmTabToUrl, elevationUtils } from 'config/constants/types'
import { useElevationFarmsTab, useSingleFarmSelected } from 'state/hooks'
import { NavLink } from 'react-router-dom'
import FarmCardUserSectionExpander from './FarmCardUserSectionExpander'
import FarmIconAndAllocation from './FarmIconAndAllocation'
import FarmStakingContribution, { ElevationsStaked } from './FarmStakingContribution'
import { makeSelectFarmBySymbol, useSelector } from 'state/hooksNew'
import { FarmAPYBreakdown, FarmTotalValue } from './FarmCardInfoItems'

const FCard = styled(Flex)<{ $locked: boolean; $expanded: boolean }>`
  scroll-margin: 128px;
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
  padding: 16px 20px 16px 20px;
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



interface FarmCardProps {
  symbol: string
}

const FarmCard: React.FC<FarmCardProps> = ({ symbol }) => {
  const farmBySymbolSelector = useMemo(makeSelectFarmBySymbol, [])
  const farm = useSelector((state) => farmBySymbolSelector(state, symbol))
  const pricePerToken = useSelector((state) => state.prices.pricesPerToken[symbol] || new BigNumber(1))
  const elevationTab = useElevationFarmsTab()
  const singleFarmSymbol = useSingleFarmSelected()
  const expanded = singleFarmSymbol === symbol
  const farmCardRef = useRef(null)
  const [currentTab, setCurrentTab] = useState(elevationTab)

  useEffect(
    () => {
      if (currentTab !== elevationTab && expanded) {
        const top = farmCardRef.current.getBoundingClientRect().top
        const isVisible = (top + 200) >= 0 && top <= window.innerHeight
        setCurrentTab(currentTab)
        
        if (isVisible) {
          farmCardRef.current.scrollIntoView({
            behavior: 'smooth'
          })
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [elevationTab]
  )

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
  } = farm.elevations[elevationTab] || {}


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


  return (
    <FCard $locked={false} ref={farmCardRef} $expanded={expanded}>
      <PressableFlex to={targetUrl} $expanded={expanded}>
        { farmComment != null && <Text monospace bold italic fontSize='13px' mb='14px' textAlign='center'>* {farmComment}</Text> }
        { farmWarning != null && <Text monospace bold italic fontSize='13px' color='red' mb='14px' textAlign='center'>* {farmWarning}</Text> }
        <FarmNumericalInfoFlex>
          <FarmIconAndAllocation symbol={symbol} allocation={allocation}/>
          <FarmStakingContribution elevationsStaked={farmElevationsStaked} pricePerToken={pricePerToken} decimals={decimals}/>
          <FarmAPYBreakdown summitPerYear={summitPerYear} totalValue={totalValue}/>
          <FarmTotalValue totalValue={totalValue}/>
        </FarmNumericalInfoFlex>
      </PressableFlex>

      <FarmCardUserSectionExpander
        isExpanded={expanded}
        symbol={symbol}
      />
    </FCard>
  )
}

export default React.memo(FarmCard)
