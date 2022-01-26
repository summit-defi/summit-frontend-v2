import React from 'react'
import styled from 'styled-components'
import { ElevationPuck, Flex, Text } from 'uikit'
import { CurrentEpochSection } from './CurrentEpochSection'
import { ThawedEpochsSection } from './ThawedEpochsSection'

const EpochsCard = styled(Flex)`
    position: relative;
    z-index: 10;
    padding: 16px;
    padding-top: 112px;
    padding-bottom: 24px;
    margin-top: 124px;
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
    box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};
    width: 100%;
    height: 100%;
    gap: 24px;
    align-items: center;
    flex-direction: column;
`

const EpochsHeaderCard: React.FC = () => {
    return (
        <EpochsCard>
            <ElevationPuck elevation='BLUE'>
                <Text bold fontSize='24px' color='white'>
                    <Text fontSize='16px' color='white'>THE</Text>
                    GLACIER
                </Text>
            </ElevationPuck>
            <Flex gap='24px' mt='12px' mb='16px' width='100%' alignItems='center'>
                <Flex flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
                    <Text monospace fontSize='12px' textAlign='center'>
                        The GLACIER holds your SUMMIT winnings from
                        all elevation farms. All SUMMIT claimed during
                        an Epoch is frozen for ~4 weeks.
                        <br/>
                        <br/>
                        <br/>
                        <Text bold monospace fontSize='12px'>Frozen SUMMIT can either be:</Text>
                        - harvested early for a 50% tax
                        <br/>
                        (50% burned, 50% to EVEREST holders)
                        <br/>
                        - locked for EVEREST without tax
                        <br/>(requires lock duration {`>`}= 30 days)
                    </Text>
                </Flex>
                <CurrentEpochSection/>
            </Flex>
            <ThawedEpochsSection/>
        </EpochsCard>
    )
}

export default React.memo(EpochsHeaderCard)