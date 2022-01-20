import React from 'react'
import styled from 'styled-components'
import { ElevationPuck, Flex, Text } from 'uikit'
import { CurrentEpochSection } from './CurrentEpochSection'

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
    justify-content: center;
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
            <CurrentEpochSection/>
        </EpochsCard>
    )
}

export default React.memo(EpochsHeaderCard)