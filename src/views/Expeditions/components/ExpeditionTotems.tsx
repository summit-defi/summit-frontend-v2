import BigNumber from 'bignumber.js'
import { Elevation } from 'config/constants/types'
import React, { useEffect, useState } from 'react'
import { useExpeditionDivider, useExpeditionTotemHeaderInfo, useSelectedElevationWinningTotem, useTotemSelectionPending } from 'state/hooks'
import styled from 'styled-components'
import { Flex, Spinner, Text } from 'uikit'
import { SpinnerKeyframes } from 'uikit/components/Svg/Icons/Spinner'
import useSelectTotemModal from 'uikit/widgets/SelectTotemModal/useSelectTotemModal'
import { getFormattedBigNumber } from 'utils'
import { BaseDeity } from 'views/ElevationFarms/components/BaseDeity'

const FlexWithSpinner = styled(Flex)`
  position: relative;

  .spinner {
    position: absolute;
    margin: auto;
    fill: white;
    animation: ${SpinnerKeyframes} 1.4s infinite linear;
    width: 28px;
    height: 28px;
  }
`

const Deity = styled(BaseDeity)<{ isLoading: boolean }>`
  cursor: ${({ selected, isLoading }) => (isLoading ? 'not-allowed' : selected ? 'default' : 'pointer')};
  pointer-events: ${({ selected }) => (selected ? 'none' : 'auto')};
  height: calc(48vw / 1.358);
  width: 48vw;
  opacity: ${({ isLoading }) => isLoading ? 0.5 : 1 };

  ${({ theme }) => theme.mediaQueries.nav} {
    height: 270px;
    width: 425px;
  }
`

const BaseCrown = styled.div`
  position: absolute;
  background-image: url('/images/deityArtwork/CROWN.png');
  background-size: cover;

  width: calc(${100}px / 1.5);
  height: calc(${100}px / 1.5);

  ${({ theme }) => theme.mediaQueries.nav} {
    width: calc(${154}px / 1.25);
    height: calc(${154}px / 1.25);
  }
`

const BullCrown = styled(BaseCrown)`
  top: calc(${100}px * -0.35);
  right: calc(${100}px * -0.125);

  ${({ theme }) => theme.mediaQueries.nav} {
    top: calc(${154}px * -0.425);
    right: calc(${154}px * -0.125);
  }

  animation: pulse 3s ease-in-out infinite;
  @keyframes pulse {
    0% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }
    50% {
      -webkit-transform: translateY(15px) rotate(5deg);
      transform: translateY(15px) rotate(5deg);
    }
    to {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }
  }
`

const BearCrown = styled(BaseCrown)`
  top: calc(${100}px * -0.35);
  left: calc(${100}px * 0.15);

  ${({ theme }) => theme.mediaQueries.nav} {
    top: calc(${154}px * -0.425);
    left: calc(${154}px * 0.125);
  }

  animation: pulseMirror 3s ease-in-out infinite;
  @keyframes pulseMirror {
    0% {
      -webkit-transform: translateY(0) scaleX(-1);
      transform: translateY(0) scaleX(-1);
    }
    50% {
      -webkit-transform: translateY(15px) rotate(5deg) scaleX(-1);
      transform: translateY(15px) rotate(5deg) scaleX(-1);
    }
    to {
      -webkit-transform: translateY(0) scaleX(-1);
      transform: translateY(0) scaleX(-1);
    }
  }
`

const ValueText = styled(Text)<{ fontSize?: string }>`
  z-index: 2;
  font-size: ${({ fontSize }) => fontSize || '16px'};
  line-height: 18px;
  text-shadow: 1px 1px 2px black;
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
`

const deityValueText = (deitiedEverest, deityEverest, deity, deityDivider, bull) => {
  if (deity == null || deitiedEverest == null || deityEverest == null) return null
  const ml = bull ? '0px' : '50px'
  const mr = !bull ? '0px' : '50px'
  const perc = deitiedEverest.isEqualTo(0) ? 0 : deityEverest.times(100).dividedBy(deitiedEverest).toFixed(1)
  const chanceOfWin = bull ? deityDivider : 100 - deityDivider
  const rawDeityEverest = getFormattedBigNumber(deityEverest, 3)

  return (
    <>
      <ValueText monospace bold ml={ml} mr={mr} mb='6px' fontSize="16px">
        {chanceOfWin}%
        <Text fontSize="12px">CHANCE OF WIN</Text>
      </ValueText>
      <ValueText monospace fontSize='14px' bold ml={ml} mr={mr}>
        {perc}%
        <Text fontSize="12px">OF POT</Text>
      </ValueText>
      <ValueText monospace fontSize='14px' bold ml={ml} mr={mr}>
        {rawDeityEverest} 
        <Text fontSize="12px">EVEREST</Text>
      </ValueText>
    </>
  )
}

const ExpeditionTotems: React.FC = () => {
  const { deity, deitiedEverest, deityEverest } = useExpeditionTotemHeaderInfo()
  const deityDivider = useExpeditionDivider()

  const [expeditionTotem, setExpeditionTotem] = useState(null)
  const prevRoundWinningDeity = useSelectedElevationWinningTotem()
  const totemSelectionPending = useTotemSelectionPending()

  useEffect(() => {
    if (expeditionTotem != null) {
      setExpeditionTotem(deity)
    } else {
      setTimeout(() => {
        setExpeditionTotem(deity)
      }, 500)
    }
  }, [deity, expeditionTotem])
  const { onPresentSelectTotemModal: onConfirmBearDeity } = useSelectTotemModal(Elevation.EXPEDITION, 0)
  const { onPresentSelectTotemModal: onConfirmBullDeity } = useSelectTotemModal(Elevation.EXPEDITION, 1)

  const handleConfirmBullDeity = () => {
    if (totemSelectionPending) return
    onConfirmBullDeity()
  }
  const handleConfirmBearDeity = () => {
    if (totemSelectionPending) return
    onConfirmBearDeity()
  }



  return (
    <Flex justifyContent="space-around">
      <FlexWithSpinner flexDirection="column" alignItems="center" justifyContent="center" position="relative">
        <Deity deity={0} selected={expeditionTotem === 0} isLoading={totemSelectionPending} onClick={handleConfirmBearDeity} />
        {prevRoundWinningDeity === 0 && <BullCrown />}
        {deityValueText(deitiedEverest, deityEverest[0], deity, deityDivider, true)}
        {totemSelectionPending && <Spinner ml="6px" mr="12px" className="spinner" />}
      </FlexWithSpinner>
      <FlexWithSpinner flexDirection="column" alignItems="center" justifyContent="center" position="relative">
        <Deity deity={1} selected={expeditionTotem === 1} isLoading={totemSelectionPending} onClick={handleConfirmBullDeity} />
        {prevRoundWinningDeity === 1 && <BearCrown />}
        {deityValueText(deitiedEverest, deityEverest[1], deity, deityDivider, false)}
        {totemSelectionPending && <Spinner className="spinner" />}
      </FlexWithSpinner>
    </Flex>
  )
}

export default React.memo(ExpeditionTotems)
