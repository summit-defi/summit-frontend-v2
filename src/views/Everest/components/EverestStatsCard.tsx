import React from 'react'
import { useFrozenEpochs, useThawedEpochs } from 'state/hooks'
import { Epoch } from 'state/types'
import styled from 'styled-components'
import { Flex, HighlightedText, MobileColumnFlex, Text } from 'uikit'
import { MobileRowFlex } from 'uikit/components/Box/Flex'
import { getEpochTimestamps, getBalanceNumber, timestampToDate } from 'utils'
import CardValue from 'views/Home/components/CardValue'
import EpochProgressBar from './EpochProgressBar'


const EverestStatsCard: React.FC = () => {
    return (
        <Text>Everest Stats Card</Text>
    )
}