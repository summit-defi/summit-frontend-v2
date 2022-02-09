/* eslint-disable react/no-array-index-key */
import { Elevation, elevationUtils } from 'config/constants/types'
import React from 'react'
import { getFormattedBigNumber } from 'utils'
import styled from 'styled-components'
import { Flex, Modal, ModalActions, HighlightedText, Text, SummitButton, TokenSymbolImage } from 'uikit'
import { useElevationWinningsContributions } from 'state/hooksNew'

const NoTextShadowFlex = styled(Flex)`
    gap: 12px;
    width: 100;
    align-items: center;
    justify-content: center;
    margin-top: -24px;
    
    > * {
        text-shadow: none !important;
    }
`

interface Props {
    elevation: Elevation
    onFreezeWinnings: (elevation: Elevation) => void
    onDismiss?: () => void
}

interface BonusRowProps {
    title?: string
    bonusVal?: string
}

export const FarmBonusWinningsRow: React.FC<BonusRowProps> = React.memo(({ title, bonusVal }) => {
    if (bonusVal == null) return null
    return (
        <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%' mb='8px'>
            <Flex alignItems='center' justifyContent='center' gap='6px'>
                <TokenSymbolImage symbol={title} width={36} height={36} />
                <Text monospace bold gold small textAlign='left'>{title} FARM:</Text>
            </Flex>
            <Text bold gold monospace textAlign='right'>{bonusVal.replace('+', '').replace('BONUS', 'SUMMIT')}</Text>
        </Flex>
    )
})

export const FreezeWithBonusesModal: React.FC<Props> = ({
    elevation,
    onFreezeWinnings,
    onDismiss,
}) => {

    const earningsOrWinnings = elevationUtils.winningsOrEarnings(elevation).toUpperCase()

    const {
        winningsContributions,
        elevClaimable,
        elevClaimableBonus,
    } = useElevationWinningsContributions(elevation)


    const handleFreezeWinnings = () => {
        onFreezeWinnings(elevation)
        onDismiss()
    }

    return (
        <Modal title="FREEzE|br|WINNINGS" onDismiss={onDismiss} headerless elevationCircleHeader={elevation}>
            <Flex width='100%' flexDirection='column' alignItems='center' justifyContent='center' gap='18px'>
                <Text bold monospace textAlign='center'>FREEZE YOUR {elevation} {earningsOrWinnings}:</Text>
                <Flex gap='12px' width='100%' alignItems='center' justifyContent='center'>
                    <HighlightedText summitPalette={elevation} fontSize='24px'>{getFormattedBigNumber(elevClaimable)}</HighlightedText>
                    <HighlightedText summitPalette={elevation} fontSize='16px'>SUMMIT</HighlightedText>
                </Flex>
                <NoTextShadowFlex>
                    <HighlightedText gold fontSize='18px'>+ {getFormattedBigNumber(elevClaimableBonus)}</HighlightedText>
                    <HighlightedText gold fontSize='14px'>BONUS</HighlightedText>
                </NoTextShadowFlex>

                <Text bold monospace textAlign='center'>LOYALTY BONUS BREAKDOWN:</Text>

                <Flex width='100%' flexDirection='column' alignItems='center' justifyContent='center' pl='24px' pr='24px'>
                    {winningsContributions.map((contrib) =>
                        <FarmBonusWinningsRow
                            key={contrib.key}
                            title={contrib.title}
                            bonusVal={contrib.bonusVal}
                        />
                    )}
                </Flex>
                
                <ModalActions>
                    <SummitButton secondary onClick={onDismiss}>
                        CANCEL
                    </SummitButton>
                    <SummitButton
                        summitPalette={elevation}
                        onClick={handleFreezeWinnings}
                    >
                        FREEZE WINNINGS
                    </SummitButton>
                </ModalActions>
            </Flex>
        </Modal>
    )
}
