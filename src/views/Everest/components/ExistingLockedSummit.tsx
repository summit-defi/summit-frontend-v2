import React from 'react'
import BigNumber from "bignumber.js"
import { transparentize } from "polished"
import styled from "styled-components"
import { Flex, Text } from "uikit"
import { getFormattedBigNumber, timestampToDateWithYear } from "utils"


interface ExistingLockedSummitProps {
    lockRelease: number
    summitLocked: BigNumber
}

const ExistingLockedSummitFlex = styled(Flex)`
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    border-radius: 16px;
    padding: 8px;
    border: ${({ theme }) => `1px solid ${transparentize(0.5, theme.colors.text)}`};
`

export const ExistingLockedSummit: React.FC<ExistingLockedSummitProps> = ({ lockRelease, summitLocked }) => {
    const rawSummitLocked = getFormattedBigNumber(summitLocked)
    const releaseDate = timestampToDateWithYear(lockRelease)
    return (
        <ExistingLockedSummitFlex flexDirection='column' alignItems='flex-start' justifyContent='center'>
            <Text bold monospace small>{rawSummitLocked} SUMMIT is locked until {releaseDate}.</Text>
            <Text monospace small>Any additional locked SUMMIT will also unlock on this date.</Text>
        </ExistingLockedSummitFlex>
    )
}