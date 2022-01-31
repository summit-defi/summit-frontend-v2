import React from 'react'
import styled from 'styled-components'
import { ElevationImage, Flex, Text, TokenSymbolImage } from 'uikit'

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

const VerticalBar = styled.div<{ perc: number }>`
    width: 1px;
    position: absolute;
    height: 20px;
    background-color: ${({ theme }) => theme.colors.text};
    left: ${({ perc }) => perc}%;
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
    elevation?: boolean
    title?: string
    val?: string
    key: number
    perc: number
}

const ContributionComponent: React.FC<Contribution> = ({token = false, elevation = false, title, val, perc}) => {
    return <ContributionWrapper perc={perc}>
        {title != null && <TitleWrapper>
            { token && <TokenSymbolImage symbol={title} width={36} height={36} />}
            { elevation && <ElevationImage elevation={title} width={36} height={36} />}
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
