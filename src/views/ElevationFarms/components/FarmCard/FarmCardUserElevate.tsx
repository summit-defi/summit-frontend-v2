import React, { useCallback } from 'react'
import { Flex, Text, useModal } from 'uikit'
import { Elevation } from 'config/constants/types'
import styled from 'styled-components'
import ElevationSelector from '../ElevationSelector'
import useElevate from 'hooks/useElevate'
import ElevateModal from '../ElevateModal'
import { useSymbolElevateSelectorInfo } from 'state/hooksNew'
import { useSelectedElevation } from 'state/hooks'
import { LockFarmingSummitForEverest } from './LockFarmingSummitForEverest'
import { TokenSymbol } from 'config/constants'

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
  const elevation = useSelectedElevation()
  const elevsLaunched = useSymbolElevateSelectorInfo(symbol)
  const { onElevate } = useElevate()

  const [onPresentElevate] = useModal(
    <ElevateModal
      symbol={symbol}
      onConfirmElevate={onElevate}
    />,
  )
  const handleSelectElevation = useCallback((selectedElevation) => {
    onPresentElevate({
      sourceElevation: selectedElevation === elevation ? undefined : elevation,
      targetElevation: selectedElevation,
    })
  }, [onPresentElevate, elevation])

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
      <CenteredInfoText fontSize='11px' bold monospace>
        { symbol === TokenSymbol.SUMMIT ? 
          <LockFarmingSummitForEverest disabled={disabled} isLocked={elevationLocked}/> :
          <>
            * NO FEE OR TAX
            <br />
            ON ELEVATE
            <br/>
            (EXCEPT GAS)
          </>
        }
      </CenteredInfoText>
      
    </Flex>
  )
}

export default React.memo(FarmCardUserElevate)
