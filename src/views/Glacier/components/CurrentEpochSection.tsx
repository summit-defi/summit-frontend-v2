import React from 'react'
import { useCurrentEpoch } from 'state/hooks'
import { Flex, Text } from 'uikit'
import EpochProgressBar from './EpochProgressBar'

export const CurrentEpochSection: React.FC = () => {
    const currentEpoch = useCurrentEpoch()

    return (
        <Flex width='100%' alignItems='center' justifyContent='center'>
            <Text bold monospace>CURRENT EPOCH:</Text>
            <EpochProgressBar
                epoch={currentEpoch}
            />
        </Flex>
    )
}