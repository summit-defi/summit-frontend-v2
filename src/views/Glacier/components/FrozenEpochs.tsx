import React from 'react'
import { useFrozenEpochs, useThawedEpochs } from 'state/hooks'
import { Epoch } from 'state/types'
import styled from 'styled-components'
import { Flex, HighlightedText, MobileColumnFlex, Text } from 'uikit'
import { MobileRowFlex } from 'uikit/components/Box/Flex'
import { getEpochTimestamps, getBalanceNumber, timestampToDate } from 'utils'
import CardValue from 'views/Home/components/CardValue'
import EpochProgressBar from './EpochProgressBar'
import HarvestEpochButton from './HarvestEpochButton'

const MobileBreak = styled.br`
    display: default;
    ${({ theme }) => theme.mediaQueries.nav} {
        display: none;
    }
`

export const FrozenEpochCard = styled(Flex)`
    flex-direction: column;
    background: ${({ theme }) => theme.colors.background};
    border-radius: 6px;
    padding: 18px;
    flex: 1;
    box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};
`

const FrozenEpoch: React.FC<{ epoch: Epoch }> = ({ epoch }) => {
    const rawFrozen = getBalanceNumber(epoch.frozenSummit)
    const { beginTimestamp, closeTimestamp, thawTimestamp } = getEpochTimestamps(epoch.index)
    const beginDate = timestampToDate(beginTimestamp)
    const closeDate = timestampToDate(closeTimestamp)
    const thawDate = timestampToDate(thawTimestamp)
    return (
        <FrozenEpochCard gap='24px' alignItems='center' justifyContent='center'>
            <Text bold monospace fontSize='12px' textAlign='center'>
                EPOCH:{' '}
                <MobileBreak/>
                {beginDate} - {closeDate}
            </Text>
            <EpochProgressBar
                epoch={epoch.index}
            />
            <Flex gap='24px' alignItems='center' justifyContent='space-around' width='100%' maxWidth='450px'>
                <Flex flexDirection='column' justifyContent='center' alignItems='center'>
                    <Text bold monospace fontSize='12px'>SUMMIT FROZEN:</Text>
                    <CardValue
                        value={rawFrozen}
                        decimals={3}
                        fontSize="20"
                        postfix='SUMMIT'
                        postfixFontSize='14'
                    />
                </Flex>
                <Flex flexDirection='column' justifyContent='center' alignItems='center'>
                    <Text bold monospace fontSize='12px'>THAW DATE:</Text>
                    <HighlightedText bold monospace header fontSize='20'>
                        {thawDate}
                    </HighlightedText>
                </Flex>
            </Flex>
            <HarvestEpochButton epochIndex={epoch.index} width='160px' height='28px' />
        </FrozenEpochCard>
    )
}

export const FrozenEpochs: React.FC = () => {
    const frozenEpochs = useFrozenEpochs()
    if (frozenEpochs.length === 0) return null

    return (
        <Flex gap='24px' flexDirection='column' alignItems='center' justifyContent='center' width='100%'>
            <Text bold monospace>FROZEN EPOCHS:</Text>
            <Flex gap='24px' width='100%' flexWrap='wrap' alignItems='center' justifyContent='center'>
                { frozenEpochs.map((frozenEpoch) =>
                    <FrozenEpoch
                        key={frozenEpoch.index}
                        epoch={frozenEpoch}
                    />
                )}
            </Flex>
        </Flex>
    )
}