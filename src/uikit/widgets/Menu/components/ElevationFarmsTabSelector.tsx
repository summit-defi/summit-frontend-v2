import React from 'react'
import styled, { css } from 'styled-components'
import { Flex, Lock } from 'uikit'
import SummitButton from 'uikit/components/Button/SummitButton'
import { darken } from 'polished'
import { Elevation, ElevationFarmTab, elevationFarmTabToUrl } from 'config/constants/types'
import { pressableMixin } from 'uikit/util/styledMixins'
import { useElevationFarmsTab, useSingleFarmSelected } from 'state/hooks'
import { NavLink } from 'react-router-dom'

const buttonWidth = 80
const buttonHeight = 46

const SelectorFlex = styled(Flex)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const SelectorWrapper = styled(Flex) <{
    tabsCount: number
}>`
  flex-direction: row;
  justify-content: center;
  height: ${buttonHeight}px;
  width: ${({ tabsCount }) => buttonWidth * tabsCount}px;
  border-radius: ${buttonHeight}px;
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => `inset 2px 2px 4px ${theme.colors.textShadow}`};
  position: relative;
`

const SelectedSummitButton = styled(SummitButton) <{
    selectedIndex: number
}>`
  pointer-events: none;
  position: absolute;
  top: 2px;
  border-radius: ${buttonHeight - 4}px;
  height: ${buttonHeight - 4}px;
  width: ${buttonWidth - 4}px;
  left: ${({ selectedIndex }) => selectedIndex * buttonWidth + 2}px;
  z-index: 3;
  font-size: 14px;
`

const TextButton = styled(NavLink)<{
    tab: string
    selected: boolean
}>`
    width: ${buttonWidth}px;
    pointer-events: ${({ selected }) => selected ? 'none' : 'auto'};
    cursor: pointer;
    color: ${({ theme, tab }) => darken(0.2, theme.colors[tab])};
    text-shadow: 1px 1px 2px ${({ theme, tab }) => darken(0.2, theme.colors[tab])};
    font-family: Courier Prime, monospace;
    font-size: 14px;
    height: ${buttonHeight}px;
    line-height: ${buttonHeight}px;
    text-align: center;

    transition: transform 0.2s;

    ${pressableMixin};
`

const tabs = [ElevationFarmTab.DASH, ElevationFarmTab.OASIS, ElevationFarmTab.PLAINS, ElevationFarmTab.MESA, ElevationFarmTab.SUMMIT]

const ElevationFarmsTabSelector: React.FC = () => {
    const selectedTab = useElevationFarmsTab()
    const singleFarmSymbol = useSingleFarmSelected()
    const selectedIndex = tabs.findIndex((tab) => tab === selectedTab)

    return (
        <SelectorFlex>
            <SelectorWrapper
                tabsCount={tabs.length}
            >
                {selectedTab != null && (
                    <SelectedSummitButton
                        tab={selectedTab}
                        selectedIndex={selectedIndex}
                        padding="0px"
                        elevation={selectedTab}
                    >
                        {selectedTab}
                    </SelectedSummitButton>
                )}
                {tabs.map((tab) => {
                    const tabTarget = `/${elevationFarmTabToUrl[tab]}${singleFarmSymbol != null ? `/${singleFarmSymbol.toLowerCase()}` : ''}`
                    return (
                        <TextButton
                            key={tab}
                            tab={tab}
                            to={tabTarget}
                            selected={tab === selectedTab}
                        >
                            {tab}
                        </TextButton>
                    )
                })}
            </SelectorWrapper>
        </SelectorFlex>
    )
}

export default React.memo(ElevationFarmsTabSelector)
