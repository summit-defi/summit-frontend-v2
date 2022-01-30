import React from 'react'
import { Flex, Text, useModal } from 'uikit'
import { Elevation, ForceElevationRetired } from 'config/constants/types'
import styled from 'styled-components'
import ElevationSelector from '../ElevationSelector'
import useElevate from 'hooks/useElevate'
import ElevateModal from '../ElevateModal'
import SummitButton from 'uikit/components/Button/SummitButton'
import { useAvailableSisterElevations, useSummitEnabled } from 'state/hooks'
import { getSummitLpSymbol } from 'config/constants'
import { useHistory } from 'react-router'

interface Props {
  symbol: string
  farmToken: string
  decimals: number
  elevationLocked: boolean
  disabled: boolean
}

const CenteredInfoText = styled(Text)`
  margin: 34px auto 0px auto;
  height: 36px;
  text-align: center;
  line-height: 16px;
`

const CenteredSummitButton = styled(SummitButton)`
  margin: 34px auto 24px auto;
`

const FarmCardUserElevate: React.FC<Props> = ({ symbol, farmToken, decimals, elevationLocked, disabled }) => {
  const elevation = Elevation.OASIS
  const availableSisterElevations = useAvailableSisterElevations(symbol)
  const { onElevate } = useElevate()

  const [onPresentElevate] = useModal(
    <ElevateModal
      symbol={symbol}
      tokenAddress={farmToken}
      onConfirmElevate={onElevate}
      decimals={decimals}
    />,
  )
  const handleSelectElevation = (selectedElevation) => {
    onPresentElevate({
      sourceElevation: selectedElevation === elevation ? undefined : elevation,
      targetElevation: selectedElevation,
    })
  }

  const elevations = [Elevation.OASIS, Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT]
  const disabledElevations = elevations.filter((elevToDisable) => !availableSisterElevations[elevToDisable] || (ForceElevationRetired && [Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT].includes(elevToDisable)))

  return (
    <Flex flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
      <Text fontSize="14px" mb="8px">
        Elevate*:
      </Text>
      <ElevationSelector
        selected={elevation}
        desktopOnlyVertical
        isLocked={elevationLocked}
        elevations={elevations}
        disabledElevations={disabledElevations}
        disabled={disabled}
        selectElevation={handleSelectElevation}
      />
      <CenteredInfoText fontSize="12px" bold monospace>
        * NO TAX ON
        <br />
        ELEVATE
      </CenteredInfoText>
    </Flex>
  )
}

export default React.memo(FarmCardUserElevate)
