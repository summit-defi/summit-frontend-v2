import React from 'react'
import styled from 'styled-components'
import { Flex } from 'uikit'
import { useRoadmapScreenshot } from 'state/hooksNew'
import PresetStrategySelector from './components/PresetStrategySelector'
import ScreenshotButton from './components/ScreenshotButton'
import {RoadmapTotemRow, RoadmapExpedition} from './components/RoadmapTotemRow'
import RoadmapEverest from './components/RoadmapEverest'
import RoadmapNameAndDescription from './components/RoadmapNameAndDescription'
import RoadmapStakingBreakdown from './components/RoadmapStakingBreakdown'
import StrategyTextInput from './components/RoadmapTextInputs'
import { useMediaQuery } from 'state/hooks'


const RoadmapWrapper = styled.div<{ screenshot: boolean }>`
    min-height: calc(100vh - 64px);
    padding-left: 8px;
    padding-right: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    gap: 48px;
    padding-bottom: 128px;
    
    ${({ theme }) => theme.mediaQueries.nav} {
        padding-top: ${({ screenshot }) => screenshot ? 0 : 144}px;
        padding-bottom: ${({ screenshot }) => screenshot ? 0 : 32}px;
        gap: 0px;
    }
`

const ButtonRow = styled.div<{ screenshot: boolean }>`
    width: 100%;
    gap: 8px;
    max-width: ${({ screenshot }) => screenshot ? 'none' : '850px'};
    display: flex;
    align-items: center;
    justify-content: ${({ screenshot }) => screenshot ? 'space-between' : 'center'};
    padding-left: ${({ screenshot }) => screenshot ? 12 : 0 }px;
    top: 0;
    flex-direction: column;
    
    ${({ theme }) => theme.mediaQueries.nav} {
        height: ${({ screenshot }) => screenshot ? 'auto' : '120px'};
        justify-content: space-between;
        flex-direction: row;
        position: absolute;
    }
`

const ScreenshotSelectorWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    ${({ theme }) => theme.mediaQueries.nav} {
        width: unset;
        justify-content: center;
        align-items: flex-start;
    }
`

const TravelersRoadmap: React.FC = () => {
    const screenshot = useRoadmapScreenshot()
    const isMobile = useMediaQuery('(max-width: 968px)')

    return (
        <RoadmapWrapper screenshot={screenshot}>
            <ButtonRow screenshot={screenshot}>
                <ScreenshotSelectorWrapper>
                    <ScreenshotButton/>
                    {!screenshot && <PresetStrategySelector/> }
                </ScreenshotSelectorWrapper>
                {!screenshot && <StrategyTextInput/> }
            </ButtonRow>
            {screenshot && <RoadmapNameAndDescription/>}
            { !isMobile && <RoadmapTotemRow /> }
            <Flex flexWrap='wrap' width='100%' maxWidth='850px' justifyContent='space-between' alignItems='flex-start'>
                <RoadmapStakingBreakdown />
                { isMobile && <RoadmapTotemRow /> }
                <RoadmapEverest />
                <RoadmapExpedition />
            </Flex>
        </RoadmapWrapper>
    )
}

export default TravelersRoadmap
