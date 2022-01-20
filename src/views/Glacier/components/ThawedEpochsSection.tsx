import React from 'react'
import { useThawedEpochs } from 'state/hooks'
import { Epoch } from 'state/types'
import styled from 'styled-components'
import { Flex, HighlightedText, MobileColumnFlex, Text } from 'uikit'
import { MobileRowFlex } from 'uikit/components/Box/Flex'
import { getEpochTimestamps, getFormattedBigNumber, getFullDisplayBalance, timestampToDate } from 'utils'
import HarvestEpochButton from './HarvestEpochButton'

const MobileBreak = styled.br`
    display: default;
    ${({ theme }) => theme.mediaQueries.nav} {
        display: none;
    }
`

const Divider = styled.div`
    background-color: ${({ theme }) => theme.colors.text};
    height: 1px;
    width: calc(100% - 48px);
    opacity: 0.5;
`

export const StyledMobileColumnFlex = styled(MobileColumnFlex)`
  ${({ theme }) => theme.mediaQueries.nav} {
    width: calc(100% - 24px);
    justify-content: space-between;
  }
`

const ThawedEpoch: React.FC<{ epoch: Epoch }> = ({ epoch }) => {
    const rawFrozen = getFormattedBigNumber(epoch.frozenSummit, 3)
    const { beginTimestamp, closeTimestamp } = getEpochTimestamps(epoch.index)
    const beginDate = timestampToDate(beginTimestamp)
    const closeDate = timestampToDate(closeTimestamp)
    return (
        <StyledMobileColumnFlex alignItems='center' justifyContent='center'>
            <Text bold monospace fontSize='12px' textAlign='center'>
                EPOCH:{' '}
                <MobileBreak/>
                {beginDate} - {closeDate}
            </Text>
            <MobileColumnFlex alignItems='center' justifyContent='center' mt='12px' mb='12px'>
                <HighlightedText bold monospace fontSize='22px' ml='4px' mr='4px' lineHeight='22px'>{rawFrozen}</HighlightedText>
                <HighlightedText bold monospace fontSize='14px' ml='4px' mr='4px' lineHeight='14px'>SUMMIT</HighlightedText>
            </MobileColumnFlex>
            <HarvestEpochButton epochIndex={epoch.index} width='160px' height='28px' />
        </StyledMobileColumnFlex>
    )
}

export const ThawedEpochsSection: React.FC = () => {
    const thawedEpochs = useThawedEpochs()
    if (thawedEpochs.length === 0) return null

    return (
        <>
            <Divider/>
            <Flex gap='24px' flexDirection='column' alignItems='center' justifyContent='center' width='100%'>
                <Text bold monospace>THAWED EPOCHS:</Text>
                <MobileRowFlex gap='24px' width='100%' flexWrap='wrap' alignItems='center' justifyContent='center'>
                    { thawedEpochs.map((thawedEpoch) =>
                        <ThawedEpoch
                            key={thawedEpoch.index}
                            epoch={thawedEpoch}
                        />
                    )}
                </MobileRowFlex>
            </Flex>
        </>
    )
}