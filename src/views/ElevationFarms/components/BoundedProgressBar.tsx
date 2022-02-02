import { Elevation } from 'config/constants'
import React from 'react'
import styled, { css } from 'styled-components'
import { darken } from 'polished'
import { breakTextBr, Flex, Text, TriangleGrowIcon } from 'uikit'
import { useSelectedElevation } from 'state/hooks'

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
    font-size: ${({ top }) => top ? 11 : 12}px;
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
    width: 2px;
    position: absolute;
    top: 15px;
    bottom: 15px;
    left: -1px;
    /* border-radius: 3px; */
    background-color: ${({ theme, elevation }) => darken(0.1, theme.colors[elevation || 'BASE'])};
    /* box-shadow: ${({ theme }) => `1px 1px 2px ${theme.colors.textShadow}`}; */
`

const VerticalBar = styled.div`
    width: 1px;
    position: absolute;
    top: 20px;
    bottom: 20px;
    background-color: ${({ theme }) => theme.colors.text};
`

const BarFlex = styled(Flex)<{ single: boolean }>`
    position: relative;
    flex-direction: row;
    align-items: center;

    ${({ single }) => single ? css`
        margin-left: 10px;
        margin-right: 10px;
    ` : css`
        margin-left: 20px;
        margin-right: 20px;
        flex: 1;
        min-width: 100px;
    `}
`

const Wrapper = styled(Flex)<{ single: boolean }>`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex: ${({ single }) => single ? 0 : 1};
    max-width: 350px;
`

const StyledTriangleGrowIcon = styled(TriangleGrowIcon)`
    opacity: 0.3;
`

const ProgressionTriangleClip = styled.div`
    position: absolute;
    left: 0;
    width: 50px;
    height: 15px;
    overflow: hidden;
`

const ProgressionTriangleGrowIcon = styled(TriangleGrowIcon)<{ elevation?: Elevation }>`
    position: absolute;
    left: 0;
    opacity: 1;
    fill: ${({ theme, elevation }) => darken(0.1, theme.colors[elevation || 'BASE'])};
`

interface Props {
    title?: string
    minTitle?: string
    maxTitle?: string
    leftPerc?: number
    rightPerc?: number
    currPerc?: number
}

interface EndMarkerProps {
    title?: string
    perc?: number
}

interface MarkerProps {
    perc?: number
    progress: number
    elevation?: Elevation
}

const EndMarker: React.FC<EndMarkerProps> = ({title, perc}) => {
    return <EndMarkerWrapper>
        {title != null && <EndMarkerText monospace top>{title}</EndMarkerText>}
        <VerticalBar/>
        {perc != null && <EndMarkerText monospace top={false}>{perc}%</EndMarkerText>}
    </EndMarkerWrapper>
}

const Marker: React.FC<MarkerProps> = ({perc, progress, elevation}) => {
    return <MarkerWrapper progress={progress}>
        {perc != null && <MarkerText monospace bold>{perc}%</MarkerText>}
        <MarkerBar elevation={elevation}/>
    </MarkerWrapper>
}

const BoundedProgressBar: React.FC<Props> = ({title, minTitle, maxTitle, leftPerc, rightPerc, currPerc}) => {
    const elevation = useSelectedElevation()

    const progress = (currPerc - leftPerc) / (rightPerc - leftPerc)
    const single = (leftPerc == null && rightPerc == null)
    return (
        <Wrapper single={single}>
            { title != null && <Text bold monospace small textAlign='center' lineHeight='14px' style={{ width: '70px' }}>{breakTextBr(title)}</Text> }
            <BarFlex flexDirection='row' alignItems='center' single={single}>
                { !single &&
                    <>
                        <EndMarker title={minTitle} perc={leftPerc}/>
                        <StyledTriangleGrowIcon width='100%' height='15px' left={leftPerc} right={rightPerc}/>
                        <ProgressionTriangleGrowIcon width={`calc(${progress * 100}% + 1px)`} height='15px' left={leftPerc} right={currPerc} elevation={elevation}/>
                        <EndMarker title={maxTitle} perc={rightPerc}/>
                    </>
                }
                <Marker perc={currPerc} progress={progress} elevation={elevation}/>
            </BarFlex>
        </Wrapper>
    )
}

export default React.memo(BoundedProgressBar)
