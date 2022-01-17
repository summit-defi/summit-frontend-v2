import { Elevation } from 'config/constants'
import React from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { Flex, Text, TokenSymbolImage } from 'uikit'

const BarHeight = 50

const ContributionWrapper = styled.div<{ perc: number }>`
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: ${({ perc }) => perc}%;
    height: ${BarHeight}px;
`

const TitleWrapper = styled(Flex)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: absolute;
    height: 36px;
    top: -16px;
    width: 100%;
    gap: 4px;
    flex-wrap: wrap;
    overflow: hidden;
`

const ValueText = styled(Text)<{ top: boolean }>`
    position: absolute;
    font-size: 12px;
    line-height: 18px;
    height: 18px;
    flex-wrap: wrap;
    overflow: hidden;
    top: ${({ top }) => top ? 0 : BarHeight - 18}px;
    bottom: ${({ top }) => top ? BarHeight - 18 : 0}px;
    text-align: center;
`

const MarkerText = styled(Text)`
    position: absolute;
    font-size: 12px;
    line-height: 18px;
    padding-left: 6px;
    padding-right: 6px;
    top: ${BarHeight - 18}px;
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

const VerticalBar = styled.div<{ perc: number }>`
    width: 1px;
    position: absolute;
    height: 20px;
    background-color: ${({ theme }) => theme.colors.text};
    left: ${({ perc }) => perc}%;
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
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.text};
`

const Wrapper = styled(Flex)`
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
`

const BarWrapper = styled(Flex)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 75px;
`




interface Contribution {
    token?: boolean
    title?: string
    val?: string
    html?: JSX.Element
    key: number
    perc: number
}

const ContributionComponent: React.FC<Contribution> = ({token = false, title, val, html, perc}) => {
    return <ContributionWrapper perc={perc}>
        {title != null && <TitleWrapper>
            { token && <TokenSymbolImage symbol={title} width={36} height={36} />}
            <Text monospace lineHeight='14px' fontSize='12px' textAlign='center'>{title}</Text>
        </TitleWrapper>}
        <VerticalBar perc={100}/>
        <ValueText monospace bold top={false}>{val != null ? val : `${perc}%`}</ValueText>
    </ContributionWrapper>
}

interface Props {
    title?: string
    contributions: Contribution[]
}

const ContributionBreakdown: React.FC<Props> = ({title, contributions}) => {
  return (
    <Wrapper>
        { title != null && <Text bold monospace>{title}</Text> }
        <BarWrapper>
            <VerticalBar perc={0}/>
            <HorizontalBar/>
            {contributions.map((contribution) => 
                <ContributionComponent key={contribution.key} {...contribution} />
            )}
            {contributions.length === 0 &&
                <VerticalBar perc={100}/>
            }
        </BarWrapper>
    </Wrapper>
  )
}

export default React.memo(ContributionBreakdown)
