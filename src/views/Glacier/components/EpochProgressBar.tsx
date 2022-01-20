import { Elevation } from 'config/constants'
import React from 'react'
import styled, { css } from 'styled-components'
import { darken } from 'polished'
import { breakTextBr, Flex, Text, TriangleGrowIcon } from 'uikit'

const EndMarkerHeight = 55

const EndMarkerWrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    width: 1px;
    height: ${EndMarkerHeight}px;
`

const MarkerWrapper = styled.div<{ progress: number }>`
    position: relative;
    display: flex;
    justify-content: center;
    width: 1px;
    height: ${EndMarkerHeight}px;
    left: ${({ progress }) => (progress * 100) - 100}%;
`

const EndMarkerText = styled(Text)<{ top: boolean }>`
    position: absolute;
    font-size: 12px;
    line-height: 18px;
    white-space: nowrap;
    top: ${({ top }) => top ? 0 : EndMarkerHeight - 18}px;
    bottom: ${({ top }) => top ? EndMarkerHeight - 18 : 0}px;
`

const MarkerText = styled(Text)`
    position: absolute;
    font-size: 12px;
    line-height: 18px;
    padding-left: 6px;
    padding-right: 6px;
    top: ${EndMarkerHeight - 18}px;
    bottom: 0px;
    background-color: ${({ theme }) => theme.colors.cardHover};
`

const MarkerBar = styled.div<{ elevation?: Elevation }>`
    width: 6px;
    position: absolute;
    top: 15px;
    bottom: 15px;
    left: -3px;
    border-radius: 3px;
    background-color: ${({ theme, elevation }) => darken(0.1, theme.colors[elevation || 'BASE'])};
    box-shadow: ${({ theme }) => `1px 1px 2px ${theme.colors.textShadow}`};
`

const VerticalBar = styled.div`
    width: 1px;
    position: absolute;
    top: 20px;
    bottom: 20px;
    background-color: ${({ theme }) => theme.colors.text};
`

const BarFlex = styled(Flex)`
    position: relative;
    flex-direction: row;
    align-items: center;
    margin-left: 20px;
    margin-right: 20px;
    flex: 1;
    min-width: 100px;
`
const HorizontalBar = styled.div`
    width: 100%;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.text};
`

const Wrapper = styled(Flex)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex: 1;
    max-width: 350px;
`

interface Props {
    epoch: number
}

interface EndMarkerProps {
    title?: string
    perc?: number
}

interface MarkerProps {
    timeRemainingText: string
    progress: number
}

const EndMarker: React.FC<EndMarkerProps> = ({title, perc}) => {
    return <EndMarkerWrapper>
        {title != null && <EndMarkerText monospace top>{title}</EndMarkerText>}
        <VerticalBar/>
        {perc != null && <EndMarkerText monospace bold top={false}>{perc}%</EndMarkerText>}
    </EndMarkerWrapper>
}

const Marker: React.FC<MarkerProps> = ({timeRemainingText, progress}) => {
    return <MarkerWrapper progress={progress}>
        <MarkerText monospace bold>{timeRemainingText}</MarkerText>
        <MarkerBar/>
    </MarkerWrapper>
}

const EpochProgressBar: React.FC<Props> = ({ epoch }) => {
    const { startTimestamp, endTimestamp } = getEpochTimestamps(epoch)
    const startDate = timestampToDate(startTimestamp)
    const endDate = timestampToDate(endTimestamp)
    const currentTimestamp = 100
    const progress = (currentTimestamp - startTimestamp) / (endTimestamp - startTimestamp)
    return (
        <Wrapper>
            <BarFlex flexDirection='row' alignItems='center'>
                <EndMarker title={startDate}/>
                <HorizontalBar/>
                <EndMarker title={endDate}/>
                <Marker timeRemainingText='02D 06H 21M' progress={progress}/>
            </BarFlex>
        </Wrapper>
    )
}

export default React.memo(EpochProgressBar)
