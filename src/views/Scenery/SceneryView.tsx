import React, { useState } from 'react'
import Page from 'components/layout/Page'
import styled from 'styled-components'
import { ElevationPuck, ExternalLinkButton, Flex, Text } from 'uikit'
import { Elevation, getPriceableTokens, SceneryStrategy, TokenSymbol } from 'config/constants'
import { ChainIncludesBetaTokens } from 'utils'
import BigNumber from 'bignumber.js'
import { useSceneryScreenshot, useUserSceneryStrategy } from 'state/hooksNew'
import PresetStrategySelector from './components/PresetStrategySelector'
import ScreenshotButton from './components/ScreenshotButton'
import SceneryTotemRow from './components/SceneryTotemRow'
import SceneryEverestAndExpedition from './components/SceneryEverestAndExpedition'
import SceneryNameAndDescription from './components/SceneryNameAndDescription'
import SceneryStakingBreakdown from './components/SceneryStakingBreakdown'


const SceneryWrapper = styled.div<{ screenshot: boolean }>`
    min-height: calc(100vh - 64px);
    padding-bottom: 128px;
    padding-left: 8px;
    padding-right: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    padding-top: ${({ screenshot }) => screenshot ? 0 : 164}px;

    ${({ theme }) => theme.mediaQueries.nav} {
        padding-bottom: 64px;
    }
`

const ButtonRow = styled.div<{ screenshot: boolean }>`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: ${({ screenshot }) => screenshot ? 'flex-start' : 'center'};
    padding-left: ${({ screenshot }) => screenshot ? 12 : 0 }px;
    height: 120px;
    position: absolute;
    top: 0;

    ${({ theme }) => theme.mediaQueries.nav} {
        justify-content: flex-start;
    }
`


const PredefinedStrategyNames = [
    'User Strategy',
    'The Yankee Degen',
    'Balance In All Things',
    'Safe and Sound'
]

const PredefinedStrategies: SceneryStrategy[] = [
    {
        name: 'The Yankee Degen',
        description: 'The Yankee Degen jumps on any Totem arb opportunity > 0.01%. Always 100% Faith in the Bear, the payouts when it hits are Euphoric. Max lock time is the only way.',
        farming: {
            [Elevation.OASIS]: {
                totem: 0,
                loyalty: 1,
                perc: 10,
            },
            [Elevation.PLAINS]: {
                totem: 1,
                loyalty: 1,
                perc: 0,
            },
            [Elevation.MESA]: {
                totem: 3,
                loyalty: 1,
                perc: 30,
            },
            [Elevation.SUMMIT]: {
                totem: 7,
                loyalty: 1,
                perc: 60,
            },
        },
        EVEREST: {
            lockedPerc: 80,
            lockDuration: 365,
        },
        [Elevation.EXPEDITION]: {
            deity: 1,
            deityLoyalty: 1,
            faith: 100,
        },
    },
]

const SceneryView: React.FC = () => {
    // const {
    //     - userTotems,
    //     - winningTotems,
    //     totemLoyalties,
    //     elevsStaked,
    //     faith,
    //     summitLockedForEverest,
    //     farmsStakedSummit,
    //     glacierFrozenSummit,
    //     avgStakingLoyaltyDuration
    // } = useSceneryInfo()

    const screenshot = useSceneryScreenshot()

    const userStrategy = useUserSceneryStrategy()
    const [selectedStrategy, selectStrategy] = useState(0)

    if (userStrategy == null) {
        console.log('Loading Strategy')
        return null // Return loading version
    }

    // const {
    //     name,
    //     description,
    //     farming,
    //     EVEREST,
    //     EXPEDITION,
    // } = userStrategy

    // console.log({
    //     name,
    //     description,
    //     farming,
    //     EVEREST,
    //     EXPEDITION,
    // })

  return (
    <SceneryWrapper screenshot={screenshot}>
        <ButtonRow screenshot={screenshot}>
            <ScreenshotButton/>
            {!screenshot &&
                <PresetStrategySelector
                    strategies={PredefinedStrategyNames}
                    selectedStrategy={selectedStrategy}
                    selectStrategy={selectStrategy}
                />
            }
        </ButtonRow>
        {screenshot && <SceneryNameAndDescription/>}
        <SceneryTotemRow />
        <SceneryStakingBreakdown />
        <SceneryEverestAndExpedition />
    </SceneryWrapper>
  )
}

export default SceneryView
