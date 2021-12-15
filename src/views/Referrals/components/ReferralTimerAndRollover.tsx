import React from 'react'
import styled from 'styled-components'
import { Flex, Text } from 'uikit'
import { useReferralBurnTimeRemaining } from 'state/hooks'
import SummitButton from 'uikit/components/Button/SummitButton'
import { useBurnUnclaimedReferralRewards } from 'hooks/useCreateOrBurnReferrals'
import { getElevationGradientStops, getTimeRemainingText } from 'utils'
import { Elevation } from 'config/constants/types'
import { darken, linearGradient } from 'polished'

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
  width: calc(${({ progress }) => progress * 100}% - 4px);
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

const ReferralTimerAndRollover: React.FC = () => {
  const burnTimeRemaining = useReferralBurnTimeRemaining()
  const timeRemainingText = getTimeRemainingText(burnTimeRemaining)
  const roundDuration = 604800
  const percProgress = (roundDuration - burnTimeRemaining) / roundDuration
  const { onBurnUnclaimedReferralRewards, pending: referralBurnPending } = useBurnUnclaimedReferralRewards()

  const getTimerText = () => {
    if (burnTimeRemaining === 0) {
      return 'BURN AVAILABLE'
    }

    return `BURN IN: ${timeRemainingText}`
  }

  const timerText = getTimerText()
  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center" width="100%">
      <ProgressBar>
        <ProgressBarInner progress={percProgress} elevation="BASE" />
      </ProgressBar>
      <Text monospace bold mt="12px" mb="18px">
        {timerText}
      </Text>

      <SummitButton
        isLoading={referralBurnPending}
        isLocked={burnTimeRemaining > 0}
        size="lg"
        onClick={onBurnUnclaimedReferralRewards}
        style={{ marginTop: '8px' }}
      >
        BURN UNCLAIMED REWARDS
      </SummitButton>
    </Flex>
  )
}

export default React.memo(ReferralTimerAndRollover)
