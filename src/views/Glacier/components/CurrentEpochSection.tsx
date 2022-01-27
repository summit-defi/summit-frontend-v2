import React from 'react'
import { useCurrentEpoch } from 'state/hooksNew'
import { Flex, HighlightedText, MobileColumnFlex, Text } from 'uikit'
import { epochThawTimestamp, getBalanceNumber, timestampToDate } from 'utils'
import CardValue from 'views/Home/components/CardValue'
import EpochProgressBar from './EpochProgressBar'
import HarvestEpochButton from './HarvestEpochButton'

export const CurrentEpochSection: React.FC = () => {
    const currentEpoch = useCurrentEpoch()
    const thawTimestamp = epochThawTimestamp(currentEpoch.index)
    const thawDate = timestampToDate(thawTimestamp)
    const rawFrozen = getBalanceNumber(currentEpoch.frozenSummit)

    return (
        <Flex gap='24px' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
            <Text bold monospace>CURRENT EPOCH:</Text>
            <EpochProgressBar
                epoch={currentEpoch.index}
                isCurrentEpoch
            />
            <MobileColumnFlex gap='24px' alignItems='center' justifyContent='space-between' width='100%' maxWidth='450px'>
                <Flex flexDirection='column' justifyContent='center' alignItems='center'>
                    <Text bold monospace fontSize='12px'>EPOCH SUMMIT FROZEN:</Text>
                    <CardValue
                        value={rawFrozen}
                        decimals={3}
                        fontSize="22"
                        postfix='SUMMIT'
                        postfixFontSize='14'
                    />
                </Flex>
                <Flex flexDirection='column' justifyContent='center' alignItems='center'>
                    <Text bold monospace fontSize='12px'>EPOCH THAW DATE:</Text>
                    <HighlightedText bold monospace header fontSize='22'>
                        {thawDate}
                    </HighlightedText>
                </Flex>
            </MobileColumnFlex>
            <HarvestEpochButton
                epochIndex={currentEpoch.index}
            />
        </Flex>
    )
}