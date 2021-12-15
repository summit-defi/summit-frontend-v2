import React from 'react'
import { Flex, Text, useModal } from 'uikit'
import { Elevation, ForceElevationRetired } from 'config/constants/types'
import styled from 'styled-components'
import ElevationSelector from '../ElevationSelector'
import { Farm } from 'state/types'
import useElevate from 'hooks/useElevate'
import ElevateModal from '../ElevateModal'
import SummitButton from 'uikit/components/Button/SummitButton'
import { useAvailableSisterElevations, useSummitEnabled } from 'state/hooks'
import { getSummitLpSymbol } from 'config/constants'
import { useHistory } from 'react-router'

interface Props {
  farm: Farm
  elevationLocked: boolean
  disabled: boolean
}

const CenteredInfoText = styled(Text)`
  margin: 38px auto 28px auto;
  height: 36px;
  text-align: center;
  line-height: 16px;
`

const CenteredSummitButton = styled(SummitButton)`
  margin: 34px auto 24px auto;
`

const FarmCardUserElevate: React.FC<Props> = ({ farm, elevationLocked, disabled }) => {
  const { symbol, elevation, isTokenOnly, tokenAddress, lpAddress } = farm
  const trueTokenAddress = isTokenOnly ? tokenAddress : lpAddress
  const summitEnabled = useSummitEnabled()
  const summitLpSymbol = getSummitLpSymbol()
  const availableSisterElevations = useAvailableSisterElevations(symbol)
  const expeditionAvailable = availableSisterElevations[Elevation.EXPEDITION]
  const { onElevate } = useElevate()
  const history = useHistory()

  const openExpeditionPage = () => {
    history.push('/expedition')
  }

  const [onPresentElevate] = useModal(
    <ElevateModal
      symbol={symbol}
      tokenAddress={trueTokenAddress}
      onConfirmElevate={onElevate}
      openExpeditionPage={openExpeditionPage}
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

  const isSummitOrSummitLpFarm = ['SUMMIT', summitLpSymbol].includes(symbol)

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
        disabled={disabled || !summitEnabled}
        selectElevation={handleSelectElevation}
      />
      {isSummitOrSummitLpFarm ? (
        <CenteredSummitButton
          elevation={Elevation.EXPEDITION}
          isLocked={elevationLocked}
          disabled={disabled || !expeditionAvailable || !summitEnabled}
          style={{ width: '140px' }}
          onClick={() => handleSelectElevation(Elevation.EXPEDITION)}
        >
          JOIN
          <br />
          EXPEDITION
        </CenteredSummitButton>
      ) : (
      <CenteredInfoText fontSize="12px" bold monospace>
        * NO FEES ON
        <br />
        ELEVATE TX
      </CenteredInfoText>
      )}
    </Flex>
  )
}

export default FarmCardUserElevate
