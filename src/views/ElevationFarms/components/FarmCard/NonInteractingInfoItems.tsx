import BigNumber from 'bignumber.js'
import { ElevationFarmTab, SummitPalette, TokenSymbol } from 'config/constants'
import React, { memo, useMemo } from 'react'
import { useElevationFarmsTab } from 'state/hooks'
import { useSummitPrice } from 'state/hooksNew'
import styled from 'styled-components'
import { Skeleton, Text, Flex, useModal, HeaderInfoQuestion } from 'uikit'
import { pressableMixin } from 'uikit/util/styledMixins'
import TooltipModal, { TooltipModalType } from 'uikit/widgets/Modal/TooltipModal'
import { capitalizeFirstLetter, nFormatter } from 'utils'
import CardValue from 'views/Home/components/CardValue'

const FlexInfoItem = styled.div<{ maxWidth?: number }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    flex: 1;
    max-width: ${({ maxWidth }) => maxWidth || 88}px;
`

const InfoItemValue = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 50px;
`

const PressableFlex = styled(Flex)`
    cursor: pointer;
    gap: 4px;
    ${pressableMixin}
`

export const NonInteractingInfoItems: React.FC<{ symbol: string }> = memo(({ symbol }) => {
    const isEverest = symbol === TokenSymbol.EVEREST
    const [onPresentTooltipModal] = useModal(
        <TooltipModal tooltipType={TooltipModalType.DecayingWithdrawalFee}/>
    ) 
    return (
        <>
            <FlexInfoItem>
                <Text small>Deposited:</Text>
                <InfoItemValue>
                    <CardValue
                        value={0}
                        prefix={isEverest ? undefined : '$'}
                        postfix={isEverest ? 'EVEREST' : undefined}
                        decimals={2}
                        fontSize="18"
                        postfixFontSize='14'
                    />
                </InfoItemValue>
            </FlexInfoItem>
            <FlexInfoItem maxWidth={130}>
                <PressableFlex onClick={onPresentTooltipModal}>
                    <Text small>Withdrawal Fee:</Text>
                    <HeaderInfoQuestion/>
                </PressableFlex>
                <InfoItemValue>
                    <Text bold monospace>7% to 1%</Text>
                    <Text bold monospace small>Over 7 Days</Text>
                </InfoItemValue>
            </FlexInfoItem>
            <FlexInfoItem>
                <Text small>Deposit Fee:</Text>
                <InfoItemValue>
                    <Text bold monospace>0%</Text>
                </InfoItemValue>
            </FlexInfoItem>
        </>
    )
})