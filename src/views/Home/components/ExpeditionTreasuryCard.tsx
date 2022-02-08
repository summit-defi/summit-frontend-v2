import React from 'react'
import styled from 'styled-components'
import { Text, Flex, Card, CardBody, HighlightedText } from 'uikit'
import SummitButton from 'uikit/components/Button/SummitButton'
import { Elevation, SummitPalette } from 'config/constants'
import { InverseDeity } from 'views/ElevationFarms/components/InverseDeity'
import CardValue from './CardValue'
import { useExpeditionDisbursedValue, useExpeditionPotTotalValue } from 'state/hooks'

const StyledFarmStakingCard = styled(Card)`
    min-height: 376px;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
`

const DeityWrapper = styled.div`
    filter: drop-shadow(-0.5vw 0.5vw 0.5vw white) drop-shadow(-4vw 2vw 4vw #ae6481) drop-shadow(4vw -2vw 4vw #0d172e);
`

const StyledHighlightedText = styled(HighlightedText)<{ fontSize: string; letterSpacing: string }>`
    letter-spacing: ${({ letterSpacing }) => letterSpacing};
    font-weight: 900;
    font-size: ${({ fontSize }) => fontSize};
    text-shadow: none;
`

const ExpeditionTreasuryCard: React.FC = () => {
    const expeditionPotTotalValue = useExpeditionPotTotalValue()
    const expeditionDisbursedValue = useExpeditionDisbursedValue()

    return (
        <StyledFarmStakingCard>
            <CardBody style={{height: '100%', display: 'flex', flex: '1', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'}}>
                <DeityWrapper>
                <InverseDeity deity={0} selected />
                </DeityWrapper>

                <StyledHighlightedText fontSize="16px" mt='-32px' letterSpacing="2px">
                    EXPEDITION TREASURY:
                </StyledHighlightedText>
                <CardValue
                    value={expeditionPotTotalValue}
                    prefix="$"
                    decimals={2}
                    fontSize="40"
                    gold
                    summitPalette={Elevation.OASIS}
                />
                <StyledHighlightedText fontSize="14px" letterSpacing="2px" mt='8px' mb='0px'>
                    DISBURSED TO DATE:
                </StyledHighlightedText>
                <CardValue
                    value={expeditionDisbursedValue}
                    prefix="$"
                    decimals={2}
                    fontSize="26"
                    gold
                    summitPalette={Elevation.OASIS}
                />
                <Text textAlign='center' bold monospace italic mt='8px'>
                    100% of the Expedition Treasury
                    will be given back exclusively to
                    EVEREST holders
                    through daily EXPEDITIONS.
                </Text>

                <Flex alignItems='center' justifyContent='center' gap='12px' mt='12px'>
                    <SummitButton
                        onClick={() => null}
                        summitPalette={SummitPalette.EVEREST}
                        as="a"
                        href='/everest'
                        mt='12px'
                    >
                        GET EVEREST
                    </SummitButton>
                    <SummitButton
                        onClick={() => null}
                        summitPalette={SummitPalette.EXPEDITION}
                        as="a"
                        href='/expedition'
                        mt='12px'
                    >
                        JOIN EXPEDITION
                    </SummitButton>
                </Flex>
            </CardBody>
        </StyledFarmStakingCard>
  )
}

export default React.memo(ExpeditionTreasuryCard)
