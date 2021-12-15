import React from 'react'
import styled from 'styled-components'
import { Elevation, ElevationRoundDuration } from 'config/constants/types'
import { Flex, Text } from 'uikit'
import { useElevationRoundTimeRemaining, useSelectedElevation, useRolloverRewards } from 'state/hooks'
import { getBalanceNumber, getElevationGradientStops, getTimeRemainingText } from 'utils'
import { darken, linearGradient } from 'polished'
import useRolloverElevation from 'hooks/useRolloverElevation'
import SummitButton from 'uikit/components/Button/SummitButton'
import { getNativeTokenSymbol } from 'config/constants'

const ProgressBar = styled.div`
  position: relative;
  height: 24px;
  border-radius: 12px;
  margin: 0 16px;
  width: 100%;
  max-width: 500px;
  background-color: ${({ theme }) => darken(0.1, theme.colors.background)};
  box-shadow: ${({ theme }) => `inset 2px 2px 4px ${theme.colors.textShadow}`};
`

const ProgressBarInner = styled.div<{ progress: number; elevation: string }>`
  position: absolute;
  top: 2px;
  left: 2px;
  bottom: 2px;
  width: max(calc(${({ progress }) => progress * 100}% - 4px), 20px);
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.text};
  transition: width 0.2s;
  background: ${({ elevation }) =>
    linearGradient({
      colorStops: getElevationGradientStops(elevation as Elevation),
      toDirection: '120deg',
    })};
  box-shadow: ${({ theme }) => `3px 3px 6px ${theme.colors.textShadow}`};
`

const UpcomingExpeditionTimer: React.FC = () => {
  const elevation = useSelectedElevation()
  const roundTimeRemaining = useElevationRoundTimeRemaining()
  const timeRemainingText = getTimeRemainingText(roundTimeRemaining)
  const { onRolloverElevation, pending } = useRolloverElevation()
  const { rolloverRewardInNativeToken, rolloverRewardInSummit } = useRolloverRewards()

  const handleRolloverElevation = () => {
    onRolloverElevation(elevation, false)
  }

  if (elevation === Elevation.OASIS) return null
  const roundDuration = ElevationRoundDuration[elevation]
  const percProgress = (roundDuration - roundTimeRemaining) / roundDuration

  const getTimerText = () => {
    if (roundTimeRemaining === 0) {
      return 'START EXPEDITION'
    }

    return `EXPEDITION STARTS IN: ${timeRemainingText}`
  }

  const timerText = getTimerText()
  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center" flex={1} width="100%">
      <>
        <ProgressBar>
          <ProgressBarInner progress={percProgress} elevation="GOLD" />
        </ProgressBar>
      </>

      <Text monospace bold mt="8px">
        {timerText}
      </Text>

      {roundTimeRemaining <= 300 && (
        <Flex flexDirection="column" mt="28px">
          <SummitButton
            isLoading={pending}
            isLocked={roundTimeRemaining > 0}
            size="lg"
            onClick={handleRolloverElevation}
            elevation="GOLD"
            style={{ marginTop: '8px' }}
          >
            START THE EXPEDITION
          </SummitButton>
          <Text bold fontSize="10px" mt="8px" textAlign="center">
            Starting an Expedition
            <br />
            earns {getBalanceNumber(rolloverRewardInSummit).toFixed(3)} SUMMIT (
            {getBalanceNumber(rolloverRewardInNativeToken).toFixed(1)} {getNativeTokenSymbol()})
          </Text>
        </Flex>
      )}
    </Flex>
  )
}

export default React.memo(UpcomingExpeditionTimer)
