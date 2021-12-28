import BigNumber from 'bignumber.js'
import { Elevation } from 'config/constants/types'
import React, { useEffect, useState } from 'react'
import { usePendingExpeditionTx, useSelectedElevationWinningTotem, useSummitPrice } from 'state/hooks'
import { Expedition } from 'state/types'
import styled, { keyframes } from 'styled-components'
import { Flex, Spinner, Text } from 'uikit'
import useSelectTotemModal from 'uikit/widgets/SelectTotemModal/useSelectTotemModal'
import { getBalanceNumber } from 'utils'
import { BaseDeity } from 'views/ElevationFarms/components/BaseDeity'

const Spin = keyframes`
  0%: {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const FlexWithSpinner = styled(Flex)`
  position: relative;

  .spinner {
    position: absolute;
    margin: auto;
    fill: white;
    animation: ${Spin} 1.4s infinite linear;
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
  background-image: url('/images/totemArtwork/CROWN.png');
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
  text-shadow: 1px 1px 2px white;
  text-align: center;
`

interface Props {
  totem: number | null
  deityDivider: number
  expedition: Expedition | null
}

const deityValueText = (expedition, totem, deityDivider, summitPrice, bull) => {
  if (expedition == null || totem == null || expedition.totemsDeposited == null) return null
  const ml = bull ? '0px' : '80px'
  const mr = !bull ? '0px' : '80px'
  const { totalDeposited, totemsDeposited } = expedition
  const totemStaked = totemsDeposited[bull ? 0 : 1]
  const staked = getBalanceNumber(totemStaked) * summitPrice
  const perc = totemStaked.isEqualTo(0) ? 0 : totalDeposited.dividedBy(totemStaked).toFixed(1)
  const chanceOfWin = bull ? deityDivider : 100 - deityDivider

  return (
    <>
      <ValueText monospace bold ml={ml} mr={mr} fontSize="24px">
        {chanceOfWin}%<Text fontSize="12px">CHANCE OF WIN</Text>
      </ValueText>
      <br />
      <ValueText monospace bold ml={ml} mr={mr}>
        {'$'}{staked.toFixed(2)} USD
      </ValueText>
      <ValueText monospace ml={ml} mr={mr} mb="4px" fontSize="12px">
        TOTAL {bull ? 'BULL' : 'BEAR'} DEPOSITED
      </ValueText>
      {/* <ValueText monospace bold ml={ml} mr={mr}>
        {perc}X on win
      </ValueText> */}
    </>
  )
}

const ExpeditionTotems: React.FC<Props> = ({ totem, deityDivider, expedition }) => {
  const [expeditionTotem, setExpeditionTotem] = useState(null)
  const prevRoundWinningDeity = useSelectedElevationWinningTotem()
  const pendingExpeditionTx = usePendingExpeditionTx()
  const summitPrice = useSummitPrice()

  useEffect(() => {
    if (expeditionTotem != null) {
      setExpeditionTotem(totem)
    } else {
      setTimeout(() => {
        setExpeditionTotem(totem)
      }, 500)
    }
  }, [totem, expeditionTotem])
  const { onPresentSelectTotemModal: onConfirmBearDeity } = useSelectTotemModal(Elevation.EXPEDITION, 0)
  const { onPresentSelectTotemModal: onConfirmBullDeity } = useSelectTotemModal(Elevation.EXPEDITION, 1)

  const handleConfirmBullDeity = () => {
    if (pendingExpeditionTx) return
    onConfirmBullDeity()
  }
  const handleConfirmBearDeity = () => {
    if (pendingExpeditionTx) return
    onConfirmBearDeity()
  }

  return (
    <Flex justifyContent="space-around">
      <FlexWithSpinner flexDirection="column" alignItems="center" justifyContent="center" position="relative">
        <Deity totem={0} selected={expeditionTotem === 0} isLoading={pendingExpeditionTx} onClick={handleConfirmBearDeity} />
        {prevRoundWinningDeity === 0 && <BullCrown />}
        {deityValueText(expedition, totem, deityDivider, summitPrice, true)}
        {pendingExpeditionTx && <Spinner ml="6px" mr="12px" className="spinner" />}
      </FlexWithSpinner>
      <FlexWithSpinner flexDirection="column" alignItems="center" justifyContent="center" position="relative">
        <Deity totem={1} selected={expeditionTotem === 1} isLoading={pendingExpeditionTx} onClick={handleConfirmBullDeity} />
        {prevRoundWinningDeity === 1 && <BearCrown />}
        {deityValueText(expedition, totem, deityDivider, summitPrice, false)}
        {pendingExpeditionTx && <Spinner className="spinner" />}
      </FlexWithSpinner>
    </Flex>
  )
}

export default ExpeditionTotems
