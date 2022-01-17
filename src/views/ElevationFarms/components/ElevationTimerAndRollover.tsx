import React from 'react'
import styled from 'styled-components'
import { Elevation, ElevationRoundDuration, elevationUtils } from 'config/constants/types'
import { Flex, HighlightedText, Text } from 'uikit'
import {
  useElevationRoundTimeRemaining,
  useElevationLocked,
  useSelectedElevation,
  useRolloverRewards,
  useSummitEnabled,
} from 'state/hooks'
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

const ProgressBarText = styled(Text)`
  text-align: center;
  line-height: 24px;
  font-size: 20px;
  margin-top: 8px;
`

const StyledText = styled(Text)`
  padding-top: 16px;
  padding-bottom: 24px;
`

const ElevationTimerAndRollover: React.FC = () => {
  const elevation = useSelectedElevation()
  const summitEnabled = useSummitEnabled()
  const roundTimeRemaining = useElevationRoundTimeRemaining(elevation)
  const elevationLocked = useElevationLocked(elevation)
  const elevationUnlocked = !elevationLocked
  const timeRemainingText = getTimeRemainingText(roundTimeRemaining)
  const { onRolloverElevation, pending } = useRolloverElevation()
  const { rolloverRewardInNativeToken, rolloverRewardInSummit } = useRolloverRewards()

  const handleRolloverElevation = () => {
    onRolloverElevation(elevation, elevationLocked)
  }

  if (!summitEnabled)
    return (
      <StyledText bold italic textAlign="center" fontSize="small">
        * Summit DeFi has not been launched yet.
        <br />
        <br/>
        {elevation === Elevation.OASIS && 'You will still be able to join OASIS farms, but they will not earn rewards until launch.'}
        {elevation !== Elevation.OASIS && <>
            {elevationUtils.unlockString(elevation)}
            <br/>
            Feel free to choose your Totem and find the others who have done the same
        </>}
      </StyledText>
    )

  if (elevation === Elevation.OASIS) return <Flex flex="1" />

  const roundDuration = ElevationRoundDuration[elevation]
  const percProgress = (roundDuration - roundTimeRemaining) / roundDuration

  const getTimerText = () => {
    if (elevationLocked) {
      return `THE ${elevation} UNLOCKS IN ${timeRemainingText}`
    }
    if (roundTimeRemaining === 0) {
      return 'ROLLOVER AVAILABLE'
    }
    if (roundTimeRemaining <= 60) {
      return `THE ${elevation} LOCKED, ROLLOVER IN ${timeRemainingText}`
    }

    return `ROUND LOCKS IN ${getTimeRemainingText(roundTimeRemaining - 60)}`
  }

  const timerText = getTimerText()

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center" flex={1} width="100%">
      {elevationUnlocked && (
        <>
          <HighlightedText mb="16px" elevation={elevation}>
            Current Round{roundTimeRemaining <= 60 && ' - LOCKED'}
          </HighlightedText>
          <ProgressBar>
            <ProgressBarInner progress={percProgress} elevation="GOLD" />
          </ProgressBar>

            <ProgressBarText monospace bold>
            {timerText}
            </ProgressBarText>

          {roundTimeRemaining >= 60 && (
            <Text monospace italic textAlign="center" mt="24px" mb="24px" fontSize="12px" letterSpacing="0.1px">
              Rounds Lock 60 seconds before the top of the hour.
              <br />
              You will not be able to interact with farms while the round is locked.
            </Text>
          )}
        </>
      )}

      {elevationLocked && (
        <>
          <Text monospace bold textAlign="center">
            {elevationUtils.unlockString(elevation)}
          </Text>
          <Text monospace bold fontSize='20px'>
            {timerText}
          </Text>
        </>
      )}
      {roundTimeRemaining <= 60 && (
        <Flex flexDirection="column" mt="28px">
          <SummitButton
            isLoading={pending}
            isLocked={roundTimeRemaining > 0}
            size="lg"
            onClick={handleRolloverElevation}
            elevation="GOLD"
            style={{ marginTop: '8px' }}
          >
            {elevationLocked ? 'UNLOCK' : 'ROLLOVER'} THE {elevation}
          </SummitButton>
          <Text bold fontSize="10px" mt="8px" textAlign="center">
            {elevationLocked ? 'Unlocking an elevation' : 'Rolling over a round'}
            <br />
            earns {getBalanceNumber(rolloverRewardInSummit).toFixed(3)} SUMMIT (
            {getBalanceNumber(rolloverRewardInNativeToken).toFixed(1)} {getNativeTokenSymbol()})
          </Text>
        </Flex>
      )}
    </Flex>
  )
}

export default React.memo(ElevationTimerAndRollover)
