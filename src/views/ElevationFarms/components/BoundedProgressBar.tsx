import { Elevation } from 'config/constants'
import React from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { Flex, Text } from 'uikit'

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
    background-color: ${({ theme }) => theme.colors.background};
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
    margin-left: 30px;
    margin-right: 30px;
    flex-direction: row;
    align-items: center;
    flex: 1;
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
    width: 300px;
`

interface Props {
    title?: string
    minTitle?: string
    maxTitle?: string
    minVal?: string
    maxVal?: string
    currVal?: string
    progress: number
    elevation?: Elevation
}

interface EndMarkerProps {
    title?: string
    val?: string
}

interface MarkerProps {
    val?: string
    progress: number
    elevation?: Elevation
}

const EndMarker: React.FC<EndMarkerProps> = ({title, val}) => {
    return <EndMarkerWrapper>
        {title != null && <EndMarkerText monospace top>{title}</EndMarkerText>}
        <VerticalBar/>
        {val != null && <EndMarkerText monospace bold top={false}>{val}</EndMarkerText>}
    </EndMarkerWrapper>
}

const Marker: React.FC<MarkerProps> = ({val, progress, elevation}) => {
    return <MarkerWrapper progress={progress}>
        {val != null && <MarkerText monospace bold>{val}</MarkerText>}
        <MarkerBar elevation={elevation}/>
    </MarkerWrapper>
}

const BoundedProgressBar: React.FC<Props> = ({title, minTitle, maxTitle, minVal, maxVal, currVal, progress, elevation}) => {
  return (
    <Wrapper>
        { title != null && <Text bold monospace>{title}</Text> }
        { (minVal != null && maxVal != null) ?
            <>
                <BarFlex flexDirection='row' alignItems='center'>
                    <EndMarker title={minTitle} val={minVal}/>
                    <HorizontalBar/>
                    <EndMarker title={maxTitle} val={maxVal}/>
                    <Marker val={currVal} progress={progress} elevation={elevation}/>
                </BarFlex>
            </> :
            <>
            </>
        }
    </Wrapper>
  )
}

export default React.memo(BoundedProgressBar)
