import React from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import SummitButton from 'uikit/components/Button/SummitButton'
import { ElevationFarmTab, elevationFarmTabToUrl, elevationTabToElevation, elevationUtils, SummitPalette } from 'config/constants/types'
import { pressableMixin } from 'uikit/util/styledMixins'
import { useElevationFarmsTab, useSingleFarmSelected } from 'state/hooks'
import { Link } from 'react-router-dom'
import Flex from 'uikit/components/Box/Flex'
import { Text } from 'uikit/components/Text'
import ElevationTabTotemIcon from './ElevationTabTotemIcon'
import { useUserTotemsAndCrowns } from 'state/hooksNew'
import { SelectorWrapperBase } from 'uikit/widgets/Selector/styles'

const buttonWidth = 68
const buttonHeight = 46

const SelectorFlex = styled(Flex)`
    position: relative;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

const SelectorWrapper = styled(SelectorWrapperBase) <{
    tabsCount: number
}>`
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: ${buttonHeight}px;
    width: ${({ tabsCount }) => buttonWidth * tabsCount}px;
    border-radius: ${buttonHeight}px;
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

const TextButton = styled(Link)<{
    selected: boolean,
    $crowned: boolean,
}>`
    width: ${buttonWidth}px;
    height: ${buttonHeight}px;
    pointer-events: ${({ selected }) => selected ? 'none' : 'auto'};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    ${pressableMixin};

    &:hover {
        > .selectableIcon .totem-background-circle {
            box-shadow: 2px 2px 4px ${({ theme, $crowned }) => $crowned ? 'white' : theme.colors.textShadow};
        }
    }
    &:active {
        > .selectableIcon .totem-background-circle {
            box-shadow: none;
        }
    }
`

const TextButtonText = styled(Text)<{
    tab: string
    selected: boolean
}>`
    text-align: center;
    line-height: 14px;
    color: ${({ theme, tab }) => tab === ElevationFarmTab.DASH && theme.isDark ?
        theme.colors.text :
        darken(tab === ElevationFarmTab.DASH ? 0 : 0.2, theme.colors[tab])
    };
    text-shadow: 1px 1px 2px ${({ theme, tab }) => darken(0.2, theme.colors[tab])};
`

const tabs = [ElevationFarmTab.DASH, ElevationFarmTab.OASIS, ElevationFarmTab.PLAINS, ElevationFarmTab.MESA, ElevationFarmTab.SUMMIT]

const ElevationFarmsTabSelector: React.FC = () => {
    const selectedTab = useElevationFarmsTab()
    const singleFarmSymbol = useSingleFarmSelected()
    const selectedIndex = tabs.findIndex((tab) => tab === selectedTab)
    const userTotemsAndCrowned = useUserTotemsAndCrowns()
    const { crowned: selectedTabCrowned } = userTotemsAndCrowned[elevationUtils.tabToInt(selectedTab)] || {}

    const buttonPalette = selectedTab !== ElevationFarmTab.DASH && selectedTabCrowned ?
        SummitPalette.GOLD :
        selectedTab

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
                        summitPalette={ buttonPalette }
                    >
                        {selectedTab}
                        {selectedTab === ElevationFarmTab.DASH && <br/>}
                        {selectedTab === ElevationFarmTab.DASH && 'BOARD'}
                    </SelectedSummitButton>
                )}
                {tabs.map((tab) => {
                    const tabTarget = `/${elevationFarmTabToUrl[tab]}${singleFarmSymbol != null ? `/${singleFarmSymbol.toLowerCase()}` : ''}`
                    const { userTotem, crowned } = userTotemsAndCrowned[elevationUtils.tabToInt(tab)] || {}
                    return (
                        <TextButton
                            key={tab}
                            to={tabTarget}
                            selected={tab === selectedTab}
                            $crowned={crowned}
                            replace
                        >
                            { (tab === ElevationFarmTab.DASH || userTotem == null) ?
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
                                    totem={userTotem}
                                    crowned={crowned}
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
