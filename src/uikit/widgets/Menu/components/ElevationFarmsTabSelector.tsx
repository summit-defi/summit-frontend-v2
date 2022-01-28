import React from 'react'
import styled, { css } from 'styled-components'
import { darken, transparentize } from 'polished'
import SummitButton from 'uikit/components/Button/SummitButton'
import { Elevation, ElevationFarmTab, elevationFarmTabToUrl, elevationTabToElevation, elevationUtils, SummitPalette } from 'config/constants/types'
import { pressableMixin } from 'uikit/util/styledMixins'
import { useElevationFarmsTab, useElevationTotems, useSingleFarmSelected } from 'state/hooks'
import { NavLink, useLocation } from 'react-router-dom'
import Flex from 'uikit/components/Box/Flex'
import { Text } from 'uikit/components/Text'
import ElevationTabTotemIcon from './ElevationTabTotemIcon'
import { MENU_HEIGHT } from '../config'
import { useWinningTotems } from 'state/hooksNew'

const buttonWidth = 68
const buttonHeight = 46

const SelectorFlex = styled(Flex)`
    position: relative;
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
    background-color: ${({ theme }) => theme.isDark ? theme.colors.cardHover : darken(0.1, theme.colors.background)};
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
    selected: boolean
}>`
    width: ${buttonWidth}px;
    height: ${buttonHeight}px;
    pointer-events: ${({ selected }) => selected ? 'none' : 'auto'};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;

    ${pressableMixin};
`

const TextButtonText = styled(Text)<{
    tab: string
    selected: boolean
}>`
    text-align: center;
    line-height: 14px;
    color: ${({ theme, tab }) => darken(tab === ElevationFarmTab.DASH ? 0 : 0.2, theme.colors[tab])};
    text-shadow: 1px 1px 2px ${({ theme, tab }) => darken(0.2, theme.colors[tab])};
`

const tabs = [ElevationFarmTab.DASH, ElevationFarmTab.OASIS, ElevationFarmTab.PLAINS, ElevationFarmTab.MESA, ElevationFarmTab.SUMMIT]

const ElevationFarmsTabSelector: React.FC = () => {
    const selectedTab = useElevationFarmsTab()
    const singleFarmSymbol = useSingleFarmSelected()
    const selectedIndex = tabs.findIndex((tab) => tab === selectedTab)
    const userTotems = useElevationTotems()
    const winningTotems = useWinningTotems()
    const tabCrowned = {
        [ElevationFarmTab.DASH]: false,
        [ElevationFarmTab.OASIS]: false,
        [ElevationFarmTab.PLAINS]: userTotems[1] === winningTotems[1],
        [ElevationFarmTab.MESA]: userTotems[2] === winningTotems[2],
        [ElevationFarmTab.SUMMIT]: userTotems[3] === winningTotems[3],
    }

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
                        summitPalette={ tabCrowned[selectedTab] ? SummitPalette.GOLD : selectedTab }
                    >
                        {selectedTab}
                        {selectedTab === ElevationFarmTab.DASH && <br/>}
                        {selectedTab === ElevationFarmTab.DASH && 'BOARD'}
                    </SelectedSummitButton>
                )}
                {tabs.map((tab) => {
                    const tabTarget = `/${elevationFarmTabToUrl[tab]}${singleFarmSymbol != null ? `/${singleFarmSymbol.toLowerCase()}` : ''}`
                    return (
                        <TextButton
                            key={tab}
                            to={tabTarget}
                            selected={tab === selectedTab}
                        >
                            { tab === ElevationFarmTab.DASH || userTotems[elevationUtils.tabToInt(tab)] == null ?
                                <TextButtonText
                                    monospace
                                    tab={tab}
                                    selected={tab === selectedTab}
                                >
                                    {tab}
                                    {tab === ElevationFarmTab.DASH && <br/>}
                                    {tab === ElevationFarmTab.DASH && 'BOARD'}
                                </TextButtonText> :
                                <ElevationTabTotemIcon
                                    selected={tab === selectedTab}
                                    elevation={elevationTabToElevation[tab]}
                                    totem={userTotems[elevationUtils.tabToInt(tab)]}
                                    crowned={tabCrowned[tab]}
                                />
                            }
                        </TextButton>
                    )
                })}
            </SelectorWrapper>
        </SelectorFlex>
    )
}

export default React.memo(ElevationFarmsTabSelector)
