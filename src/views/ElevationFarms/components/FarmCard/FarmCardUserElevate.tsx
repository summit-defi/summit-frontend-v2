import React from 'react'
import { Flex, Text, useModal } from 'uikit'
import { Elevation } from 'config/constants/types'
import styled from 'styled-components'
import ElevationSelector from '../ElevationSelector'
import useElevate from 'hooks/useElevate'
import ElevateModal from '../ElevateModal'
import { useSymbolElevateSelectorInfo } from 'state/hooksNew'

interface Props {
  symbol: string
  elevationLocked: boolean
  disabled: boolean
}

const CenteredInfoText = styled(Text)`
  margin: 34px auto 0px auto;
  height: 36px;
  text-align: center;
  line-height: 16px;
`

const FarmCardUserElevate: React.FC<Props> = ({ symbol, elevationLocked, disabled }) => {
  const elevation = Elevation.OASIS
  const elevsLaunched = useSymbolElevateSelectorInfo(symbol)
  const { onElevate } = useElevate()

  const [onPresentElevate] = useModal(
    <ElevateModal
      symbol={symbol}
      onConfirmElevate={onElevate}
    />,
  )
  const handleSelectElevation = (selectedElevation) => {
    onPresentElevate({
      sourceElevation: selectedElevation === elevation ? undefined : elevation,
      targetElevation: selectedElevation,
    })
  }

  const elevations = [Elevation.OASIS, Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT]
  const disabledElevations = elevations.filter((elevToDisable) => !elevsLaunched[elevToDisable])

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
