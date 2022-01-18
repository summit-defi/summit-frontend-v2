import React from 'react'
import styled from 'styled-components'
import { Flex, Text, TokenSymbolImage } from 'uikit'
import SummitButton from 'uikit/components/Button/SummitButton'
import { Elevation, PriceableToken, TokenSymbol } from 'config/constants'
import useRolloverElevation from 'hooks/useRolloverElevation'
import { useElevationRoundTimeRemaining, useElevationLocked } from 'state/hooks'

const BTCard = styled(Flex)`
  align-self: baseline;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  text-align: center;
  transition: all 0.2s;
  width: 100%;
  background: ${({ theme }) => theme.colors.background};
  margin-bottom: 24px;

  &:first-child {
    margin-top: 0px;
  }
`

const WrapperFlex = styled(Flex)`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  padding: 28px 24px 28px 24px;
  flex-wrap: wrap;
`

const FarmNumericalInfoFlex = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
  gap: 12px;
  width: 100%;
`

const BetaRoundRolloversCard: React.FC = () => {
  const { onRolloverElevation, pending } = useRolloverElevation()

  const plainsTimeRemaining = useElevationRoundTimeRemaining(Elevation.PLAINS)
  const mesaTimeRemaining = useElevationRoundTimeRemaining(Elevation.MESA)
  const summitTimeRemaining = useElevationRoundTimeRemaining(Elevation.SUMMIT)
  const expeditionTimeRemaining = useElevationRoundTimeRemaining(Elevation.EXPEDITION)
  const plainsLocked = useElevationLocked(Elevation.PLAINS)
  const mesaLocked = useElevationLocked(Elevation.MESA)
  const summitLocked = useElevationLocked(Elevation.SUMMIT)
  const expeditionLocked = useElevationLocked(Elevation.EXPEDITION)


  const roundInfo = {
    [Elevation.PLAINS]: {
      time: plainsTimeRemaining,
      locked: plainsLocked,
    },
    [Elevation.MESA]: {
      time: mesaTimeRemaining,
      locked: mesaLocked,
    },
    [Elevation.SUMMIT]: {
      time: summitTimeRemaining,
      locked: summitLocked,
    },
    [Elevation.EXPEDITION]: {
      time: expeditionTimeRemaining,
      locked: expeditionLocked,
    },
  }

  return (
    <BTCard>
      <WrapperFlex>
        <FarmNumericalInfoFlex>
          { [Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT, Elevation.EXPEDITION].map((elevation) => (
            <SummitButton
              onClick={() => onRolloverElevation(elevation, roundInfo[elevation].locked)}
              width='160px'
              elevation={elevation}
              disabled={roundInfo[elevation].time > 0}
              isLoading={pending}
            >
              ROLLOVER
              <br/>
              {elevation}
            </SummitButton>
          ))}
        </FarmNumericalInfoFlex>
      </WrapperFlex>
    </BTCard>
  )
}

export default BetaRoundRolloversCard
