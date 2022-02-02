import { Elevation } from 'config/constants'
import React from 'react'
import styled, { css } from 'styled-components'
import { darken } from 'polished'
import { breakTextBr, Flex, HeaderInfoQuestion, Text, TooltipModalType, TriangleGrowIcon, useModal } from 'uikit'
import { useSelectedElevation } from 'state/hooks'
import TooltipModal from 'uikit/widgets/Modal/TooltipModal'
import { pressableMixin } from 'uikit/util/styledMixins'

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
    align-items: center;
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
    font-size: 13px;
    line-height: 18px;
    padding-left: 6px;
    padding-right: 6px;
    top: ${EndMarkerHeight - 18}px;
    bottom: 0px;
    background-color: ${({ theme }) => theme.colors.cardHover};
`

const MarkerBar = styled.div<{ elevation?: Elevation }>`
    width: 4px;
    position: absolute;
    height: 24px;
    left: -2px;
    background-color: ${({ theme, elevation }) => darken(0.1, theme.colors[elevation || 'BASE'])};
`

const VerticalBar = styled.div`
    width: 2px;
    position: absolute;
    top: 20px;
    bottom: 20px;
    background-color: ${({ theme }) => theme.colors.text};
`

const BarFlex = styled(Flex)<{ single: boolean }>`
    position: relative;
    flex-direction: row;
    align-items: center;
    width: calc(100% - 40px);

    ${({ single }) => single ? css`
        margin-left: 10px;
        margin-right: 10px;
        align-items: flex-start;
    ` : css`
        min-width: 175px;
    `}
`

const Wrapper = styled(Flex)<{ single: boolean }>`
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: ${({ single }) => single ? 0 : 1};
    max-width: 350px;
`

const StyledTriangleGrowIcon = styled(TriangleGrowIcon)`
    opacity: 0.3;
`

const ProgressionTriangleGrowIcon = styled(TriangleGrowIcon)<{ elevation?: Elevation }>`
    position: absolute;
    left: 0;
    opacity: 1;
    fill: ${({ theme, elevation }) => darken(0.1, theme.colors[elevation || 'BASE'])};
`

const HeaderInfoQuestionButton = styled(HeaderInfoQuestion)`
    cursor: pointer;
`

interface Props {
    title: string
    minTitle?: string
    maxTitle?: string
    leftPerc?: number
    rightPerc?: number
    currPerc?: number
    tooltipType: TooltipModalType
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

const BoundedProgressBar: React.FC<Props> = ({title, minTitle, maxTitle, leftPerc, rightPerc, currPerc, tooltipType}) => {
    const elevation = useSelectedElevation()

    const progress = (currPerc - leftPerc) / (rightPerc - leftPerc)
    const single = (leftPerc == null && rightPerc == null)

    const [onPresentTooltipModal] = useModal(
        <TooltipModal tooltipType={tooltipType}/>
    ) 

    return (
        <Wrapper single={single}>
            <Flex alignItems='center' justifyContent='center' width='100%' gap='8px'>
                <Text bold monospace small textAlign='center' lineHeight='14px'>
                    {title}
                </Text>
                <HeaderInfoQuestionButton onClick={onPresentTooltipModal}/>
            </Flex>
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
