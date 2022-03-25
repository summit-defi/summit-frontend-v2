import React, { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { Elevation, elevationUtils } from 'config/constants/types'
import { useAllElevationsClaimable, useAnyElevationInteractionsLocked, useElevationInteractionsLocked, useElevationUserTotem, useUserElevationClaimable } from 'state/hooksNew'
import { useClaimElevation } from 'hooks/useClaim'
import DesktopVerticalDivider from 'uikit/components/DesktopVerticalDivider'
import SummitButton from 'uikit/components/Button/SummitButton'
import { HighlightedText, Text } from 'uikit/components/Text'
import { MobileColumnFlex, Flex } from 'uikit/components/Box'
import { getFormattedBigNumber } from 'utils'
import { FreezeWithBonusesModal } from 'views/ElevationFarms/components/FreezeWithBonusesModal'
import { useModal, Modal } from '../Modal'
import styled from 'styled-components'


const NoTextShadowFlex = styled(Flex)`
    gap: 6px;
    width: 100;
    align-items: center;
    justify-content: center;
    margin-top: -22px;
    
    > * {
        text-shadow: none !important;
    }
`


interface TheBigFreezeProps {
    claimables: {
        elevation: Elevation,
        claimable: BigNumber,
        claimableBonus: BigNumber
    }[]
}

const TheBigFreezeButton: React.FC<TheBigFreezeProps> = React.memo(({ claimables }) => {
    const elevations = claimables.map((claimable) => claimable.elevation)
    const anyElevationLocked = useAnyElevationInteractionsLocked(elevations)

    const { onClaimElevation, claimPending } = useClaimElevation()

    const handlePresentFreezeElev = useCallback(() => {
        if (claimPending || anyElevationLocked) return
        console.log('BIG FREEZE')
    }, [claimPending, anyElevationLocked])

    return (
        <SummitButton
            isLocked={anyElevationLocked}
            isLoading={claimPending}
            width='200px'
            style={{ padding: '0px' }}
            freezeSummitButton
            onClick={handlePresentFreezeElev}
        >
            THE BIG FREEZE
        </SummitButton>
    )
})

interface ElevProps {
    elevation: Elevation
    claimable: BigNumber
}

const ElevClaim: React.FC<ElevProps> = React.memo(({ elevation, claimable }) => {
    const elevationLocked = useElevationInteractionsLocked(elevation)

    const { onClaimElevation, claimPending } = useClaimElevation()
    const nothingToClaim = !claimable || claimable.isEqualTo(0)

    const [onPresentFreezeElev] = useModal(
        <FreezeWithBonusesModal
            elevations={[elevation]}
            onFreezeWinnings={onClaimElevation}
        />
    )
    const handlePresentFreezeElev = useCallback(() => {
        if (claimPending || elevationLocked || nothingToClaim) return
        onPresentFreezeElev()
    }, [claimPending, elevationLocked, nothingToClaim, onPresentFreezeElev])

    return (
        <SummitButton
            summitPalette={elevation}
            isLocked={elevationLocked}
            isLoading={claimPending}
            disabled={nothingToClaim}
            width='120px'
            height='28px'
            style={{ padding: '0px' }}
            onClick={handlePresentFreezeElev}
        >
            {elevation}
        </SummitButton>
    )
})


interface Props {
    onDismiss?: () => void
}

const ManageWinningsModal: React.FC<Props> = ({
    onDismiss = () => null,
}) => {
    const elevationsClaimable = useAllElevationsClaimable()

    return (
        <Modal
            title='WINNINGS:'
            onDismiss={onDismiss}
            elevationCircleHeader='GLACIER'
            headerless
        >
            <MobileColumnFlex gap='24px'>
                <Flex mb='24px' maxWidth='300px' flexDirection='column' alignItems='center' justifyContent='flex-start' gap='32px'>
                    <Text bold monospace mb='-18px'>FREEZE ALL ELEVATIONS:</Text>
                    { elevationsClaimable.length > 0 ?
                        <TheBigFreezeButton claimables={elevationsClaimable}/> :
                        <Text bold monospace>No Winnings to Freeze</Text> 
                    }
                    <Flex flexDirection='column' alignItems='center' justifyContent='center' gap='14px'>
                        { elevationsClaimable.map(({ elevation, claimable, claimableBonus }) => (
                            <>
                                <Flex key={elevation} gap='6px' width='100%' alignItems='center' justifyContent='center'>
                                    { elevationsClaimable.length > 1 && <HighlightedText summitPalette={elevation} fontSize='14px'>{elevation}:</HighlightedText> }
                                    <HighlightedText summitPalette={elevation} fontSize='18px'>{getFormattedBigNumber(claimable)}</HighlightedText>
                                    <HighlightedText summitPalette={elevation} fontSize='12px'>SUMMIT</HighlightedText>
                                </Flex>
                                <NoTextShadowFlex>
                                    <HighlightedText gold fontSize='14px'>+ {getFormattedBigNumber(claimableBonus)}</HighlightedText>
                                    <HighlightedText gold fontSize='12px'>BONUS</HighlightedText>
                                </NoTextShadowFlex>
                            </>
                        ))}
                    </Flex>
                    <Text bold monospace mb='-18px'>FREEZE INDIVIDUALLY:</Text>
                    <Flex flexWrap='wrap' gap='18px' alignItems='center' justifyContent='center'>
                        { elevationsClaimable.map(({ elevation, claimable }) =>
                            <ElevClaim elevation={elevation} claimable={claimable}/>
                        )}
                    </Flex>
                </Flex>
                <DesktopVerticalDivider/>
                <Flex mb='24px' maxWidth='300px' flexDirection='column' alignItems='center' justifyContent='flex-start' gap='32px'>
                    <Text bold monospace mb='-18px'>LOCK WINNINGS FOR EVEREST:</Text>
                    { elevationsClaimable.length > 0 ?
                        <TheBigFreezeButton claimables={elevationsClaimable}/> :
                        <Text bold monospace>No Winnings to Freeze</Text> 
                    }
                    <Text bold monospace mb='-18px' mt='18px'>FREEZE INDIVIDUALLY:</Text>
                    <Flex flexWrap='wrap' gap='18px' alignItems='center' justifyContent='center'>
                        { elevationsClaimable.map(({ elevation, claimable }) =>
                            <ElevClaim key={elevation} elevation={elevation} claimable={claimable}/>
                        )}
                    </Flex>
                </Flex>
            </MobileColumnFlex>
        </Modal>
    )
}

export default ManageWinningsModal
